import React from 'react'

const ResetButton = ({ onClick }) => {
  return (
    <text
      fontSize='18px'
      textDecoration='underline'
      x={10}
      y={20}
      cursor='pointer'
      fontWeight={700}
      onClick={onClick}
    >
      {'<'} Go Back
    </text>
  )
}

export default ResetButton
