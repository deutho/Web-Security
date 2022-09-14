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