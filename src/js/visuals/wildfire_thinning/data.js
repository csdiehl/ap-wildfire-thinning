import countyData from '../../../live-data/us.json'
import thinningData from '../../../live-data/firesheds_thinning.json'
import fireshedExposure from '../../../live-data/exp_firesheds.json'
import wildernessData from '../../../live-data/wilderness_clipped.json'
import zone_totals from '../../../live-data/zone_totals.json'
import * as topojson from 'topojson-client'

const stateCodes = ['32', '08', '41', '53', '06', '49', '16', '04', '35', '30']

const stateGeos = {
    type: 'GeometryCollection',
    geometries: countyData.objects.states.geometries.filter((d) =>
      stateCodes.includes(String(d.id).padStart(2, '0'))
    ),
  },
  states = topojson.feature(countyData, stateGeos).features

const counties = topojson
  .feature(countyData, countyData.objects.counties)
  .features.filter((d) =>
    stateCodes.includes(String(d.id).padStart(5, '0').slice(0, 2))
  )

const thinning = topojson.feature(
  thinningData,
  thinningData.objects.firesheds_thinning
).features

const firesheds = topojson.feature(
  fireshedExposure,
  fireshedExposure.objects.exp_firesheds
).features

const wilderness = topojson.feature(
  wildernessData,
  wildernessData.objects.wilderness_clipped
).features

const zones = topojson.feature(
  zone_totals,
  zone_totals.objects.zone_totals
).features

const outline = topojson.merge(countyData, stateGeos.geometries)

export { counties, thinning, firesheds, wilderness, states, outline, zones }
