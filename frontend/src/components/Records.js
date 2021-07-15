import React from 'react'

import Button from './Button'
import personsService from '../services/persons'

const Records = ({ records, persons, setPersons }) => {
  const deleteRecord = ( record ) => {
    if( window.confirm(`Delete ${record.name}`) ) {
      personsService
        .remove(record.id)
        .then(response => {
          console.log('Record deletion SUCCESSFUL!', response)
          setPersons(persons.filter(person => person.id !== record.id))
        })
        .catch(error => {
          console.log('Record deletion FAILED!', error)
        })
    } else {
      console.log('User cancelled record deletion.')
    }
  }

  return (
    <div>
      {
        records.map((record) => {
          return <p key={record.name}>
            {record.name} {record.number}
            <Button label='delete' clickHandler={() => deleteRecord(record)} />
          </p>
        })
      }
    </div>
  )
}

export default Records