const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const multer = require('multer')
const timeout = require('connect-timeout');
const jimp = require('jimp')
const axios = require('axios')


var http = require('http');
const Jimp = require('jimp');

const port = 8080
let upload = multer()

app.use(timeout('20s')); //set 20s timeout for all requests

//CORS Headers
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//Parse the Request Body with 5mb size limit
app.use(bodyParser.json({limit: '5mb'}))
app.use(bodyParser.urlencoded({limit: '5mb', extended: true }));


var image_magic_strings = {
    jpg: 'ffd8ffe0',
    png: '89504e47'
};




app.post('/sanitize', upload.single('file'), async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    
    if (req.file == undefined && req.file == {}) {
        res.status(400)
        res.end(JSON.stringify({status:'No File'}))
    }
    else {
        
        var is_jpg;

        //check for mime type with first bytes in hex encoding: https://stackoverflow.com/questions/8473703/in-node-js-given-a-url-how-do-i-check-whether-its-a-jpg-png-gif/8475542#8475542

        var magic_number = req.file.buffer.toString('hex', 0, 4);
        if (magic_number = image_magic_strings.jpg) is_jpg = true;
        else if (magic_number = image_magic_strings.png) is_jpg = false;
        else {
            res.status(400)
            res.end(JSON.stringify({status:'Only png and jpg allowed'}))
        }

        if (is_jpg) {

            //von jpg zu png konvertieren
            jimp.read(req.file.buffer, (error, image) => {
                if (error) {
                    //TODO Hier den richtigen Error werfen
                    console.log(error)
                }
                else {
                    image.write("converted_images/"+req.file.originalname+".png", (error, image) => {
                        if (error) {
                            //TODO Hier den richtigen Error werfen
                            console.log(error)
                        }
                        else {
                            console.log(image)
                            post_image(image, req.file.originalname, res)
                        }
                    })
                }
            })

        }

        else {
            //von png zu jpg konvertieren
        }
    }
});


function post_image(image, filename, res) {

        //convert image to base64 from image buffer
        var base64 = Buffer.from(image.bitmap.data).toString("base64")
        
        //check for multiple encodings to hide attack payload
        if (base64.substring(0,4) !== "Vm0wd") {

            //here send data to the frontend to store

            /*send to backend and forward status */
            payload = JSON.stringify({data: base64, filename: filename})


            // axios.post('http://localhost:8081/upload', payload).then(res => {

            // })
            // .catch(error => {
            //     //TODO throw meaningful error
            //     console.log(error);
            // });


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
       
}


app.listen(port, () => {
    console.log('Middleware started!')
})