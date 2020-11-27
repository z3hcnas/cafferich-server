/*user: zehcnas

pasword: h31GpgYeWYdNE9WN

mongodb+srv://zehcnas:<h31GpgYeWYdNE9WN></password>@cluster0.xgssz.mongodb.net/cafferich
*/
require('./config/config')


const express = require('express');
const mongoose = require('mongoose');
const path = require('path')

const app = express();

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.use(require('./routes/index'));

app.use(express.static(path.resolve(__dirname, '../public')))



mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err
    console.log('base de datos cargada');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});