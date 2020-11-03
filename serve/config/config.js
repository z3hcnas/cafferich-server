// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

// ============================
//  Puerto
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


// ============================
//  Puerto
// ============================

let urlDB

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb: //localhost:27017/coffeRich'
} else {
    urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB