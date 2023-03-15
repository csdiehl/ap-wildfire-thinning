import styled from 'styled-components'

// 32 + 15 + 120 + 20

const Container = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  grid-gap: 10px;
`

const Map = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: 100%;
  grid-template-rows: 32px 150px 20px;
  grid-gap: 5px;
  grid-template-areas:
    'name'
    'map'
    'bar';
`

const Bar = styled.div`
  transform: translateY(2px);
  background-color: lightgrey;
  width: ${(props) => props.width}%;
  height: 1px;
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

const Note = styled.div`
  position: absolute;
  left: ${(props) => props.width}%;
  font-size: 11px;
  text-align: center;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Tick = styled.div`
  width: 1px;
  height: 5px;
  background-color: black;
`

const Name = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin: 0px;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const State = styled.p`
  font-size: 12px;
  margin: 2px 0px;
  color: #777;
`

const Highlight = styled.span`
  background-color: orange;
  border-radius: 2px;
  padding: 2px;
  color: #fff;
`

export { Container, Map, Note, Bar, ColorBar, Name, State, Highlight, Tick }
