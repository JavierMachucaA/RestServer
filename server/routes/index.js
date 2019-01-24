const express = require('express')

const app = express()

app.get('/', function (req, res) {
    res.json('Hello World')
})

app.use(require('./usuarioRoutes'))
app.use(require('./login'))


module.exports = app;

