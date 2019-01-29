const express = require('express')

const app = express()

app.get('/', function (req, res) {
    res.json('Hello World')
})

app.use(require('./categoria.route'))
app.use(require('./producto.route'))
app.use(require('./usuario.route'))
app.use(require('./login'))


module.exports = app;

