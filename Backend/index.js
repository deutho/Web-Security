const express = require('express')
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const MongoDB_URI = "mongodb://websecurity:secure_password!@mongodb:27017"
//const MongoDB_URI = "mongodb://websecurity:secure_password!@localhost:27017"

const port = 8081
var schema;
var db;

//CORS Headers
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//Parse the Request Body

app.use(bodyParser.json({limit: '5mb'}))
app.use(bodyParser.urlencoded({limit: '5mb', extended: true }));

//Connect to the Database

//build schema for DB and set Model
this.schema = mongoose.Schema({
    "name": String,
    "timeStamp": Number,
    "image": String
    });
const Model = mongoose.model("model", this.schema, "images");


mongoose.connect(
    MongoDB_URI, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(
        () => { 


            this.db = mongoose.connection;
            //report successfull start
            console.log("Connected to Database")},
        err => { 
            console.log("Error connecting to database", err)
        }
    );

app.listen(port, () => {
    console.log('Backend started!')
})

app.get('/files', async (req, res) => {
    //get all files and send them
    
    res.send(JSON.stringify(await Model.find()))
})

app.post('/upload', async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    //console.log(req);


    if (req.body == undefined || req.body == {}) {
        res.status(400)
        res.end(JSON.stringify({status:'No File'}))
    }
    else {
        //store to mongoDB and send success
        body = req.body.data
        filename = req.body.filename


        
        image_doc = new Model({
            "name": filename,
            "timeStamp": Date.now(),
            "image": body
        })
        console.log(image_doc)
        
        image_doc.save((err, doc) => {
            if (err) return console.error(err);
            console.log("Document inserted succussfully!");
        })

    }
})