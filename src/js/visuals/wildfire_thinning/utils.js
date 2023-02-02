import expCounty from '../../../live-data/exp_by_county.json'

export const stateCodes = {
  '32': 'NV',
  '08': 'CO',
  '41': 'OR',
  '53': 'WA',
  '06': 'CA',
  '49': 'UT',
  '16': 'ID',
  '04': 'AZ',
  '35': 'NM',
  '30': 'MT',
}

export const colors = {
  blue: '#3787C0',
  red: '#B73C01',
  grey: 'darkgrey',
}

export function codeToName(countyCode) {
  const code = countyCode.padStart(5, 0)

  const state = stateCodes[code.slice(0, 2)]
  const county = expCounty
    .filter((d) => d.state === state)
    .find((d) => d.county === code.slice(3, 5).padStart(3, 0))

  return [state, county?.name ?? 'not found', county?.exp_in_zone]
}
