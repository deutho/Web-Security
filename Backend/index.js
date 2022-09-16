const express = require('express')
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const MongoDB_URI = "mongodb://websecurity:secure_password!@mongodb:27017"

const port = 8081

//CORS Headers
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//Parse the Request Body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())


//Connect to the Database

mongoose.connect(
    MongoDB_URI, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(
        () => { console.log("Connected to Database")},
        err => { console.log("Error connecting to database", err)}
    );


app.listen(port, () => {
    console.log('Backend started!')
})

app.get('/files', (req, res) => {
    //get all files and send them

    res.send("dummy")
})

app.post('/upload', async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    console.log(req);

    console.log(req.file.originalname)
    if (req.file == undefined && req.file == {}) {
        res.status(400)
        res.end(JSON.stringify({status:'error'}))
    }
    else {
        //store to mongoDB and send success
        




        /*
        //check for multiple encodings to hide attack payload
        if (base64.substring(0,4) !== "Vm0wd") {

            images[images.length] = base64
            //send to backend and forward status

            res.setHeader('Content-Type', 'application/json')
            res.status(200)
            res.end(JSON.stringify({status:'success'}))

        } else {
            res.status(400)
            res.end(JSON.stringify({status:'error'}))
        } */
    }
})