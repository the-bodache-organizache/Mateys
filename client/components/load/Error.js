import React from 'react'

const Error = ({error}) => (
  <div className='column'>
    <span>Well, this wasn't supposed to happen...</span>
    <span>{error.message}</span>
  </div>
)

export default Error
