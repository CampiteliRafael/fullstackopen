const test = require('node:test')
const assert = require('node:assert/strict')
const Person = require('../backend/models/person')

test('a valid person passes schema validation', async () => {
  const person = new Person({ name: 'Anna Example', number: '040-1234556' })
  await person.validate()
  assert.equal(person.nameKey, 'anna example')
})

test('a person name must have at least three characters', () => {
  const person = new Person({ name: 'Al', number: '040-1234556' })
  const error = person.validateSync()
  assert.equal(error.errors.name.kind, 'minlength')
})

test('a phone number must have at least eight characters', () => {
  const person = new Person({ name: 'Anna Example', number: '09-1234' })
  const error = person.validateSync()
  assert.equal(error.errors.number.kind, 'minlength')
})

test('a phone number has two numeric parts separated by one hyphen', () => {
  for (const number of ['12345678', '1-22334455', '10-22-334455']) {
    const person = new Person({ name: 'Anna Example', number })
    const error = person.validateSync()
    assert.equal(error.errors.number.kind, 'user defined')
  }
})
