const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();

//default optins

app.use(fileUpload());

app.put('/upload', (req, res) => {
    if (!req.files) {
        return res.status(400).json({
            status: false,
            mensaje: err
        })
    }
    let archivo = req.files.archivo;
    
    //extensiones permitidas
    let extensiones = ['png','jpg','gif','jpeg'];
    let nombreArchivo = archivo.name.split('.');
    let extensionArchivo = nombreArchivo[nombreArchivo.length-1];
    
    
    const validExtensions = ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'];
    
    if(extensiones.indexOf(extensionArchivo) < 0){
        return res.status(400).json({
            status: false,
            mensaje: ' Las extensiones validasn son '+ extensiones.join(','),
        })
    }

    archivo.mv(`uploads/${archivo.name}`, (err) => {
        if (err) {
            return res.status(500).json({
                status: false,
                mensaje: err
            });
        }
        res.json({
            status: true,
            mensaje: 'imagen importada exitamente'
        });
    })
});

module.exports = app;
