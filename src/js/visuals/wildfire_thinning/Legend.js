import React from 'react'
import styled from 'styled-components'

const Patch = styled.div`
  width: ${(props) => props.width};
  height: ${(props) => props.height}px;
  background-color: ${(props) => props.color};
  border: 1px solid white;
`

const Caption = styled.p`
  font-size: 12px;
  margin: 2px 5px 2px 0px;
`

const Legend = ({ warmColors, coolColors, labels }) => {
  const width = 100 / 7,
    height = 20
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Patch color='darkgrey' width='10px' height={height} />
          <Caption>Wilderness over 50k Acres</Caption>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div
            style={{
              borderRadius: '50%',
              backgroundColor: '#121212',
              width: '10px',
              height: '10px',
            }}
          ></div>
          <Caption>City over 500k population</Caption>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Patch width='5px' height={height} color='black' />
          <Caption>Interstate Highways</Caption>
        </div>
      </div>
      <p style={{ fontSize: '12px', margin: '2px', fontWeight: 500 }}>
        Risk Level
      </p>
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
            <Patch width='100%' height={height} color={c} />
            <Patch width='100%' height={height} color={coolColors[i]} />
            <p style={{ fontSize: '12px', textAlign: 'center' }}>{labels[i]}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Legend
