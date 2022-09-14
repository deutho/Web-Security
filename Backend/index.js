const express = require('express')
const app = express()
const bodyParser = require("body-parser")

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



app.listen(port, () => {
    console.log('Backend started!')
})