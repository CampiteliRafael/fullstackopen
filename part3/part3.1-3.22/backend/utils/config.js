require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT || 3001

const getMongoUri = () => {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Configure it in .env.')
  }

  if (
    MONGODB_URI.includes('<username>') ||
    MONGODB_URI.includes('<password>') ||
    MONGODB_URI.includes('<cluster>')
  ) {
    throw new Error('Replace the MongoDB URI placeholders in .env.')
  }

  return MONGODB_URI
}

module.exports = { getMongoUri, PORT }
