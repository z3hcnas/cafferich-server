const express = require('express');
const app = express()

const bcrypt = require('bcrypt');
const _ = require('underscore')


const { Mongoose } = require('mongoose');
const Usuario = require('../models/usuario')
const { verificaToken, verificaAdmin_Role } = require('../middelwares/authentication')
const { checkErr } = require('../otherServerFuncts/uploadFuncts')

app.get('/usuario', verificaToken, (req, res) => {
    console.log(req.body)
    let desde = Number(req.query.desde) || 0
    let limite = Number(req.query.limite) || 5
    let tipoDeUsuario = { estado: true }


    Usuario.find(tipoDeUsuario, 'nombre email estado google role img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            checkErr(res, err)
            Usuario.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    usuario: usuarios,
                    conteo: conteo
                })
            })
        })
})


app.post('/usuario', function(req, res) {
    var body = req.body
    console.log(body)

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, userdb) => {
        checkErr(res, err)

        res.json({
            ok: true,
            usuario: userdb
        })
    })


})

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'role', 'estado'])
    console.log(body);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userdb) => {
        checkErr(res, err)

        res.json({
            ok: true,
            usuario: userdb
        })
    })
})


app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    let id = req.params.id
    let cambia = { estado: false }
    Usuario.findByIdAndUpdate(id, cambia, { new: true }, (err, usuarioBorrado) => {
        checkErr(res, err)
        if (usuarioBorrado === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no encontrado"
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado,
            id: id
        })
    })

})



module.exports = app