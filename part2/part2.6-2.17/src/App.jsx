import { useEffect, useState } from 'react'
import PersonForm from './components/PersonForm.jsx'
import PersonList from './components/PersonList.jsx'
import Notification from './components/Notification.jsx'
import personService from './services/personService.js'

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
      .catch(() => {
        setNotification({
          message: 'Could not load contacts. Is JSON Server running on port 3001?',
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

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)

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

      const updatedPerson = { ...existingPerson, number }
      personService
        .update(existingPerson.id, updatedPerson)
        .then((returnedPerson) => {
          setPersons((currentPersons) =>
            currentPersons.map((person) =>
              person.id === returnedPerson.id ? returnedPerson : person,
            ),
          )
          showSuccess(`Updated ${returnedPerson.name}'s number.`)
          setNewName('')
          setNewNumber('')
        })
        .catch((error) => {
          if (error.response?.status === 404) {
            setPersons((currentPersons) =>
              currentPersons.filter(
                (person) => person.id !== existingPerson.id,
              ),
            )
            showError(
              `${existingPerson.name} was already deleted from the server and has been removed from this list.`,
            )
            return
          }

          showError(
            `Could not update ${existingPerson.name}. Please check the server and try again.`,
          )
        })
      return
    }

    personService
      .create({ name, number })
      .then((returnedPerson) => {
        setPersons((currentPersons) => currentPersons.concat(returnedPerson))
        showSuccess(`Added ${returnedPerson.name} to the phonebook.`)
        setNewName('')
        setNewNumber('')
      })
      .catch(() => {
        showError(`Could not add ${name}. Please check the server and try again.`)
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
      .catch(() => {
        showError(
          `Could not delete ${person.name}. The contact may already have been deleted.`,
        )
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
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
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
