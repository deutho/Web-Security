const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const fs = require('fs')

//CORS Headers
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const port = 8080

var images = []


app.post('/upload' , bodyParser.raw({ type: ['image/jpeg', 'image/png'], limit: '5mb' }), (req, res) => {

    console.log(req.body)

    //convert image to base64 Buffer
    var base64 = fs.readFileSync(req.body, "base64");
    var buffer = Buffer.from(base64, "base64");
    
    images[images.length] = buffer

    res.send("Image converted to base64 and stored")

})

app.get('/files', (req, res) => {
    res.send(images)
})


app.listen(port, () => {
    console.log('App started!')
})