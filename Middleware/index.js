const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const multer = require('multer')
const timeout = require('connect-timeout');


var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

const port = 8080
let upload = multer()
var images = []

app.use(timeout('20s')); //set 20s timeout for all requests

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

    
    if (req.file == undefined && req.file == {}) {
        res.status(400)
        res.end(JSON.stringify({status:'No File'}))
    }
    else {
    
        
        try {
            //convert image to base64 from image buffer
            var base64 = Buffer.from(req.file.buffer).toString("base64")
            
            //check for multiple encodings to hide attack payload
            if (base64.substring(0,4) !== "Vm0wd") {

                /*send to backend and forward status */
                payload = JSON.stringify({data: base64, filename: req.file.originalname})
                //An object of options to indicate where to post to
                post_options = {
                    host: 'nodebackend',
                    port: '8081',
                    path: '/upload',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(payload)
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
                post_req.write(payload);
                post_req.end();

                res.setHeader('Content-Type', 'application/json')
                res.status(200)
                res.end(JSON.stringify({status:'success'}))

            } else {
                res.status(400)
                res.end(JSON.stringify({status:'Unsecure Base64 String'}))
            } 
        } catch(e) {
            res.status(400)
            res.end(JSON.stringify({status:'Bad Request'}))
        }
    }
})


app.listen(port, () => {
    console.log('Middleware started!')
})
