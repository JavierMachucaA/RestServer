const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const { verificaTokenImg,verificarToken } = require('../middleware/autenticacion');

app.get('/image/:tipo/:img',[verificaTokenImg], (req, res ) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            status: false,
            mensaje: ' Los tipos validos son  ' + tiposValidos.join(','),
        })
    }

    let pathImg = `../../uploads/${tipo}/${img}`;
    let rutaImagen = path.resolve(__dirname, pathImg);
    if(fs.existsSync(rutaImagen)){
        res.sendFile(rutaImagen);
    }else{
        let noImagePath = path.resolve(__dirname,'../assets/img/no-image.jpg');
        res.sendFile(noImagePath);
    }

})

module.exports = app;