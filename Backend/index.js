const express = require('express')
const app = express()
const fs = require('fs')
const port = 8080

var images = []


app.post('/upload' , (req, res) => {
    //convert image to base64 Buffer
    var base64 = fs.readFileSync(req.body.image, "base64");
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