const express = require('express');
const app = express()
const fileUpload = require('express-fileupload');
const { result } = require('underscore');
const { verificaToken } = require('../middelwares/authentication');
const Usuario = require('../models/usuario')
const Producto = require('../models/producto')

const fs = require('fs')
const path = require('path')

function checkErr(res, err) {
    if (err) {
        return res.status(500).json({
            ok: false,
            err
        })
    }
}

function checkErrAndDelete(res, err, img) {
    if (err) {
        borrarImagen(img, 'usuarios')
        return res.status(500).json({
            ok: false,
            err
        })
    }
}

function borrarImagen(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`)
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen)
    }
}

function imagenUsuario(id, res, nombreArchivo, type) {
    Usuario.findById(id, (err, datadb) => {
        updateImg(err, datadb, nombreArchivo, type, res)
    })
}


function imagenProducto(id, res, nombreArchivo, type) {
    Producto.findById(id, (err, datadb) => {
        updateImg(err, datadb, nombreArchivo, type, res)
    })
}

function updateImg(err, datadb, nombreArchivo, type, res) {
    checkErrAndDelete(res, err, nombreArchivo)

    if (!datadb) {
        borrarImagen(nombreArchivo, type)
        return res.status(400).json({
            ok: false,
            err: { message: 'el usuario no existe' }
        })

    }

    borrarImagen(datadb.img, type)
    datadb.img = nombreArchivo
    datadb.save((err, data) => {
        checkErr(res, err)
        res.json({
            ok: true,
            data: data,
            img: nombreArchivo
        })

    })
}


module.exports = {
    checkErr,
    checkErrAndDelete,
    borrarImagen,
    imagenUsuario,
    imagenProducto,
    updateImg,
}