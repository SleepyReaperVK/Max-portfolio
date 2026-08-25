import { useEffect } from 'react'

// Origin only, WITHOUT the app base — SITE_ROOT below adds that. Every
// canonical/OG/Twitter URL this component writes derives from these two. Keep
// in sync with the URL in index.html; a custom domain or a repo rename changes
// both, plus `base` in vite.config.js.
const SITE_ORIGIN = 'https://sleepyreapervk.github.io'

// The app is served from a GitHub Pages project subpath, so canonical and
// og:url need the base folded in. BASE_URL carries a trailing slash and `path`
// carries a leading one, hence the trim — otherwise every URL doubles it.
// `image` is NOT built from this: manifest paths already include BASE_URL, so
// they only need the bare origin.
const SITE_ROOT = `${SITE_ORIGIN}${import.meta.env.BASE_URL}`.replace(/\/$/, '')

// Removes the tag when `content` is falsy instead of leaving whatever the
// previous route (or index.html's static tags) set — otherwise navigating
// case-study -> 404 leaves the 404 page still advertising the case-study
// hero as its social image (review round 1, M-1).
function upsertMeta(attr, key, content) {
  const existing = document.querySelector(`meta[${attr}="${key}"]`)
  if (!content) {
    existing?.remove()
    return
  }
  let el = existing
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  const existing = document.querySelector(`link[rel="${rel}"]`)
  if (!href) {
    existing?.remove()
    return
  }
  let el = existing
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Sets document.title and upserts meta/OG/Twitter tags on mount. No route
 * dependency array beyond its own props is needed for a two-route SPA —
 * every route mounts a fresh <Seo> with its own values.
 */
export default function Seo({
  title,
  description,
  image,
  path = '/',
  noindex = false,
  type = 'website',
  siteName,
}) {
  useEffect(() => {
    if (title) document.title = title

    const url = `${SITE_ROOT}${path}`
    const absoluteImage = image ? `${SITE_ORIGIN}${image}` : undefined

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')

    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', noindex ? undefined : url)
    upsertMeta('property', 'og:image', absoluteImage)
    upsertMeta('property', 'og:site_name', siteName)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', absoluteImage)

    // A canonical link asserts "this is the authoritative address for this
    // content" — contradictory to pair with noindex, which says "don't index
    // this page at all." Skip it (and remove any stale one) when noindex is
    // set (review round 1, M-2).
    upsertLink('canonical', noindex ? undefined : url)
  }, [title, description, image, path, noindex, type, siteName])

  return null
}
