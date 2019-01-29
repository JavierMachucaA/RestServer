const express = require('express')

let { verificarToken,verificaAdminRol } = require('../middleware/autenticacion')

let app = express()

let Categoria = require('../models/categoria.model')
/**
 * Mostrar todas las categorias
 */
app.get('/categorias',verificarToken, (req, res) => {

    Categoria.find({})
    .sort({descripcion:'asc'})
    .populate('usuario','nombre email')
    .exec((err,categorias)=>{
        if (err) {
            return res.status(500).json({
                status: false,
                mensaje: err
            })
        }
        res.json(
            {
                status: true,
                categorias: categorias
            }
        )
    })

})

/**
 * Mostrar una categoria
 */
app.get('/categoria/:id',verificarToken, (req, res) => {
    let id = req.params.id

    Categoria.findById(id,(err,categoriaDB)=>{
        if (err) {
            return res.status(500).json({
                status: false,
                mensaje: err
            })
        }
        if(!categoriaDB){
            return res.status(500).json({
                status: false,
                mensaje: 'Id no es correcto'
            })
        }
        res.json(
            {
                status: true,
                categoria: categoriaDB
            }
        )
    })
    
})

/**
 * Crear nueva categoria
 */
app.post('/categoria', verificarToken, (req, res) => {
    //regresa una nueva categoría
    //req.usuario._id
    let body = req.body

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                status: false,
                mensaje: err
            })
        }
        if (!categoriaDB) {
            return res.status(500).json({
                status: false,
                mensaje: err
            })
        }
        console.log("Se crea categoria :", body.descripcion);

        res.json({
            status: true,
            categoria: categoriaDB
        })

    })


})

/**
 * Actualizar nombre de una categoría
 */
app.put('/categoria/:id',verificarToken, (req, res) => {
    let id = req.params.id
    let descripcion = req.body.descripcion

    let descripcionCategoria = {
        descripcion: descripcion,
    }
    let options = {} //{ new: true, runValidators: true };
    Categoria.findByIdAndUpdate(id, descripcionCategoria, options, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                status: false,
                mensaje: err
            })
        }
        if (!categoriaDB) {
            return res.status(500).json({
                status: false,
                mensaje: err
            })
        }
        console.log("Se modifica categoria :", req.body.descripcion);

        res.json({
            status: true,
            categoria: categoriaDB
        })

    })

})

/**
 * Borrar categorias
 */
app.delete('/categoria/:id',[verificarToken,verificaAdminRol], (req, res) => {
    //solo el admin puede eliminar 
    let id = req.params.id

    Categoria.findByIdAndRemove(id,(err,categoriaDB)=>{
        if (err) {
            return res.status(500).json({
                status: false,
                mensaje: err
            })
        }
        if (!categoriaDB) {
            return res.status(500).json({
                status: false,
                mensaje: err
            })
        }
        res.json({
            status: true,
            mensaje: 'Categoria borrada' 
        })  
    })


});

module.exports = app