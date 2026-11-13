const express = require('express')
const fs = require('node:fs')
const path = require('node:path')
const mongoose = require('mongoose')
const personsRouter = require('./controllers/persons')
const requestLogger = require('./utils/logger')
const { errorHandler, unknownEndpoint } = require('./utils/middleware')

const app = express()
const frontendBuildPath = path.resolve(__dirname, '../dist')
const frontendIndexPath = path.join(frontendBuildPath, 'index.html')

app.use(express.json())
app.use(requestLogger)

app.get('/info', async (request, response) => {
  const count = await mongoose.model('Person').countDocuments({})
  response
    .type('html')
    .send(`Phonebook has info for ${count} people<br>${new Date().toString()}`)
})

app.use('/api/persons', personsRouter)
app.use(express.static(frontendBuildPath))

app.use((request, response, next) => {
  if (
    request.method === 'GET' &&
    request.accepts('html') &&
    fs.existsSync(frontendIndexPath)
  ) {
    return response.sendFile(frontendIndexPath)
  }

  return next()
})

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
