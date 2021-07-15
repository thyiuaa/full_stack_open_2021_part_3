import React, { useState } from 'react'

import personsService from '../services/persons'

const Form = ({ persons, setPersons, setNotiObj }) => {
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')

  const updatePerson = ( personUpdate ) => {
    const confirmUpdate = window.confirm(`${personUpdate.name} is already added to phonebook, replace the old number with a new one?`)
    if ( confirmUpdate ) {
      const personObj = { ...personUpdate, number: newNumber }
      console.log('personObj', personObj);
      personsService
        .update(personUpdate.id, personObj)
        .then(personUpdated => {
          console.log('Record update SUCCESSFUL!', personUpdated);
          setPersons(persons.map(person => (person.id === personUpdated.id) ? personUpdated : person))
        })
        .catch(error => {
          console.log('Record update FAILED!', error);
          setNotiObj({ message: `Information of ${personUpdate.name} has already been removed from server`, color: 'red' })
          setTimeout(() => { setNotiObj({message: null}) }, 5000)
          setPersons(persons.filter(person => person.id !== personUpdate.id))
        })
    } else {
      console.log('User cancelled record update.');
    }
  }

  const handleInputNameChange = (event) => setNewName(event.target.value)
  const handleInputNumberChange = (event) => setNewNumber(event.target.value)
  const handleFormSubmit = (event) => {
    event.preventDefault()
    const samePerson = persons.find(person => person.name === newName)
    if ( samePerson ) {
      updatePerson(samePerson)
    }else if ( (newName !== '') && (newNumber !== '') ) {
      const personObj = { name: newName, number: newNumber }
      personsService
        .create(personObj)
        .then(newPerson => {
          setPersons(persons.concat(newPerson))
          setNewName('')
          setNewNumber('')
          setNotiObj({ message: `Added ${newPerson.name}`, color: 'green' })
          setTimeout(() => { setNotiObj({message: null}) }, 5000)
        })
        .catch(error => {
          console.log('Error when creating new entry', error)
          setNotiObj({ message: error.response.data.error, color: 'red' })
          setTimeout(() => { setNotiObj({message: null}) }, 5000)
        })
    }
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        name: <input value={newName} onChange={handleInputNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleInputNumberChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default Form