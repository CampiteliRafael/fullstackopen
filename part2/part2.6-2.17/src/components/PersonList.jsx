const PersonList = ({ persons, onDelete }) => (
  <ul className="person-list">
    {persons.map((person) => (
      <li key={person.id}>
        <span>
          {person.name} {person.number}
        </span>
        <button type="button" onClick={() => onDelete(person)}>
          Delete
        </button>
      </li>
    ))}
  </ul>
)

export default PersonList
