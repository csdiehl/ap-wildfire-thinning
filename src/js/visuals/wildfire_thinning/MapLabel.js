import React from 'react'
import { codeToName } from './utils'
import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
0% {
    opacity: 0
}

100% {
    opacity: 1
}
`

const Label = styled.text`
  animation: ${fadeIn} 2s;
`

const MapLabel = ({ code, center }) => {
  const name = codeToName(code)

  const bld = name[2] < 1 ? '< 1' : name[2].toLocaleString('en')

  return (
    <Label paintOrder='stroke fill' stroke='#FFF' y={center[1]}>
      <tspan fontWeight={600} x={center[0]}>
        {name[1]} County
      </tspan>
      <tspan fill='#121212' x={center[0]} dy='1.2em'>
        {bld} expected buildings
      </tspan>
      <tspan fill='#121212' x={center[0]} dy='1.2em'>
        affected from fires starting here
      </tspan>
    </Label>
  )
}

export default MapLabel
