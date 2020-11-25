const express = require('express');
const app = express()

app.use(require('./usuario'))
app.use(require('./login'))

app.get('/h', (req, res) => {
  res.send('login works')
})



module.exports = app
