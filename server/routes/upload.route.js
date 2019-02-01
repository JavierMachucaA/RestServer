const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario.model');
const Producto = require('../models/producto.model');
//default optins

app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            status: false,
            mensaje: 'Archvios sin seleccionar'
        })
    }
    //valida tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            status: false,
            mensaje: ' Los tipos validos son  ' + tiposValidos.join(','),
        })
    }

    let archivo = req.files.archivo;

    //extensiones permitidas
    let extensiones = ['png', 'jpg', 'gif', 'jpeg'];
    let nombreArchivo = archivo.name.split('.');
    let extensionArchivo = nombreArchivo[nombreArchivo.length - 1];

    if (extensiones.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            status: false,
            mensaje: ' Las extensiones validasn son ' + extensiones.join(','),
        })
    }
    //cambiar nombre al archivo

    let nuevoNombreArchivo = `${id}-${new Date().getTime()}.${extensionArchivo}`;

    archivo.mv(`uploads/${tipo}/${nuevoNombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                status: false,
                mensaje: err
            });
        }

        //Aqui imagen se cargo
        if(tipo==='productos'){
            imagenProducto(id, res, nuevoNombreArchivo);
        }else{
            imagenUsuario(id, res, nuevoNombreArchivo);
        }
    })
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarImagen(nombreArchivo, 'usuarios');
            return res.status(500).json({
                status: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                status: false,
                mensaje: 'usuario no existe'
            });
        }

        borrarImagen(usuarioDB.img, 'usuarios'); 

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                status: true,
                usuario: usuarioGuardado,
                //img: usuarioGuardado.img
            })
        });
    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarImagen(nombreArchivo, 'usuarios');
            return res.status(500).json({
                status: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                status: false,
                mensaje: 'producto no existe'
            });
        }

        borrarImagen(productoDB.img, 'productos'); 

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            res.json({
                status: true,
                usuario: productoGuardado,
                //img: productoGuardado.img
            })
        });
    });
}

function borrarImagen(nombreArchivo, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;
