const assert = require('node:assert')

const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const Blog = require('../models/blog')
const { title } = require('node:process')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blog are returned', async () => {
    const response = await api.get('/api/blogs')
  
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
  
  test('a specific blog is within the returned blog', async () => {
    const response = await api.get('/api/blogs')
  
    const title = response.body.map(e => e.title)
    assert.strictEqual(title.includes('HTML is easy'), true)
  })

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Node.js is great',
    author: 'Ryan Dahl',
    url: 'https://nodejs.org/en/docs/',
    likes: 10,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  const titles = blogsAtEnd.map(b => b.title)
  assert.strictEqual(titles.includes(newBlog.title), true)
}
)

test('blog without title is not added', async () => {
  const newBlog = {
    title: '',
    author: 'John Lennon',
    url: 'https://www.johnlennon.com/',
    likes: 5,
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
}
)

test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToView = blogsAtStart[0]

  const response = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.title, blogToView.title)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

  const titles = blogsAtEnd.map(b => b.title)
  assert.strictEqual(titles.includes(blogToDelete.title), false)
})

test('if likes are not defined, they default to 0', async () => {
  const newBlog = {
    title: 'Express.js is awesome',
    author: 'TJ Holowaychuk',
    url: 'https://expressjs.com/',
  }
  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  const titles = blogsAtEnd.map(b => b.title)
  assert.strictEqual(titles.includes(newBlog.title), true)
}
)

test('url is not defined', async () => {
  const newBlog = {
    title: 'Missing URL',
    author: 'Test Author',
    likes: 3,
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
}
)

after(async () => {
  await mongoose.connection.close()
})