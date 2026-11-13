const mongoose = require('mongoose')
const app = require('./app')
const { getMongoUri, PORT } = require('./utils/config')

const start = async () => {
  try {
    await mongoose.connect(getMongoUri())
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error(`Unable to start phonebook backend: ${error.message}`)
    process.exitCode = 1
  }
}

start()
