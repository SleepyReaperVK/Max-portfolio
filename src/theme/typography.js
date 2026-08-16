const display = '"Cinzel", "Times New Roman", serif'
const body = '"Inter", system-ui, -apple-system, sans-serif'

const typography = {
  fontFamily: body,
  h1: { fontFamily: display, fontWeight: 700, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.08, letterSpacing: '0.01em' },
  h2: { fontFamily: display, fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.15 },
  h3: { fontFamily: display, fontWeight: 600, fontSize: 'clamp(1.5rem, 3vw, 2.125rem)', lineHeight: 1.2 },
  h4: { fontFamily: display, fontWeight: 600, fontSize: 'clamp(1.25rem, 2.2vw, 1.5rem)', lineHeight: 1.3 },
  h5: { fontFamily: body, fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.4 },
  h6: { fontFamily: body, fontWeight: 600, fontSize: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase' },
  subtitle1: { fontFamily: body, fontWeight: 400, fontSize: '1.125rem', lineHeight: 1.6 },
  body1: { fontFamily: body, fontWeight: 400, fontSize: '1rem', lineHeight: 1.75 },
  body2: { fontFamily: body, fontWeight: 400, fontSize: '0.9375rem', lineHeight: 1.7 },
  caption: { fontFamily: body, fontWeight: 400, fontSize: '0.8125rem', lineHeight: 1.5 },
  button: { fontFamily: body, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'none' },
}

export { display, body }
export default typography
