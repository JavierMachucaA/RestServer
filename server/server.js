//Exportación de configuraciones
require('./config/config')
//Exportacion de paquetes js
const express = require('express')
const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const bodyParser = require('body-parser')
const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.json('Hello World')
})

app.use(require('./routes/usuario.routes'))

mongoose.connect(process.env.URLDB,{ useNewUrlParser: true },
    (err,res)=>{
        console.log("Base de datos Conectada ...")
    }
)

app.listen(process.env.PORT, () => {
    console.log("Iniciando servidor ..", process.env.PORT);
});