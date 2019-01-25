//########################
//Verificar token
//########################
const jwt = require('jsonwebtoken')

let verificarToken = (req,res,next) => {
    let token = req.get('token')
    let SEED = process.env.SEED
    jwt.verify(token,SEED, (err, decode)=>{
        if(err){
            return res.status(400).json({
                status:false,
                mensaje : 'Token no válido'
            })
        }
        req.usuario = decode.usuario;
        next()
    })
}

let verificaAdminRol = (req,res,next) => {
    
    let usuario = req.usuario;

    if(usuario.role!=='ADMIN_ROLE'){
        return res.json({
            status : false,
            mensaje:  'Usuario no es administrador'
        })
    }
    next()
}
module.exports = {verificarToken,verificaAdminRol}