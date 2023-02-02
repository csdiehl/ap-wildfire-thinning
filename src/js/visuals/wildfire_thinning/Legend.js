import React from 'react'
import styled from 'styled-components'

const Patch = styled.div`
  width: ${(props) => props.width}%;
  height: ${(props) => props.height}px;
  background-color: ${(props) => props.color};
`

const Legend = ({ warmColors, coolColors, labels }) => {
  const width = 100 / 7,
    height = 20
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Patch color='darkgrey' width={10} height={height} />
        <p style={{ fontSize: '12px' }}>Wilderness over 50k Acres</p>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'top',
          justifyContent: 'top',
        }}
      >
        {warmColors.map((c, i) => (
          <div key={i} style={{ width: `${width}%` }}>
            <Patch width={100} height={height} color={c} />
            <Patch width={100} height={height} color={coolColors[i]} />
            <p style={{ fontSize: '12px', textAlign: 'center' }}>{labels[i]}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Legend
