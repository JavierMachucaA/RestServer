const express = require('express')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario.model')

const app = express()

app.post('/login',(req,res)=>{

    let body = req.body;
    
    Usuario.findOne({ email : body.email },(err, usuario)=>{
        if(err){
            return res.status(500).json({ 
                status: false,
                mensaje: err
            });
        }
        
        if(!usuario){
            return res.status(400).json({ 
                status: false,
                code:1,
                mensaje: 'usuario y contraseña incorrectos '
            });
        }
        if(!bcrypt.compareSync( body.password , usuario.password)){
            return res.status(400).json({ 
                status: false,
                code:2,
                mensaje: 'usuario y contraseña incorrectos '
            });
        }

        let token = jwt.sign({
            usuario,
        },process.env.SEED,{expiresIn : process.env.EXPIRATION_SESSION})

        res.json({
            status: true,
            code:0,
            usuario,
            token: token
        })
    })

})



module.exports = app 