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

process.env.EXPIRATION_SESSION = '48h'

//########################
//seed
//########################
process.env.SEED = 'seed-dev'

//########################
// Google Id
//########################
process.env.CLIENT_ID = process.env.CLIENT_ID || '328376953404-urod69mu9r9eak9kfmi3dq90odtfdc6f.apps.googleusercontent.com'


let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;