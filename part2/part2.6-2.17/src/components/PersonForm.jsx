const PersonForm = ({
  name,
  number,
  onNameChange,
  onNumberChange,
  onSubmit,
}) => (
  <form onSubmit={onSubmit}>
    <div>
      <label htmlFor="person-name">Name: </label>
      <input
        id="person-name"
        value={name}
        onChange={onNameChange}
        required
      />
    </div>
    <div>
      <label htmlFor="person-number">Number: </label>
      <input
        id="person-number"
        value={number}
        onChange={onNumberChange}
        required
      />
    </div>
    <button type="submit">Add or update</button>
  </form>
)

export default PersonForm
