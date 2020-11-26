// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
//  fehca de expiracion token
// ============================


// ============================
//  token seed
// ============================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30


// ============================
//  Base de datos
// ============================
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarollo'


let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cofferich';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;


// ============================
//  Google client
// ============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '455784184405-j8o8tj2jmv30n0f0hgtj4pqs79b83dg8.apps.googleusercontent.com'