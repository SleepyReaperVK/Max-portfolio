import { useEffect } from 'react'

// PLACEHOLDER DOMAIN: the real domain isn't registered yet. Replace this one
// constant with the live domain when it is — every canonical/OG/Twitter URL
// this component writes derives from it. Keep in sync with the same
// placeholder in index.html.
const SITE_ORIGIN = 'https://maxmasarski.dev'

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

    const url = `${SITE_ORIGIN}${path}`
    const absoluteImage = image ? `${SITE_ORIGIN}${image}` : undefined

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')

    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
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
