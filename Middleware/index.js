const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const multer = require('multer')

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

            images[images.length] = base64

            res.setHeader('Content-Type', 'application/json')
            res.status(200)
            res.end(JSON.stringify({status:'success'}))

        } else {
            res.status(400)
            res.end(JSON.stringify({status:'error'}))
        } 
    }
})

app.get('/files', (req, res) => {
    res.send(images)
})


app.listen(port, () => {
    console.log('Middleware started!')
})
