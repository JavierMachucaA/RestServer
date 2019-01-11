const express = require('express')
const app = express()
const Usuario = require('../models/usuario.model')

app.get('/usuarios', function (req, res) {
    res.json('get usuarios')
})

app.post('/usuarios', function (req, res) {
    
    let body = req.body
    
    let usuario = new Usuario({
        nombre : body.nombre,
        email:body.email,
        password:body.password,
        role: body.role
    })
    
    usuario.save((err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                status: false,
                mensaje: err
            })
        }
       
        res.json({
            status : true,
            usuario : usuarioDB
        })
    })

})

app.put('/usuarios/:id', function (req, res) {
    let id = req.params.id
    res.json({ id })
})

app.delete('/usuarios', function (req, res) {
    res.json('delete usuarios')
})

module.exports = app 