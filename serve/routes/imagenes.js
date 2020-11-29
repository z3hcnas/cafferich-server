const express = require('express');
const app = express()

const fs = require('fs')
const path = require('path');
const { verificaTokenImg } = require('../middelwares/authentication');

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo
    let img = req.params.img

    pathImg = `./uploads/${ tipo }/${ img }`
    let imagePath = path.resolve(__dirname, `../../uploads/${tipo}/${img}`)
    let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg')

    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath)
    } else {
        res.sendFile(noImagePath)
    }
})

module.exports = app