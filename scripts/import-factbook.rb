require 'json'
require 'pp'
require 'sqlite3'
require 'csv'

file = File.read('factbook.json')
data_hash = JSON.parse(file)
puts data_hash.keys
def degree_convert(degrees) 
    pos = degrees['degrees'].to_f + degrees['minutes'].to_f/60.0
    if (degrees['hemisphere'] == 'S' || degrees['hemisphere']=='W') 
        pos = pos * -1
    end
    return pos
end
begin 
    db = SQLite3::Database.new "../countries.db"
    db.execute "drop table if exists Countries"
    db.execute "CREATE TABLE IF NOT EXISTS Countries (id text,iso int, name text, population int, longitude float, latitude float)"
    countries = data_hash['countries'].keys
    countries.each {|country|
        if (data_hash['countries'][country]['data'].key?('people'))
            population = data_hash['countries'][country]['data']['people']['population']['total']
            #puts country
            name = data_hash['countries'][country]['data']['name']

            if (country == 'world')
                latitude = nil
                longitude = nil
                db.execute("INSERT INTO Countries(id, name, population, longitude, latitude) values (?,?,?,?,?)",
                ['world', 'Earth', population, 0, 0])
            elsif (!data_hash['countries'][country]['data']['geography']['geographic_coordinates'])
                puts country
            else
            
                latitude = degree_convert(data_hash['countries'][country]['data']['geography']['geographic_coordinates']['latitude'])
                longitude = degree_convert(data_hash['countries'][country]['data']['geography']['geographic_coordinates']['longitude'])
                puts "#{name} -> #{latitude} #{longitude} #{population}"
                db.execute("INSERT INTO Countries(id, name, population, longitude, latitude) values (?,?,?,?,?)",
                    [country, name, population, longitude, latitude])
            end
        
        end
    }
    isotable=CSV.read('isocodes.csv')
    isotable.each {|row|
        name = row[1].chomp()
        puts name, "<"
        db.execute   "Update Countries set iso=? where upper(name)=upper(?)", [row[0], name]
    }
rescue SQLite3::Exception => e 
    byebug
    puts "Exception occurred"
    puts e.inspect()
    
ensure
    db.close if db
end
pp data_hash['countries']['yemen']['data']['name']

#{"latitude"=>{"degrees"=>15, "minutes"=>0, "hemisphere"=>"N"}, "longitude"=>{"degrees"=>48, "minutes"=>0, "hemisphere"=>"E"}}

