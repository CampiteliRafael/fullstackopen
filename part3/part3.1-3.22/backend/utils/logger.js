const morgan = require('morgan')

morgan.token('body', (request) =>
  request.method === 'POST' ? JSON.stringify(request.body) : '',
)

module.exports = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body',
)
