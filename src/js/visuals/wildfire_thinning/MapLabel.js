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

  const bld = name[2] < 1 ? '< 1' : Math.round(name[2]).toLocaleString('en')

  return (
    <Label paintOrder='stroke fill' stroke='#FFF' y={center[1]}>
      <tspan x={center[0]}>Fires starting within</tspan>
      <tspan fontWeight={600} fill='#121212' x={center[0]} dy='1.2em'>
        {name[1]} County
      </tspan>
      <tspan fill='#121212' x={center[0]} dy='1.2em'>
        affect {bld} buildings
      </tspan>
    </Label>
  )
}

export default MapLabel
