if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const usersRouter = require('./routers/users')

const app = express()

app.use('/api', usersRouter)

mongoose.connect(process.env.MONGODB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.listen(process.env.PORT)
