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

export const stateNames = {
  '32': 'Nevada',
  '08': 'Colorado',
  '41': 'Oregon',
  '53': 'Washington',
  '06': 'California',
  '49': 'Utah',
  '16': 'Idaho',
  '04': 'Arizona',
  '35': 'New Mexico',
  '30': 'Montana',
}

export const colors = {
  blue: '#3787C0',
  red: '#B73C01',
  grey: 'darkgrey',
}

export function codeToName(countyCode, name = false) {
  const code =
    countyCode.length <= 2
      ? countyCode.padStart(2, 0)
      : countyCode.padStart(5, 0)

  const state = name
    ? stateNames[code.slice(0, 2)]
    : stateCodes[code.slice(0, 2)]
  const county = expCounty
    .filter((d) => d.state === state)
    .find((d) => d.county === code.slice(2, 5))

  return [state, county?.name ?? 'not found', county?.exp_in_zone]
}
