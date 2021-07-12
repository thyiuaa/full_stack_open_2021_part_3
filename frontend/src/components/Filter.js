import React from 'react'

const Filter = ({ filterString, setFilterString }) => {
  const handleFilterStringChange = (event) => {
    setFilterString(event.target.value)
  }

  return (
    <div>
      filter shown with <input value={filterString} onChange={handleFilterStringChange}/>
    </div>
  )
}

export default Filter