import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CountriesService } from '../countries.service';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  countryList:[];
  id: string;
  name:string = '';
  population:number = 0;
  longitude:number = 0;
  latitude:number = 0;
  constructor(private route: ActivatedRoute, private countriesService:CountriesService, private router:Router) { }

  ngOnInit() {
    this.getData();
    this.router.events.subscribe((val) => {
      // see also 
      //console.log(val instanceof NavigationEnd)
      if(val instanceof NavigationEnd)  {
        this.getData();
        console.log("Getting data")
      }
  });
  }
  getData() {

    this.route.paramMap.subscribe(params => {
  
      this.id = params.get('id')
      this.countriesService.getCountryData(this.id).subscribe (
        data => {
          this.name = data['name']
          this.population = data['population']
          this.longitude = data['longitude']
          this.latitude = data['latitude']
        },
        error => {
          debugger;
        }
      )
      this.countriesService.getCountryList().subscribe(
        (data:[])=>{
          this.countryList=data;
        }
      )
      });
  }
}
