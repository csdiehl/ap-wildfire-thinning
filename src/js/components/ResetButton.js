import React from "react"
import styled, { keyframes } from "styled-components"

const fade = keyframes`
0% {
  opacity: 0;
}

100% {
  opacity: 1;
}
`

const Container = styled.div`
position absolute;
top: 0;
left: 0; 
height: 100%; 
width: 56px;
cursor: pointer;
background: rgba(240, 240, 240, .5);
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
color: #777;
animation: ${fade} 200ms ease-in;

&: hover {
  background: rgba(220, 220, 220, .5);
}
`

const ResetButton = ({ onClick }) => {
  return (
    <Container onClick={onClick}>
      <p style={{ fontSize: "48px", margin: 0 }}>← </p>
      <p style={{ margin: 0 }}>Go Back</p>
    </Container>
  )
}

export default ResetButton
