require('dotenv').config()
const mongoose = require('mongoose')
const Person = require('./backend/models/person')

const usage = 'Usage: node mongo.js <password> [name number]'

const getMongoUri = (password) => {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error('MONGODB_URI is not set. Configure it in .env.')
  }

  const resolvedUri =
    uri.includes('<password>') && password
      ? uri.replace('<password>', encodeURIComponent(password))
      : uri

  if (
    resolvedUri.includes('<username>') ||
    resolvedUri.includes('<password>') ||
    resolvedUri.includes('<cluster>')
  ) {
    throw new Error('Replace the MongoDB URI placeholders in .env.')
  }

  return resolvedUri
}

const main = async () => {
  const [, , password, name, number, ...extraArguments] = process.argv

  if (!password || extraArguments.length > 0 || Boolean(name) !== Boolean(number)) {
    console.error(usage)
    process.exitCode = 1
    return
  }

  try {
    await mongoose.connect(getMongoUri(password))

    if (name && number) {
      const person = new Person({ name, number })
      await person.save()
      console.log(`added ${person.name} number ${person.number} to phonebook`)
      return
    }

    const persons = await Person.find({}).sort({ name: 1 })
    console.log('phonebook:')
    persons.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

main()
