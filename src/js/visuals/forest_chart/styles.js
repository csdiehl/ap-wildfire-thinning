import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  grid-gap: 10px;
`

const Map = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: 100%;
  grid-template-rows: auto minmax(0, 1fr) 15px;
  grid-gap: 5px;
  grid-template-areas:
    'state'
    'map'
    'bar';
`

const Bar = styled.div`
  position: relative;
  background-color: lightgrey;
  width: ${(props) => props.width}%;
  height: 5px;
`

const ColorBar = styled.div`
  background-color: ${(props) => props.color};
  width: ${(props) => props.width}%;
  height: 5px;
  grid-area: bar;
  position: absolute;
  top: 0;
  left: 0;
`

const ScaleBar = styled.div`
  position: absolute;
  top: 2px;
  background-color: lightgrey;
  height: 1px;
  width: 100%;
`

const Note = styled.div`
  position: absolute;
  left: ${(props) => props.width}%;
  width: 1px;
  height: 8px;
  background-color: black;
  font-size: 12px;
`
export { Container, Map, Note, ScaleBar, Bar, ColorBar }
