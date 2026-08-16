// emotion serializes an array under a single '@font-face' object key into ONE
// rule with duplicate declarations (last value wins), not multiple @font-face
// rules — so each face is rendered as its own raw CSS string here instead.
const fontFace = ['cinzel-600', 'cinzel-700', 'inter-400', 'inter-500', 'inter-600'].map((f) => {
  const [family, weight] = f.split('-')
  const fontFamily = family === 'cinzel' ? 'Cinzel' : 'Inter'
  return `@font-face { font-family: '${fontFamily}'; font-style: normal; font-display: swap; font-weight: ${Number(weight)}; src: url('/fonts/${f}.woff2') format('woff2'); }`
}).join('\n')

const components = (theme) => ({
  MuiCssBaseline: {
    styleOverrides: [{
      html: { scrollBehavior: 'smooth' },
      '@media (prefers-reduced-motion: reduce)': {
        html: { scrollBehavior: 'auto' },
        '*, *::before, *::after': {
          animationDuration: '0.01ms !important',
          transitionDuration: '0.01ms !important',
        },
      },
      body: { backgroundColor: theme.palette.background.default, overflowX: 'hidden' },
      '::selection': { background: theme.palette.primary.main, color: theme.palette.primary.contrastText },
      ':focus-visible': { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: 2 },
    }, fontFace],
  },
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: { borderRadius: 8, paddingInline: theme.spacing(3), paddingBlock: theme.spacing(1.25) },
      outlinedPrimary: { borderColor: theme.palette.divider },
    },
  },
  MuiPaper: { styleOverrides: { root: { backgroundImage: 'none', borderRadius: 8 } } },
  MuiContainer: { defaultProps: { maxWidth: 'lg' } },
  MuiLink: { defaultProps: { underline: 'hover' }, styleOverrides: { root: { color: theme.palette.primary.main } } },
})

export default components
