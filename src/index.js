if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const usersRouter = require('./routers/users')
const authRouter = require('./routers/auth')
const articlesRouter = require('./routers/articles')

const app = express()

app.use('/api', usersRouter)
app.use('/api', authRouter)
app.use('/api', articlesRouter)

mongoose.connect(process.env.MONGODB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.listen(process.env.PORT)
