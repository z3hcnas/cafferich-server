const express = require('express');
const app = express()

const { verificaToken } = require('../middelwares/authentication');
let Producto = require('../models/producto')
const _ = require('underscore')


// obetener productos


app.get('/productos', verificaToken, (req, res) => {
    Producto.find({ disponible: true })
        .sort('nombre')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })

        })
})


//find by id
app.get('/producto/:id', verificaToken, (req, res) => {
    let product_id = req.params.id
    Producto.findById(product_id, { disponible: true })
        .sort('nombre')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (producto.disponible === false) {
                return res.status(400).json({
                    ok: false,
                    err: { message: 'no esta disponible el producto' }
                })
            }

            res.json({
                ok: true,
                producto
            })

        })
})



//search productos
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino
    let regex = new RegExp(termino, 'i')


    Producto.find({ nombre: regex, disponible: true })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })
        })
})

//crear prodcto
app.post('/producto', verificaToken, (req, res) => {
    let body = req.body

    let product = new Producto({
        descripcion: body.descripcion,
        nombre: body.nombre,
        precioUni: body.precioUni,
        categoria: body.categoria,
        usuario: req.usuario._id
    })


    product.save((err, productdb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productdb) {
            return res.status(400).json({
                ok: false,
                err
            })
        }


        res.json({
            ok: true,
            categoria: productdb
        })

    })

})





//update

app.put('/producto/:id', verificaToken, (req, res) => {
    let product_id = req.params.id

    let body = _.pick(req.body, ['nombre', 'descripcion', 'precioUni', 'categoria', 'disponible'])
    console.log(body);
    Producto.findByIdAndUpdate(product_id, body, { new: true })
        .sort('nombre')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto
            })

        })
})

//change disponible
app.delete('/producto/:id', verificaToken, (req, res) => {
    let product_id = req.params.id
    let update = { disponible: false }
    Producto.findByIdAndUpdate(product_id, update, { new: true })
        .sort('nombre')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                producto
            })

        })
})


module.exports = app