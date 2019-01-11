const mongoose = require('mongoose')

let Schema = mongoose.Schema

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email:{
        type: String,
        required : [true,'Email es requerido']
    },
    password:{
        type: String,
        required: [true,'Password es requerido']
    },
    img:{
        type: String,
        required: false
    },
    role:{
        type:String,
        default:'USER_ROLE'
    },
    estado:{
        type:Boolean,
        default:false
    },
    google:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('Usuario',usuarioSchema)