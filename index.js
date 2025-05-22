const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const Blog = require('./models/blog')
const cors = require('cors')

const app = express()
app.use(express.static('dist'))
app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})