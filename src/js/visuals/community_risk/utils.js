import { select } from 'd3'

export const makeGeoJSON = ({ lon, lat, ...data }) => {
  return {
    type: 'Feature',
    properties: { ...data },
    geometry: { type: 'Point', coordinates: [lon, lat] },
  }
}

export const spike = (length) => `M${-5 / 2},0L0,${-length}L${5 / 2},0`

export const dedupeLabels = (allDedupeLabels) => {
  const getOverlapFromTwoExtents = (l, r) => {
    var overlapPadding = 0
    l.left = l.x - overlapPadding
    l.right = l.x + l.width + overlapPadding
    l.top = l.y - overlapPadding
    l.bottom = l.y + l.height + overlapPadding
    r.left = r.x - overlapPadding
    r.right = r.x + r.width + overlapPadding
    r.top = r.y - overlapPadding
    r.bottom = r.y + r.height + overlapPadding
    var a = l
    var b = r

    if (
      a.left >= b.right ||
      a.top >= b.bottom ||
      a.right <= b.left ||
      a.bottom <= b.top
    ) {
      return false
    } else {
      return true
    }
  }

  allDedupeLabels.each(function (d, i) {
    var thisBBox = this.getBBox()
    allDedupeLabels
      .filter((k, j) => j > i)
      .each(function (d) {
        var underBBox = this.getBBox()
        if (getOverlapFromTwoExtents(thisBBox, underBBox)) {
          select(this).style('opacity', 0)
        }
      })
  })
}
