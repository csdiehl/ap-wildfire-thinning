import { useNodeDimensions } from "ap-react-hooks"
import { scale } from "chroma-js"
import React, { useState } from "react"
import styled from "styled-components"
import { Caption, Header } from "../styles"
import Legend from "./Legend"
import Map from "./Map"

const Container = styled.div`
  height: calc(100vh - 20px);
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  display: grid;
  grid-column-gap: 10px;
  grid-template-columns: auto minmax(0, 1fr);
  grid-template-rows: auto minmax(0, 1fr) auto;
  grid-template-areas:
    "header header"
    "map map"
    "legend footer";

  @media (min-width: 768px) {
    grid-template-columns: 200px minmax(0, 1fr);
    grid-template-rows: auto auto minmax(0, 1fr);

    grid-template-areas:
      "header map"
      "legend map"
      "footer map";
  }

  @media (min-width: 1024px) {
    grid-template-columns: 300px minmax(0, 1fr);
  }
`

const ClickMessage = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  font-size: 16px;
  background-color: #f5f5f5;
  border-radius: 5px;
  width: fit-content;
  padding: 0px 10px;
  margin: 10px 0px;
`

const CommunityRisk = () => {
  const [selectedState, setSelectedState] = useState(null)
  const [node, dimensions] = useNodeDimensions()
  const { width, height } = dimensions

  const colors = scale("Oranges").colors(7)

  return (
    <Container>
      <div style={{ gridArea: "header" }}>
        <Header>Wildfire risk to communities</Header>
        <Caption>
          This map shows the risk of destruction to structures from wildfires by
          city and census desginated place. Darker areas have more risk. Taller
          spikes have a higher population.
        </Caption>
      </div>
      <div ref={node} style={{ gridArea: "map" }}>
        <Map
          width={width}
          height={height}
          colors={colors}
          setSelectedState={setSelectedState}
          selectedState={selectedState}
        />
      </div>

      <Legend style={{ gridArea: "legend" }} colors={colors} />

      <div style={{ gridArea: "footer", fontSize: "12px" }}>
        <ClickMessage>
          <img height="20px" width="20px" src="./tap.svg" alt="tap icon"></img>
          <p style={{ margin: "5px" }}>
            Click on a <strong>state</strong> to zoom in
          </p>
        </ClickMessage>
        <p>
          Risk, determined by the U.S. Forest Service, is the probability and
          intensity of fire times the number of housing units.
        </p>
        <p>
          City area = region in which every point is closer to that city than
          any other.
        </p>
        <p>Data: U.S. Forest Service</p>
      </div>
    </Container>
  )
}

export default CommunityRisk
