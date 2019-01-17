const express = require('express')

const bcrypt = require('bcryptjs')

const _ = require('underscore')

var salt = bcrypt.genSaltSync(12);

const Usuario = require('../models/usuario.model')

const app = express()

app.get('/usuarios', function (req, res) {
    let desde = req.query.desde || 1 
    desde = Number(desde) - 1
    let limite =  req.query.limite || 6 
    limite = Number(limite) - 1

    Usuario.find({})
    .skip(desde)
    .limit(limite)
    .exec(
        (err,usuarios)=>{
        if(err){
            return res.status(400).json({ 
                status: false,
                mensaje: err
            });
        }

        res.json({
            status: true,
            mensaje: usuarios
        })
    })
})

app.post('/usuarios', function (req, res) {
    
    let body = req.body
    
    let usuario = new Usuario({
        nombre : body.nombre,
        email:body.email,
        password: bcrypt.hashSync(body.password, salt),
        role: body.role
    })
    
    usuario.save((err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                status: false,
                mensaje: err
            });
        }
       
        res.json({
            status : true,
            usuario : usuarioDB
        });
    })

})

app.put('/usuarios/:id', function (req, res) {
    let id = req.params.id
    let body = _.pick( req.body,[
        'nombre',
        'email',
        'img',
        'role',
        'estado'
    ])
    let options = {new:true,runValidators:true}

    Usuario.findByIdAndUpdate(id, body, options ,(err, usuarioDB)=>{
        if(err){
            return res.status(400).json({
                status: false,
                mensaje: err
            })
        }

        res.json({
            status: true,
            mensaje: usuarioDB
         })
        
    })

})

app.delete('/usuarios', function (req, res) {
    res.json('delete usuarios')
})

module.exports = app 