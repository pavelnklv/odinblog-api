if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()

mongoose.connect(process.env.MONGODB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.listen(process.env.PORT)
