import { useEffect } from 'react'
import { animate } from 'framer-motion'
import { useTheme } from '@mui/material/styles'

// Native `scroll-behavior: smooth` gives no control over duration or curve, so
// same-page anchor clicks (nav links, the system nav, the dot rail, CTAs) are
// animated here instead, on the project's own motion tokens. The CSS rule
// stays as the fallback for anything this does not intercept.
export default function useSmoothAnchorScroll() {
  const theme = useTheme()

  useEffect(() => {
    const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let running = null

    const stop = () => {
      running?.stop()
      running = null
    }

    // `html { scroll-behavior: smooth }` turns every one of these per-frame
    // calls into its own native smooth scroll, which lags behind the tween and
    // keeps running after it is stopped. Opt out per call so this animation is
    // the only thing moving the page.
    const jumpTo = (value) => window.scrollTo({ top: value, behavior: 'instant' })

    const handleClick = (event) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const link = event.target.closest?.('a[href]')
      if (!link || link.target === '_blank') return

      const url = new URL(link.href, window.location.href)
      // Same document only: a different path is the router's job, and a link
      // without a hash is not an in-page jump.
      if (!url.hash || url.pathname !== window.location.pathname || url.search !== window.location.search) return

      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)))
      if (!target) return

      event.preventDefault()
      stop()

      // Respect the target's own scroll-margin-top so headings still clear the
      // fixed navbar — the same offset the native behaviour would have used.
      const offset = parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0
      const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset)

      const settle = () => {
        running = null
        window.history.pushState(null, '', url.hash)
        // Move focus with the reader, so the next Tab continues from the
        // section they jumped to rather than from the link.
        target.setAttribute('tabindex', '-1')
        target.focus({ preventScroll: true })
      }

      if (reduceQuery.matches) {
        jumpTo(top)
        settle()
        return
      }

      // A dot-rail tap can cover twenty screens. Held at one fixed duration
      // that reads as a blur, so long jumps get up to twice the time while
      // short hops stay snappy. Both ends are derived from the `slow` token.
      const screens = Math.abs(top - window.scrollY) / window.innerHeight
      const stretch = 1 + Math.min(screens, 4) / 4
      running = animate(window.scrollY, top, {
        duration: (theme.custom.motion.slow * stretch) / 1000,
        ease: theme.custom.motion.easingPoints,
        onUpdate: jumpTo,
        onComplete: settle,
      })
    }

    // Any manual scroll wins immediately — an animation that fights the user's
    // own wheel or finger is worse than no animation.
    const interrupts = ['wheel', 'touchstart', 'keydown', 'pointerdown']

    document.addEventListener('click', handleClick)
    interrupts.forEach((type) => window.addEventListener(type, stop, { passive: true }))

    return () => {
      stop()
      document.removeEventListener('click', handleClick)
      interrupts.forEach((type) => window.removeEventListener(type, stop))
    }
  }, [theme])
}
