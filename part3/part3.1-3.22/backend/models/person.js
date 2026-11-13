const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    trim: true,
  },
  nameKey: {
    type: String,
    required: true,
    unique: true,
    select: false,
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    trim: true,
    validate: {
      validator: (number) => /^\d{2,3}-\d+$/.test(number),
      message: ({ value }) => `${value} is not a valid phone number`,
    },
  },
})

personSchema.pre('validate', function setNameKey() {
  if (typeof this.name === 'string') {
    this.nameKey = this.name.trim().toLowerCase()
  }
})

personSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.nameKey
  },
})

module.exports = mongoose.model('Person', personSchema)
