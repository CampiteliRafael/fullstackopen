import { useEffect, useState } from 'react'
import Notification from './components/Notification.jsx'
import PersonForm from './components/PersonForm.jsx'
import PersonList from './components/PersonList.jsx'
import personService from './services/personService.js'

const getErrorMessage = (error, fallback) =>
  error.response?.data?.error || fallback

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    personService
      .getAll()
      .then((initialPersons) => setPersons(initialPersons))
      .catch((error) => {
        setNotification({
          message: getErrorMessage(error, 'Could not load contacts.'),
          type: 'error',
        })
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!notification) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => setNotification(null), 5000)
    return () => window.clearTimeout(timeoutId)
  }, [notification])

  const showError = (message) => setNotification({ message, type: 'error' })
  const showSuccess = (message) =>
    setNotification({ message, type: 'success' })

  const addPerson = (event) => {
    event.preventDefault()
    const name = newName.trim()
    const number = newNumber.trim()

    if (!name || !number) {
      showError('Name and number are required.')
      return
    }

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === name.toLowerCase(),
    )

    if (existingPerson) {
      if (
        !window.confirm(
          `${existingPerson.name} is already in the phonebook. Replace the old number with the new one?`,
        )
      ) {
        return
      }

      personService
        .update(existingPerson.id, { ...existingPerson, number })
        .then((updatedPerson) => {
          setPersons((currentPersons) =>
            currentPersons.map((person) =>
              person.id === updatedPerson.id ? updatedPerson : person,
            ),
          )
          showSuccess(`Updated ${updatedPerson.name}'s number.`)
          setNewName('')
          setNewNumber('')
        })
        .catch((error) => {
          showError(
            getErrorMessage(error, `Could not update ${existingPerson.name}.`),
          )
        })
      return
    }

    personService
      .create({ name, number })
      .then((createdPerson) => {
        setPersons((currentPersons) => currentPersons.concat(createdPerson))
        showSuccess(`Added ${createdPerson.name} to the phonebook.`)
        setNewName('')
        setNewNumber('')
      })
      .catch((error) => {
        showError(getErrorMessage(error, `Could not add ${name}.`))
      })
  }

  const deletePerson = (person) => {
    if (!window.confirm(`Delete ${person.name}?`)) {
      return
    }

    personService
      .remove(person.id)
      .then(() => {
        setPersons((currentPersons) =>
          currentPersons.filter((item) => item.id !== person.id),
        )
        showSuccess(`Deleted ${person.name}.`)
      })
      .catch((error) => {
        showError(getErrorMessage(error, `Could not delete ${person.name}.`))
      })
  }

  const normalizedFilter = filter.trim().toLowerCase()
  const visiblePersons = persons.filter((person) =>
    person.name.toLowerCase().includes(normalizedFilter),
  )

  return (
    <main>
      <h1>Phonebook</h1>
      <Notification notification={notification} />

      <div className="filter-field">
        <label htmlFor="person-filter">Filter shown with: </label>
        <input
          id="person-filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        />
      </div>

      <h2>Add a new</h2>
      <PersonForm
        name={newName}
        number={newNumber}
        onNameChange={(event) => setNewName(event.target.value)}
        onNumberChange={(event) => setNewNumber(event.target.value)}
        onSubmit={addPerson}
      />

      <h2>Numbers</h2>
      {loading ? (
        <p>Loading contacts...</p>
      ) : visiblePersons.length > 0 ? (
        <PersonList persons={visiblePersons} onDelete={deletePerson} />
      ) : (
        <p>No contacts match this filter.</p>
      )}
    </main>
  )
}

export default App
