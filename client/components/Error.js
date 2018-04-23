import React from 'react'

const Error = ({error}) => (
  <div className='column'>
    <span>Oh dear! This is pawful!</span>
    <span>{error.message}</span>
  </div>
)

export default Error
