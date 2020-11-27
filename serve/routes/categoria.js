const express = require('express');
const app = express()

const Categoria = require('../models/categoria')

const { verificaToken, verificaAdmin_Role } = require('../middelwares/authentication');
const categoria = require('../models/categoria');



app.get('/categorias', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                categorias
            })

        })

})
app.get('/categoria/:id', verificaToken, (req, res) => {
    let categoryId = req.params.id
    Categoria.findById(categoryId, (err, categorydb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (categorydb === null) {
            return res.status(400).json({
                ok: false,
                err: { message: 'no existe la categoría solicitada' }
            })
        }

        res.json({
            ok: true,
            categorias: categorydb
        })
    })


})
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body
    let category = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })
    category.save((err, categorydb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categorydb) {
            return res.status(400).json({
                ok: false,
                err
            })
        }


        res.json({
            ok: true,
            categoria: categorydb
        })

    })
})
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let categoryId = req.params.id
    Categoria.findByIdAndDelete(categoryId, (err, categoryDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (categoryDeleted === null) {
            return res.status(400).json({
                ok: false,
                err: { message: 'no existe la categoría solicitada' }
            })
        }


        res.json({
            ok: true,
            categoriaBorrada: categoryDeleted
        })
    })

})
app.put('/categoria/:id', verificaToken, (req, res) => {
    let categoryId = req.params.id
    let newDescription = req.params.descripcion

    categoria.findByIdAndUpdate(categoryId, newDescription, (err, categoryUpdated) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (categoryUpdated === null) {
            return res.status(400).json({
                ok: false,
                err: { message: 'no existe la categoría solicitada' }
            })
        }


        res.json({
            ok: true,
            categoriaActualizada: categoryUpdated
        })
    })

})


module.exports = app