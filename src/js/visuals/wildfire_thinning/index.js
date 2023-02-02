import React, { useState } from 'react'
import { useNodeDimensions } from 'ap-react-hooks'
import Map from './Map'
import styled from 'styled-components'
import Legend from './Legend'
import { scaleSequential, interpolateBlues, interpolateOranges } from 'd3'
import StackedBar from './StackedBar'

const Container = styled.div`
  display: grid;
  grid-gap: 10px;
  content-sizing: border-box;
  height: calc(100vh - 40px);
  width: 100%;
  grid-template-rows: 20% 55% 5% 20%;
  grid-template-columns: 100%;
  grid-template-areas:
    'Header'
    'Map'
    'StackedBar'
    'Legend';

  @media (min-width: 768px) {
    grid-template-columns: 30% 70%;
    grid-template-rows: 50% 45% 5%;
    grid-template-areas:
      'Header Map'
      'Legend Map'
      'Legend StackedBar';
  }
`

const Header = styled.h1`
  font-size: 2rem;
  margin: 0;
`

const thinningColor = scaleSequential()
  .domain([0, 6])
  .interpolator(interpolateBlues)

const fireshedColor = scaleSequential()
  .domain([0, 6])
  .interpolator(interpolateOranges)

// Component
function WildfireThinning() {
  // state
  const [selectedArea, setSelectedArea] = useState('none')
  const [node, dimensions] = useNodeDimensions()
  const { width, height } = dimensions

  return (
    <Container>
      <div style={{ gridArea: 'Header' }}>
        <Header>Firesheds Map</Header>
        <p>
          This map shows higher risk firesheds across the Western US, including
          areas{' '}
          <strong style={{ color: '#3787C0' }}>targeted for thinning,</strong>{' '}
          and those <strong style={{ color: '#B73C01' }}>left untreated</strong>
        </p>
        <p>Click on a state to zoom in</p>
      </div>

      <div style={{ gridArea: 'Map' }} ref={node}>
        <Map
          thinningColor={thinningColor}
          fireshedColor={fireshedColor}
          width={width}
          height={height}
          setSelectedArea={setSelectedArea}
        />
      </div>
      <div style={{ gridArea: 'StackedBar' }}>
        <StackedBar fireshedColor={fireshedColor} selectedArea={selectedArea} />
      </div>
      <div style={{ gridArea: 'Legend' }}>
        <Legend
          warmColors={[0, 1, 2, 3, 4, 5, 6].map((d) => fireshedColor(d))}
          coolColors={[0, 1, 2, 3, 4, 5, 6].map((d) => thinningColor(d))}
          labels={[
            'super low',
            'very low',
            'low',
            'medium',
            'high',
            'very high',
            'extreme',
          ]}
        />
      </div>
    </Container>
  )
}

WildfireThinning.visual = {
  headline: 'Wildfire Thinning',
  chatter: '',
  footerProps: { credit: 'AP Data Team' },
}

WildfireThinning.propTypes = {}

WildfireThinning.defaultProps = {}

export default WildfireThinning
