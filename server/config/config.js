//########################
//Puerto
//########################
process.env.PORT = process.env.PORT || 8000;

//########################
//entorno
//########################
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//########################
//expiracion
//########################

process.env.EXPIRATION_SESSION = 60*60*24*30

//########################
//seed
//########################
process.env.SEED = 'seed-dev'

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;