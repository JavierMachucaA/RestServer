//########################
//Puerto
//########################
process.env.PORT = process.env.PORT || 8000;

//########################
//entorno
//########################
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


let urlDB;

/*if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {*/
    urlDB = 'mongodb://cafe-user:cafepass01@ds021462.mlab.com:21462/cafe';
//}
process.env.URLDB = urlDB;