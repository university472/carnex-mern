// Line-art side profiles for the "Browse by body type" tiles.
// Body types come from the database, so unknown values fall back to a sedan.
const PROFILES = {
  sedan:
    'M3 23v-4.5c0-1.5 1-2.5 2.5-2.8L17 14l6.5-5.5c1-.8 2.2-1.2 3.5-1.2h12c1.6 0 3 .6 4.1 1.7L48 14l9.5 1.8c1.8.3 3.5 1.8 3.5 3.6V23z',
  suv: 'M3 23v-6c0-1.4.9-2.4 2.2-2.8L12 12l5-6.2c.8-1 2-1.6 3.3-1.6H46c1.3 0 2.5.6 3.2 1.6L55 12l3.3 1c1.6.5 2.7 1.9 2.7 3.6V23z',
  truck:
    'M3 23v-6.5c0-1.2.8-2.2 2-2.5L14 12l5-6c.7-.8 1.7-1.3 2.8-1.3H33V14h26c1.1 0 2 .9 2 2v7z',
  hatchback:
    'M3 23v-5c0-1.4 1-2.6 2.4-2.9L16 13l7-6c.9-.8 2-1.2 3.2-1.2H45c1.4 0 2.6.8 3.2 2L54 18h4.5c1.4 0 2.5 1.1 2.5 2.5V23z',
  coupe:
    'M3 23v-4c0-1.4 1-2.5 2.4-2.8L18 14l7.5-4.8c1-.6 2.1-1 3.3-1h9.4c1.5 0 2.9.6 3.9 1.7L48 15l9.7 1.5c1.9.3 3.3 1.9 3.3 3.8V23z',
  convertible:
    'M3 23v-4c0-1.4 1-2.5 2.4-2.8L20 14h37.6c1.9 0 3.4 1.5 3.4 3.4V23zM24 14l5-5',
  van: 'M3 23V9c0-2.2 1.8-4 4-4h34c1.3 0 2.5.6 3.2 1.6L52 14l6.3 1.6c1.6.4 2.7 1.8 2.7 3.4V23z',
  wagon:
    'M3 23v-5c0-1.4 1-2.6 2.4-2.9L16 13l7-5.8c.9-.8 2-1.2 3.2-1.2H56c1.7 0 3 1.3 3 3v5l.5.3c1 .6 1.5 1.6 1.5 2.7V23z'
}

function profileFor(bodyType = '') {
  const t = bodyType.toLowerCase()
  if (t.includes('convert') || t.includes('cabrio')) return PROFILES.convertible
  if (t.includes('coupe') || t.includes('coup') || t.includes('sport'))
    return PROFILES.coupe
  if (t.includes('truck') || t.includes('pickup')) return PROFILES.truck
  if (t.includes('van') || t.includes('mpv') || t.includes('minivan'))
    return PROFILES.van
  if (t.includes('wagon') || t.includes('estate')) return PROFILES.wagon
  if (t.includes('hatch')) return PROFILES.hatchback
  if (t.includes('suv') || t.includes('crossover') || t.includes('4x4'))
    return PROFILES.suv
  return PROFILES.sedan
}

export function BodyTypeIcon({ bodyType, className }) {
  return (
    <svg
      viewBox="0 0 64 30"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={profileFor(bodyType)} />
      <circle cx="16" cy="23" r="4.8" className="fill-white" />
      <circle cx="48" cy="23" r="4.8" className="fill-white" />
      <circle cx="16" cy="23" r="1.6" />
      <circle cx="48" cy="23" r="1.6" />
    </svg>
  )
}
