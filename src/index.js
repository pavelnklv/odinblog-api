if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const usersRouter = require('./routers/users')
const authRouter = require('./routers/auth')
const articlesRouter = require('./routers/articles')
const commentsRouter = require('./routers/comments')

const app = express()
app.use(cors({
  origin: 'https://quiet-hollows-84016.herokuapp.com/'
}))

app.use('/api', usersRouter)
app.use('/api', authRouter)
app.use('/api', articlesRouter)
app.use('/api', commentsRouter)

mongoose.connect(process.env.MONGODB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.listen(process.env.PORT)
