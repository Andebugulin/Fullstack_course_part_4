require('express-async-errors')
const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const app = express()

logger.info('connecting to', config.MONGODB_URI)


const connectDB = () => {
  const password = process.env.MONGODB_PASSWORD
  const url = process.env.MONGODB_URI.replace('${MONGODB_PASSWORD}', encodeURIComponent(password))
  mongoose.set('strictQuery', false)
  mongoose.connect(url)
    .then(() => {
      console.log('connected to MongoDB')
    })
    .catch(error => {
      console.log('error connecting to MongoDB:', error.message)
    })
}
connectDB()



app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app