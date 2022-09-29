const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const multer = require('multer')
const upload = multer()
const timeout = require('connect-timeout');
const sharp = require('sharp')
const cors = require('cors')
const http = require('http');

/* CONSTANTS */
const port = 8080
const MAX_SIZE = 1048576;   // Maximum file size allowed to be uploaded = 1MB


/* ***API OPTIONS (Body Parser, CORS, Timeout)*** */
app.use(timeout('20s'));

app.options('/sanitize', cors()) //Allow pre flight request on this route

var corsOptions = {
    origin: 'http://localhost:4200',
    methods: ['POST'],
    allowedHeaders: ['Content-Type'],
    crededtials: true
}

app.use(bodyParser.json({limit: '5mb'}))
app.use(bodyParser.urlencoded({limit: '5mb', extended: true }));


/* ***Samples of first chars of Buffer to identify file types based on raw data*** */
var image_magic_strings = {
    jpg: 'ffd8ffe0',
    png: '89504e47'
};

/**
 * Health checker route
 */
app.get('/', (req, res) => {
    res.status(200).send('ok')
})

/**
 * Sanitization route
 * CORS Policy - only reachable from the frontend
 */
app.post('/sanitize', cors(corsOptions), upload.single('file'), async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    
    if (req.file == undefined && req.file == {}) {
        res.status(400)
        res.end(JSON.stringify({status:'No File'}))
    }
    else {
        // first security checks - same as in frontend
        if (req.file.size < MAX_SIZE &&                                                             //check max File Size (1MB)          
            !req.file.originalname.includes("/") &&                                                 //check for propably malicious delimiters e.g. “/file.jpg/index.php”
            !req.file.originalname.includes(";") &&                                                 //check for propably malicious delimiters e.g. “file.asp;.jpg”
            !(req.file.originalname.indexOf(".", req.file.originalname.indexOf(".")+1) != -1)&&     //check for double extension attack e.g. image.pdf.png
            req.file.originalname.length < 34                                                       //check if file name is reasonably short
            ) {}
        else {
            res.status(400)
            res.end(JSON.stringify({status:'File violates security measures'}))
        }

        var is_jpg;

        //check for mime type with first bytes in hex encoding: https://stackoverflow.com/questions/8473703/in-node-js-given-a-url-how-do-i-check-whether-its-a-jpg-png-gif/8475542#8475542
        var magic_number = req.file.buffer.toString('hex', 0, 4);
        if (magic_number == image_magic_strings.jpg) is_jpg = true;
        else if (magic_number == image_magic_strings.png) is_jpg = false;
        else {
            res.status(400)
            res.end(JSON.stringify({status:'Only PNG and JPG files are allowed'}))
        }

        /**
         * Library sharp is used to convert the image from png to jpg and vice versa
         */

        if (is_jpg) {
            sharp(req.file.buffer).toFile("temp.png", (err, info) => {
                if (err) {
                    global_res.status(500)
                    global_res.end(JSON.stringify({status:'Error converting the image'}))
                }
                sharp("temp.png").toBuffer().then(data =>  {
                    post_image(data, req.file.originalname.slice(0, -3)+"png", res)
                })
            })
        }

        else {
            sharp(req.file.buffer).toFile("temp.jpg", (err, info) => {
                if (err) {
                    global_res.status(500)
                    global_res.end(JSON.stringify({status:'Error converting the image'}))
                }
                sharp("temp.jpg").toBuffer().then(data =>  {
                    console.log(data)
                    post_image(data, req.file.originalname.slice(0, -3)+"jpg", res)
                })
            })
        }
    }
});

/**
 * Helper function to post the image to the database in base64
 * @param {*} image The image itself as buffer
 * @param {*} filename The filename of the image
 * @param {*} global_res The response element
 */
async function post_image(image, filename,  global_res) {

        //convert image to base64 from image buffer
        var base64 = Buffer.from(image).toString("base64")
        
        //check for multiple encodings to hide attack payload
        if (base64.substring(0,4) !== "Vm0wd") {

            //here send data to the frontend to store
            /*send to backend and forward status */
            payload = JSON.stringify({data: base64, filename: filename})


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
                    global_res.setHeader('Content-Type', 'application/json')
                    global_res.status(200)
                    global_res.end(JSON.stringify({status:'success'}))
                });

            });

            post_req.on('error', (error) => {
                global_res.status(503)
                global_res.end(JSON.stringify({status:'Error saving the image - please try again later'}))
            });

            
            //post data and send the request
            post_req.write(payload);
            post_req.end()

            

        } else {
            res.status(400)
            res.end(JSON.stringify({status:'Unsecure Image Encoding'}))
        }  
}

/**
 * Starting up the Express Server
 */
app.listen(port, () => {
    console.log('Sanitizing Service started!')
})
