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
                mensaje : err
            })
        }
        req.usuario = decode.usuario;
        next()
    })

}

module.exports = verificarToken