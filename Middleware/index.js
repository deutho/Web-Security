const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const multer = require('multer')

var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

const port = 8080
let upload = multer()
var images = []

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



app.post('/upload', upload.single('file'), async (req, res) => {
    res.setHeader('Content-Type', 'application/json')

    console.log(req.file.originalname)
    if (req.file == undefined && req.file == {}) {
        res.status(400)
        res.end(JSON.stringify({status:'error'}))
    }
    else {
    
        //convert image to base64 from image buffer
        var base64 = Buffer.from(req.file.buffer).toString("base64")
        
        //check for multiple encodings to hide attack payload
        if (base64.substring(0,4) !== "Vm0wd") {

            //images[images.length] = base64


            /*send to backend and forward status */
            payload = JSON.stringify(base64)
                        
            //An object of options to indicate where to post to
            post_options = {
                host: 'localhost',
                port: '8081',
                path: '/upload',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(req.file.buffer)
                }
            };

            // Set up the request
            var post_req = http.request(post_options, function(res) {
                res.setEncoding('utf8');
                res.on('data',  (chunk) => {
                    console.log('Response: ' + chunk);
                });
            });

            //post data
            post_req.write(req.file.buffer);
            post_req.end();

            res.setHeader('Content-Type', 'application/json')
            res.status(200)
            res.end(JSON.stringify({status:'success'}))

        } else {
            res.status(400)
            res.end(JSON.stringify({status:'error'}))
        } 
    }
})


app.listen(port, () => {
    console.log('Middleware started!')
})
