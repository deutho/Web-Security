const express = require('express')
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const timeout = require('connect-timeout');
const cors = require('cors')

const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD

const MongoDB_URI = "mongodb://"+username+":"+password+"@mongodb:27017"

const port = 8081
var schema;
var db;

app.use(timeout('20s')); //set 20s timeout for all requests


//cors options upload
var corsOptionsUpload = {
    origin: 'http://localhost:8080',
    methods: ['POST'],
    allowedHeaders: ['Content-Type'],
    crededtials: true
}

//cors options get files
var corsOptionsFiles = {
    origin: 'http://localhost:4200',
    methods: ['GET'],
    allowedHeaders: ['Content-Type'],
    crededtials: true
}

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

app.get('/', (req, res) => {
    res.status(200).send('ok')
})

app.get('/files', cors(corsOptionsFiles), async (req, res) => {
    //get all files and send them
    res.send(JSON.stringify(await Model.find()))
})

app.post('/upload', cors(corsOptionsUpload), async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    
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
        
        image_doc.save((err, doc) => {
            if (err) {
                res.status(500)
                res.end(JSON.stringify({status:'Database unavailable'}))
            } 
            res.status(200)
            res.end(JSON.stringify({status:'success'}))
        })

    }
})