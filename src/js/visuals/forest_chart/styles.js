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

const Scale = styled.div`
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  height: 1px;
  background-color: black;
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
  font-size: 11px;
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

export {
  Container,
  Map,
  Note,
  ScaleBar,
  Bar,
  ColorBar,
  Name,
  State,
  Highlight,
  Scale,
}
