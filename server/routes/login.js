const express = require('express')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(process.env.CLIENT_ID);

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

// Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}

app.post('/google',async (req,res)=>{
    let token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });
    /*res.json({
        usuario: googleUser
    })*/
    let condiciones = { email: googleUser.email }
    Usuario.findOne( condiciones, (err,usuarioDB)=>{
        if(err){
            return res.status(500).json({ 
                status: false,
                mensaje: err
            });
        }

        if( usuarioDB ){
            if( usuarioDB.google == false ){
                return res.status(400).json({ 
                    status: false,
                    mensaje: 'Debe de usar su autenticación normal'
                });
            }else{

                let token = jwt.sign({
                    usuarioDB,
                },process.env.SEED,{expiresIn : process.env.EXPIRATION_SESSION})

                return res.json({
                    status: true,
                    usuario: usuarioDB,
                    token
                })
            } 
        }else{ //si el usuari no existe en la bd
            let usuario = new Usuario()

            usuario.nombre = googleUser.nombre
            usuario.email = googleUser.email
            usuario.img = googleUser.img
            usuario.google = true
            usuario.password = ':)'

            usuario.save( (err,usuarioDB)=>{
                if(err){
                    return res.status(500).json({
                        status : false,
                        err
                    })
                }
                
                let token = jwt.sign({
                    usuario,
                },process.env.SEED,{expiresIn : process.env.EXPIRATION_SESSION})

                return res.json({
                    status: true,
                    usuario: usuarioDB,
                    token
                })
            })
        }

        


    })

})



module.exports = app 