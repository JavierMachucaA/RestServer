//Exportación de configuraciones
require('./config/config')
//Exportacion de paquetes js
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const puerto = 8000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.json('Hello World')
})

app.get('/usuarios', function (req, res) {
    res.json('get usuarios')
})

app.post('/usuarios', function (req, res) {
    let body = req.body

    if (body.nombre == undefined) {
        res.status(400).json({
            status: false,
            mensaje: "Nombre es necesario"
        })
    }else{
        res.json({ persona: body })
    }
})

app.put('/usuarios/:id', function (req, res) {
    let id = req.params.id
    res.json({ id })
})

app.delete('/usuarios', function (req, res) {
    res.json('delete usuarios')
})

app.listen(process.env.PORT, () => {
    console.log("Iniciando servidor ..", process.env.PORT);
});