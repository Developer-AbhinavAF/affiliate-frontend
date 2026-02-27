import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false

function ensureRegistered() {
  if (registered) return
  gsap.registerPlugin(ScrollTrigger)
  registered = true
}

export function useGsapReveal(containerRef, opts = {}) {
  const {
    selector = '[data-gsap]',
    y = 14,
    duration = 0.6,
    stagger = 0.08,
    ease = 'power2.out',
    start = 'top 85%',
    once = true,
  } = opts

  useLayoutEffect(() => {
    ensureRegistered()

    const el = containerRef?.current
    if (!el) return undefined

    const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (reduced) return undefined

    const ctx = gsap.context(() => {
      const targets = Array.from(el.querySelectorAll(selector))
      if (!targets.length) return

      gsap.set(targets, { opacity: 0, y })
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration,
        ease,
        stagger,
        scrollTrigger: {
          trigger: el,
          start,
          once,
        },
      })
    }, el)

    return () => ctx.revert()
  }, [containerRef, duration, ease, once, selector, stagger, start, y])
}
