// Create express app
var express = require("express")
var api = express()
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../countries.db');

// Server port
var HTTP_PORT = 8000 
// Start server
api.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
api.use(express.static('public'))
api.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});
api.get("/api/countries/:id", (req, res, next) => {
    var ident=req.params.id
    sql = "select * from countries where id=?"
    db.get(sql, [ident],(err,row) => {
        if (err) {
            res.status(404)
        }
        else {
            res.json(row)
        }
    })
    
});
api.get("/api/countries", (req, res, next) => {
    var ident=req.params.id
    sql = "select id,iso, name from countries"
    db.all(sql, [ident],(err,row) => {
        if (err) {
            res.status(404)
        }
        else {
            res.json(row)
        }
    })
    
});

// Insert here other API endpoints

// Default response for any other request
api.use(function(req, res){
    res.status(404);
});
