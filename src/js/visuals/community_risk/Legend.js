import React from 'react'
import styled from 'styled-components'
import { spike } from './utils'
import { format } from 'd3'

const Container = styled.div`
  width: 200px;
  height: 150px;
  display: grid;
  grid-template-columns: 100px minmax(0, 1fr);
  grid-template-rows: 60% 1fr;
  grid-column-gap: 5px;
  grid-template-areas:
    'picture population'
    'picture color';
`

const Annotation = ({ x, y, label }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <line x1={0} y1={2} y2={2} x2={70} stroke='darkgrey' />
      <text x={70} y={0} fontSize='12px' fontWeight={700} textAnchor='end'>
        {label}
      </text>
      <circle cx={0} cy={2} r={2} fill='darkgrey' />
    </g>
  )
}

const Legend = () => {
  const sizes = [5, 14, 41, 127]
  const labels = [1000, 10000, 100000, 1000000]
  const colors = ['#FFF4EB', '#FDD0A2', '#FD8C3B', '#D84702', '#7F2604'],
    primary = '#7F2604'

  return (
    <Container>
      <svg
        width='100%'
        height='100%'
        viewBox='0 0 100 100'
        style={{ gridArea: 'picture' }}
      >
        <polygon
          points='30,90 0,70 0,50 30,30 60,50 60,70'
          fill={primary}
          stroke={primary}
          fillOpacity={0.5}
        ></polygon>
        <path
          transform='translate(30, 60)'
          d={spike(50)}
          fill={primary}
          stroke={primary}
          fillOpacity={0.8}
          strokeLinejoin='round'
        ></path>
        <Annotation x={30} y={20} label='Population' />
        <text
          x={30}
          y={70}
          textAnchor='middle'
          fontWeight={700}
          fontSize='11px'
        >
          City Area
        </text>
        <Annotation x={30} y={85} label='Risk Level' />
      </svg>
      <svg
        width='100%'
        height='100%'
        viewBox='0 0 100 90'
        style={{ gridArea: 'population' }}
      >
        {sizes.map((d, i) => (
          <>
            <path
              key={d}
              transform={`translate(${10 + i * 25},80)`}
              d={spike(d)}
            ></path>
            <text textAnchor='middle' fontSize='12px' x={10 + i * 25} y={90}>
              {format('.1s')(labels[i])}
            </text>
          </>
        ))}
      </svg>
      <svg
        width='100%'
        height='100%'
        viewBox='0 0 100 60'
        style={{ gridArea: 'color' }}
      >
        {colors.map((c, i) => (
          <rect
            key={c}
            x={i * 20}
            y={10}
            width={20}
            height={20}
            fill={c}
            stroke='#fff'
          ></rect>
        ))}
        <text x={0} y={40} fontSize='12px'>
          Low
        </text>
        <text x={100} y={40} fontSize='12px' textAnchor='end'>
          High
        </text>
      </svg>
    </Container>
  )
}

export default Legend
