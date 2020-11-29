const express = require('express');
const app = express()
const fileUpload = require('express-fileupload');
const { verificaToken } = require('../middelwares/authentication');
const {
    checkErr,
    imagenUsuario,
    imagenProducto,
} = require('../otherServerFuncts/uploadFuncts')

app.use(fileUpload())

app.put('/upload/:tipo/:id', verificaToken, function(req, res) {
    let tipo = req.params.tipo
    let id = req.params.id

    let tiposPermitidos = ['productos', 'usuarios']
    if (tiposPermitidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'tipo introducido no correcto los correctos son:',
                tiposPermitidos
            }
        })
    }
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: { message: 'no has cargado ningun archivo' }
        })
    }


    let archivo = req.files.archivo

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']
    let nombreArchivoCortado = archivo.name.split('.')
    let extension = nombreArchivoCortado[nombreArchivoCortado.length - 1]

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'extension no valida, solo se permiten',
                extensionesValidas
            }
        })
    }

    //cambiaar nombre al archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        checkErr(res, err)

        //imagen cargada

        if (tipo == 'usuarios') {
            imagenUsuario(id, res, nombreArchivo, tipo)
        } else {
            imagenProducto(id, res, nombreArchivo, tipo)
        }
    })
})

module.exports = app