import React, { useState } from 'react'
import { useNodeDimensions } from 'ap-react-hooks'
import Map from './Map'
import styled from 'styled-components'
import Legend from './Legend'
import { scaleSequential, interpolateBlues, interpolateOranges } from 'd3'
import StackedBar from './StackedBar'
import { colors } from './utils'

const Container = styled.div`
  display: grid;
  grid-gap: 10px;
  content-sizing: border-box;
  height: calc(100vh - 40px);
  width: 100%;
  grid-template-rows: 18% 57% 8% 15%;
  grid-template-columns: 100%;
  grid-template-areas:
    'Header'
    'Map'
    'StackedBar'
    'Legend';

  @media (min-width: 768px) {
    grid-template-columns: 30% 70%;
    grid-template-rows: 50% 40% 10%;
    grid-template-areas:
      'Header Map'
      'Legend Map'
      'StackedBar StackedBar';
  }
`

const Header = styled.h1`
  font-size: 20px;
  margin: 0;
`

const Caption = styled.p`
  font-size: 14px;
  margin-top: 5px;
  margin-bottom: 2px;
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
  const [stateIsZoomed, setStateIsZoomed] = useState(false)
  const [countyIsZoomed, setCountyIsZoomed] = useState(false)
  const [node, dimensions] = useNodeDimensions()
  const { width, height } = dimensions

  return (
    <Container>
      <div style={{ gridArea: 'Header' }}>
        <Header>Where fires start in the West</Header>
        <Caption>
          This map shows higher risk firesheds across the western U.S.,
          including areas{' '}
          <strong style={{ color: colors.blue }}>targeted for thinning,</strong>{' '}
          and those{' '}
          <strong style={{ color: colors.red }}>left untreated.</strong> The
          darker the area, the more buildings expected to be exposed in a year
          by fires starting there.
        </Caption>
        <div style={{ display: 'flex', gap: '5px' }}>
          <img height='20px' width='20px' src='./tap.svg' alt='tap icon'></img>
          {!stateIsZoomed && !countyIsZoomed && (
            <Caption>
              Click on a <strong>state</strong> to zoom in
            </Caption>
          )}
          {(stateIsZoomed || countyIsZoomed) && (
            <Caption>
              Click on a <strong>county</strong> to zoom in
            </Caption>
          )}
        </div>
      </div>

      <div style={{ gridArea: 'Map' }} ref={node}>
        <Map
          thinningColor={thinningColor}
          fireshedColor={fireshedColor}
          width={width}
          height={height}
          setSelectedArea={setSelectedArea}
          stateIsZoomed={stateIsZoomed}
          countyIsZoomed={countyIsZoomed}
          setCountyIsZoomed={setCountyIsZoomed}
          setStateIsZoomed={setStateIsZoomed}
          selectedArea={selectedArea}
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
            'lowest',
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
