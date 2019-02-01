const express = require('express')

const app = express()

const { verificarToken, verificaAdminRol } = require('../middleware/autenticacion')

const Producto = require('../models/producto.model')

/**
 * Trae todos los productos
 */
app.get('/productos', verificarToken, (req, res) => {
    let limite = Number(req.params.limite) || 10
    let desde = Number(req.params.desde) || 0
    Producto.find({})
        .skip(desde)
        .limit(limite)
        .populate('usuario', "nombre email ")
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    mensaje: err
                })
            }
            res.json({
                status: true,
                productos
            })
        })

});

/**
 * Buscar Prodcutos
 */
app.get('/productos/buscar/:termino',verificarToken, (req, res) => {
    let termino = req.params.termino
    
    let regex = new RegExp(termino,'i')

    Producto.find({nombre:regex})
    .populate('usuario','nombre')
    .exec((err,productos)=>{
        if (err) {
            return res.status(500).json({
                status: false,
                mensaje: err
            })
        }
        res.json({
            status: true,
            productos
        })
    })
    
});


/**
 * consultar un producto
 */
app.get('/producto/:id', verificarToken, (req, res) => {
    //populate : usuario categoria
    let id = req.params.id
    Producto.findById(id)
        .populate('usuario', "nombre email ")
        .populate('categoria', 'descripcion')
        .exec((err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    mensaje: err
                })
            }
            if (!productoBD) {
                return res.status(400).json({
                    status: false,
                    mensaje: 'Id no es correcto'
                })
            }
            res.json({
                status: true,
                productoBD
            })
        })
});

/**
 * Crear Producto
 */
app.post('/producto', verificarToken, (req, res) => {
    //grabar usuario
    //grabar categoria
    let usuario = req.usuario._id

    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible || true,
        categoria: body.categoria,
        usuario: usuario
    })

    producto.save((err, productoBD) => {
        if (err) {
            return res.status(500).json({
                status: false,
                mensaje: err
            })
        }
        res.json({
            status: true,
            producto: productoBD
        })
    })
});

/**
 * Modificar producto
 */
app.put('/producto/:id', [verificarToken, verificaAdminRol], (req, res) => {
    //grabar usuario
    //grabar categoria
    let usuario = req.usuario._id
    let id = req.params.id

    let body = req.body;
    let producto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible || true,
        categoria: body.categoria,
        usuario: usuario
    }

    Producto.findByIdAndUpdate(id, producto, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                status: false,
                mensaje: err
            })
        }

        if (!productoBD) {
            return res.status(400).json({
                status: false,
                mensaje: 'Id no es correcto'
            })
        }

        res.json({
            status: true,
            producto: productoBD
        })
    })

});

/**
 * Eliminar Producto
 */
app.delete('/producto/:id', [verificarToken, verificaAdminRol], (req, res) => {
    //disponible false
    let id = req.params.id
    let disponible = {
        disponible: false
    }
    let  options = {new:true}
    Producto.findByIdAndUpdate(id, disponible,options, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                status: false,
                mensaje: err
            })
        }
        if (!productoBD) {
            return res.status(400).json({
                status: false,
                mensaje: 'Id no es correcto'
            })
        }
        res.json({
            status: true,
            producto: productoBD
        })
    })
})

module.exports = app