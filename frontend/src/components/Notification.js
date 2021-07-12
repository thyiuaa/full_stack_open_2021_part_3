import React from 'react'

const Notification = ({ message, color }) => {
    if (message === null) {
      return null
    }
  
    let notiStyle = {
        color: color,
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }
    return (
      <div style={notiStyle}>
        {message}
      </div>
    )
}

export default Notification
