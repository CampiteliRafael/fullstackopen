const express = require('express')
const Person = require('../models/person')

const personsRouter = express.Router()

const normalizeName = (name) => name.trim().toLowerCase()

const validInput = (value) => typeof value === 'string' && value.trim().length > 0

personsRouter.get('/', async (request, response) => {
  const persons = await Person.find({})
  response.json(persons)
})

personsRouter.get('/:id', async (request, response) => {
  const person = await Person.findById(request.params.id)

  if (!person) {
    return response.status(404).json({ error: 'person not found' })
  }

  return response.json(person)
})

personsRouter.post('/', async (request, response) => {
  const body =
    request.body && typeof request.body === 'object' ? request.body : {}
  const { name, number } = body

  if (!validInput(name) || !validInput(number)) {
    return response.status(400).json({ error: 'name and number are required' })
  }

  const normalizedName = normalizeName(name)
  const existingPerson = await Person.findOne({ nameKey: normalizedName })

  if (existingPerson) {
    return response.status(409).json({ error: 'name must be unique' })
  }

  const person = new Person({ name: name.trim(), number: number.trim() })
  const savedPerson = await person.save()
  return response.status(201).json(savedPerson)
})

personsRouter.put('/:id', async (request, response) => {
  const person = await Person.findById(request.params.id)

  if (!person) {
    return response.status(404).json({ error: 'person not found' })
  }

  const body =
    request.body && typeof request.body === 'object' ? request.body : {}
  const { name, number } = body

  if (name !== undefined) {
    if (!validInput(name)) {
      return response.status(400).json({ error: 'name must not be empty' })
    }

    const normalizedName = normalizeName(name)
    const existingPerson = await Person.findOne({
      nameKey: normalizedName,
      _id: { $ne: person._id },
    })

    if (existingPerson) {
      return response.status(409).json({ error: 'name must be unique' })
    }

    person.name = name.trim()
  }

  if (number !== undefined) {
    if (!validInput(number)) {
      return response.status(400).json({ error: 'number must not be empty' })
    }

    person.number = number.trim()
  }

  const updatedPerson = await person.save()
  return response.json(updatedPerson)
})

personsRouter.delete('/:id', async (request, response) => {
  const deletedPerson = await Person.findByIdAndDelete(request.params.id)

  if (!deletedPerson) {
    return response.status(404).json({ error: 'person not found' })
  }

  return response.status(204).end()
})

module.exports = personsRouter
