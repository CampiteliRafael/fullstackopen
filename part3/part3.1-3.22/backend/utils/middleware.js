const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  if (error.code === 11000) {
    return response.status(409).json({ error: 'name must be unique' })
  }

  if (response.headersSent) {
    return next(error)
  }

  return response.status(500).json({ error: 'internal server error' })
}

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' })
}

module.exports = { errorHandler, unknownEndpoint }
