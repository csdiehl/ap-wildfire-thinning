import React, { useState } from 'react'
import { useNodeDimensions } from 'ap-react-hooks'
import Map from './Map'
import styled from 'styled-components'
import Legend from './Legend'
import { scaleSequential, interpolateBlues, interpolateOranges } from 'd3'
import StackedBar from './StackedBar'
import { colors } from './utils'
import { Caption, Header } from '../styles'
import LazyLoad from 'react-lazy-load'
import '../lazy-load.css'

const Container = styled.div`
  display: grid;
  grid-gap: 10px;
  box-sizing: border-box;
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  grid-template-rows: auto 50px 500px auto;
  grid-template-columns: 100%;
  grid-template-areas:
    'Header'
    'StackedBar'
    'Map'
    'Legend';

  @media (min-width: 768px) {
    grid-template-columns: 25% 75%;
    grid-template-rows: 50px 350px 350px;
    grid-template-areas:
      'Header StackedBar'
      'Header Map'
      'Legend Map';
  }

  @media (min-width: 1024px) {
    grid-template-columns: 30% 70%;
    grid-template-rows: 50px 200px 500px;
  }
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
        <div
          style={{
            display: 'flex',
            gap: '5px',
            alignItems: 'baseline',
            fontSize: '16px',
          }}
        >
          <img height='20px' width='20px' src='./tap.svg' alt='tap icon'></img>
          {!stateIsZoomed && !countyIsZoomed && (
            <p style={{ margin: '0px' }}>
              Click on a <strong>state</strong> to zoom in
            </p>
          )}
          {(stateIsZoomed || countyIsZoomed) && (
            <Caption>
              Click on a <strong>county</strong> to zoom in
            </Caption>
          )}
        </div>
      </div>

      <div style={{ gridArea: 'Map' }} ref={node}>
        <LazyLoad>
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
        </LazyLoad>
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
