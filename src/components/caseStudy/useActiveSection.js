import { useEffect, useState } from 'react'

// Shared by SystemNav (desktop list) and SystemDotRail (mobile dot rail) so the
// two never disagree about which section is current. Exactly one of them is
// mounted at a time — see PrayForPlagues.jsx — so this only ever runs one
// observer.
export default function useActiveSection(systems = []) {
  const [activeId, setActiveId] = useState(systems[0]?.id)

  useEffect(() => {
    const elements = systems.map((system) => document.getElementById(system.id)).filter(Boolean)
    if (!elements.length) return undefined

    // The observer callback only ever receives entries whose intersection
    // state just changed — not the full observed set. So we keep our own
    // running map of "is this element currently inside the band" per
    // element, updated incrementally from each callback, and recompute the
    // topmost currently-visible element from that map every time — instead
    // of trying to pick a winner out of the (possibly single-element,
    // possibly stale) `entries` array alone.
    const isIntersecting = new Map(elements.map((element) => [element, false]))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => isIntersecting.set(entry.target, entry.isIntersecting))

        const visible = elements.filter((element) => isIntersecting.get(element))
        if (visible.length === 0) return

        // Pick the section that entered the band *last* (greatest `top`), not
        // the one highest on the page. Adjacent sections both intersect the
        // narrow 30%-40% band during a transition, and the outgoing one always
        // has the smaller `top` (it starts far above the viewport), so choosing
        // the topmost kept the nav one section behind the heading on screen.
        const current = visible.reduce((best, element) =>
          element.getBoundingClientRect().top >= best.getBoundingClientRect().top ? element : best,
        )
        setActiveId(current.id)
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [systems])

  return activeId
}
