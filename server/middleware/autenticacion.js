//########################
//Verificar token
//########################
const jwt = require('jsonwebtoken')

let verificarToken = (req, res, next) => {
    let token = req.get('token')
    let SEED = process.env.SEED
    jwt.verify(token, SEED, (err, decode) => {
        if (err) {
            return res.status(400).json({
                status: false,
                mensaje: 'Token no válido (verificar token)'
            })
        }
        req.usuario = decode.usuario;
        next();
    })
}

let verificaAdminRol = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.json({
            status: false,
            mensaje: 'Usuario no es administrador'
        })
    }
    next()
}

//########################
//Verificar token
//########################
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token ? req.query.token : req.get('token');
    let SEED = process.env.SEED;
    jwt.verify(token, SEED, (err, decode) => {
        if (err) {
            return res.status(400).json({
                status: false,
                mensaje: 'Token no válido (verificar token imagen)'
            })
        }
        //req.setHeaders('token',token);
        //console.log(req);
        req.usuario = decode.usuario;
        next();
    })
}

module.exports = { verificarToken, verificaAdminRol,verificaTokenImg }