const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const fs = require('fs')
const multer = require('multer')
const { resourceLimits } = require('worker_threads')

//CORS Headers
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

const port = 8080

var images = []
let upload = multer()

app.post('/upload', upload.single('file'), (req, res) => {
    res.setHeader('Content-Type', 'application/json')

    console.log(req.file.originalname)
    if (req.file == undefined && req.file == {}) {
        res.status(400)
        res.end(JSON.stringify({status:'error'}))
    }
    else {
    

        //convert image to base64 Buffer
        // var base64 = fs.readFileSync(req.file, "base64");
        // var buffer = Buffer.from(base64, "base64");
        
        // images[images.length] = buffer

        res.setHeader('Content-Type', 'application/json')
        res.status(200)
        res.end(JSON.stringify({status:'success'}))
    }
})

app.get('/files', (req, res) => {
    res.send(images)
})


app.listen(port, () => {
    console.log('App started!')
})