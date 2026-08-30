import {buildLegacyTheme} from 'sanity'

const BRAND = '#8b2d2d'
const INK = '#4a1414'
const GOLD = '#cb9954'
const PAPER = '#faf8f3'

/* Efamy's colours, so the Studio reads as part of the same business as the
   shop. Only the surfaces and the accent: contrast is left to Sanity. */
export const theme = buildLegacyTheme({
  '--black': INK,
  '--white': '#ffffff',

  '--gray': '#676159',
  '--gray-base': '#676159',

  '--component-bg': '#ffffff',
  '--component-text-color': '#242424',

  '--brand-primary': BRAND,

  '--default-button-color': '#676159',
  '--default-button-primary-color': BRAND,
  '--default-button-success-color': '#3d8168',
  '--default-button-warning-color': GOLD,
  '--default-button-danger-color': '#b3392f',

  '--state-info-color': BRAND,
  '--state-success-color': '#3d8168',
  '--state-warning-color': GOLD,
  '--state-danger-color': '#b3392f',

  '--main-navigation-color': INK,
  '--main-navigation-color--inverted': '#ffffff',

  '--focus-color': GOLD,
})
