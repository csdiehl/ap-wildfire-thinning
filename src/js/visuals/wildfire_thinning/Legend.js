import React from "react"
import styled from "styled-components"

const Patch = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${(props) => props.color};
  border: 0.5px solid white;
`

const Container = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 100%;

  @media (min-width: 768px) {
    grid-template-rows: 50% 50%;
    grid-template-columns: 100%;
    grid-gap: 10px;
  }
`

const Subhead = styled.p`
font-size: 14px;
margin 5px 0px;
font-weight: 500;
`

const Legend = ({ warmColors, coolColors, labels }) => {
  const height = 15
  return (
    <Container>
      <div>
        <Subhead>Wildfire risk level</Subhead>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "top",
            justifyContent: "top",
            maxWidth: "370px",
          }}
        >
          {warmColors.map((c, i) => (
            <div key={i}>
              <Patch width="100%" height={height} color={c} />
              <Patch width="100%" height={height} color={coolColors[i]} />
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            width: "150px",
            justifyContent: "space-between",
          }}
        >
          <p style={{ margin: 0, fontSize: "12px" }}>Lowest</p>
          <p style={{ margin: 0, fontSize: "12px" }}>Highest</p>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <p style={{ fontSize: "12px" }}>Data: U.S. Forest Service</p>
      </div>
    </Container>
  )
}

export default Legend
