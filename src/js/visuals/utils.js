import { select, zoomIdentity } from 'd3'

export const zoomIn = (bounds, svgRef, zoom, width, height) => {
  const [[x0, y0], [x1, y1]] = bounds

  const svg = select(svgRef.current)
  svg
    .transition()
    .duration(2000)
    .call(
      zoom.transform,
      zoomIdentity
        .translate(width / 2, height / 2)
        .scale(
          Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height))
        )
        .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
    )
}

export const zoomOut = (svgRef, zoom) => {
  const svg = select(svgRef.current)

  svg
    .transition()
    .duration(750)
    .call(zoom.transform, zoomIdentity.translate(0, 0).scale(1))
}

export const zoomed = (transform, config) => {
  for (let item of config) {
    const el = select(document.getElementById(item.id))
    if (item.transform) el.attr('transform', transform)
    el.attr('stroke-width', item.baseStroke / transform.k)
    el.attr('font-size', `${item.baseFont / transform.k}px`)
  }

  // create the tiler function and pass it the transform
  // select the empty image by id
  // attach the tiles
}
