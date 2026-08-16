import { useEffect } from 'react'

// PLACEHOLDER DOMAIN: the real domain isn't registered yet. Replace this one
// constant with the live domain when it is — every canonical/OG/Twitter URL
// this component writes derives from it. Keep in sync with the same
// placeholder in index.html.
const SITE_ORIGIN = 'https://maxmasarski.dev'

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  if (!href) return
  let el = document.querySelector(`link[rel="${rel}"]`)
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
export default function Seo({ title, description, image, path = '/', noindex = false }) {
  useEffect(() => {
    if (title) document.title = title

    const url = `${SITE_ORIGIN}${path}`
    const absoluteImage = image ? `${SITE_ORIGIN}${image}` : undefined

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')

    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', absoluteImage)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', absoluteImage)

    upsertLink('canonical', url)
  }, [title, description, image, path, noindex])

  return null
}
