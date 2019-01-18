const express = require('express')

const bcrypt = require('bcryptjs')

const _ = require('underscore')

var salt = bcrypt.genSaltSync(12);

const Usuario = require('../models/usuario.model')

const app = express()

const log = require('../../utils/logger')

app.get('/usuarios', function (req, res) {
    let desde = req.query.desde || 1 
    desde = Number(desde) - 1
    let limite =  req.query.limite || 6 
    limite = Number(limite) - 1
    let condiciones = {estado:true} //google:true
    let campos = 'nombre email role estado google img'
    Usuario.find(condiciones,campos)
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
        Usuario.countDocuments(condiciones,(error,conteo)=>{
            res.json({
                status: true,
                mensaje: usuarios,
                total:conteo
            })
        })
    })
})

app.post('/usuarios', function (req, res) {
    
    let body = req.body
    
    let usuario = new Usuario({
        nombre : body.nombre,
        email:body.email,
        password: bcrypt.hashSync(body.password, salt),
        role: body.role,
        estado: true,
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

app.delete('/usuario/:id', function (req, res) {
    
    let id = req.params.id

    /*Usuario.findByIdAndRemove(id,(err,usuario)=>{
        if(err){
            return res.status(400).json({
                status: false,
                mensaje: err
            })
        }
        if(!usuario){
            return res.status(400).json({
                status: false,
                mensaje: "Usuario no es encontrado"
            })
        }
        res.json({
            status: false,
            usuario: usuario
        })
    })*/
    let cambiaEstado = { estado : false }
    let  options = {new:true}
    Usuario.findByIdAndUpdate(id,cambiaEstado,options,(err,usuario)=>{
        if(err){
            return res.status(400).json({
                status: false,
                mensaje: err
            })
        }
        if(!usuario){
            return res.status(400).json({
                status: false,
                mensaje: "Usuario no es encontrado"
            })
        }
        log(usuario)
        res.json({
            ok: true,
            usuario: usuario
        });
        
    })

})

module.exports = app 