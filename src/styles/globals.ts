import { globalCss } from '@ignite-ui/react'

export const globalStyles = globalCss({
  '*': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    '-webkit-font-smoothing': 'antialiased',
    '-mos-osx-font-smoothing': 'grayscale',
  },

  body: {
    backgroundColor: '$gray900',
    color: '$gray100',
  },
})
