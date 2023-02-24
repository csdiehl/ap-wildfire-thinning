export const makeGeoJSON = ({ lon, lat, ...data }) => {
  return {
    type: 'Feature',
    properties: { ...data },
    geometry: { type: 'Point', coordinates: [lon, lat] },
  }
}

export const spike = (length) => `M${-7 / 2},0L0,${-length}L${7 / 2},0`
