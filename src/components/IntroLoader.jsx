import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

const BG = '#252830'
const ORANGE = '#ff7a18'

/**
 * IntroLoader
 * - Full-screen fixed overlay
 * - Runs once per page load/refresh
 * - Timeline (approx 5.2s total + exit)
 *   0.0–1.0: cart pop-in
 *   1.0–2.0: split motion (cart left, text in from right)
 *   2.0–3.0: "Kart" transitions to orange
 *   3.0–4.0: underline swoosh draws
 *   4.0–5.0: hold
 *   5.0–5.6: exit fade/slide
 */
export function IntroLoader({ onComplete }) {
  const [visible, setVisible] = useState(true)

  // Total visible time before exit starts.
  const timelineMs = 8200

  useEffect(() => {
    const t = window.setTimeout(() => {
      setVisible(false)
    }, timelineMs)
    return () => window.clearTimeout(t)
  }, [])

  const exitMs = 600
  useEffect(() => {
    if (visible) return
    const t = window.setTimeout(() => {
      onComplete?.()
    }, exitMs)
    return () => window.clearTimeout(t)
  }, [visible, onComplete])

  const sizes = useMemo(() => {
    // Responsive sizing: looks big on desktop, scales down on mobile.
    const iconW = 'clamp(110px, 14vw, 190px)'
    const iconH = 'clamp(70px, 10vw, 120px)'
    const text = 'clamp(44px, 6.4vw, 86px)'
    return { iconW, iconH, text }
  }, [])

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="intro-loader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: exitMs / 1000, ease: [0.22, 1, 0.36, 1] }}
          style={{ backgroundColor: BG }}
          className="fixed inset-0 z-9999 grid place-items-center overflow-hidden"
          aria-label="Intro loader"
        >
          <div className="relative flex items-center justify-center">
            {/* Cinematic vignette */}
            <div
              className="pointer-events-none absolute inset-0 -m-[40vmax] opacity-70"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(255,255,255,0.10) 0%, rgba(37,40,48,0.0) 48%, rgba(0,0,0,0.35) 100%)',
                filter: 'blur(2px)',
              }}
            />

            {/* Unit wrapper so cart+text stay centered together */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              className="relative flex items-center"
              style={{ gap: 'clamp(14px, 2vw, 24px)' }}
            >
              {/* STEP 1 + STEP 2: Cart pop-in then slide left */}
              <motion.img
                src="/cart-logo.png"
                alt="TrendKart cart"
                style={{ width: sizes.iconW, height: sizes.iconH, objectFit: 'contain' }}
                className="select-none"
                initial={{ opacity: 0, scale: 0, x: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 'clamp(-24px, -3vw, -44px)',
                }}
                transition={{
                  opacity: { duration: 0.55, ease: 'easeOut' },
                  scale: { duration: 0.95, ease: [0.175, 0.885, 0.32, 1.275] }, // smooth bounce
                  x: { delay: 1.0, duration: 1.0, ease: [0.22, 1, 0.36, 1] },
                }}
                draggable={false}
              />

              {/* STEP 2: Text slides in from right */}
              <motion.div
                initial={{ opacity: 0, maxWidth: 0, x: 'clamp(28px, 6vw, 96px)' }}
                animate={{ opacity: 1, maxWidth: 900, x: 0 }}
                transition={{ delay: 1.0, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden"
                style={{ willChange: 'max-width, transform, opacity' }}
              >
                <div
                  style={{
                    fontFamily: 'Poppins, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
                    fontSize: sizes.text,
                    lineHeight: 1.0,
                    letterSpacing: '1px',
                    fontStyle: 'italic',
                    textShadow: '0 10px 22px rgba(0,0,0,0.38)',
                  }}
                >
                  <span style={{ color: '#ffffff', fontWeight: 600 }}>Trend</span>

                  {/* STEP 3: Only Kart transitions to orange */}
                  <motion.span
                    initial={{ color: '#ffffff' }}
                    animate={{ color: ORANGE }}
                    transition={{ delay: 2.0, duration: 1.0, ease: 'easeInOut' }}
                    style={{ fontWeight: 800 }}
                  >
                    Kart
                  </motion.span>
                </div>

                {/* STEP 4: Underline swoosh draw (SVG path stroke) */}
                <div className="mt-2">
                  <motion.svg
                    width="100%"
                    height="22"
                    viewBox="0 0 520 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="block"
                    style={{ maxWidth: 'clamp(240px, 46vw, 620px)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.0, duration: 0.2, ease: 'easeOut' }}
                  >
                    <defs>
                      <linearGradient id="tk_swoosh" x1="0" y1="0" x2="520" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#ff2d6f" />
                        <stop offset="0.55" stopColor="#ff7a18" />
                        <stop offset="1" stopColor="#ff7a18" />
                      </linearGradient>
                      <filter id="tk_glow" x="-20%" y="-200%" width="140%" height="500%">
                        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.35" />
                      </filter>
                    </defs>
                    <motion.path
                      d="M10 15 C 155 30, 330 28, 448 14 C 474 11, 497 11, 510 12 M510 12 L498 6 M510 12 L498 18"
                      stroke="url(#tk_swoosh)"
                      strokeWidth="4.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#tk_glow)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 3.0, duration: 1.25, ease: [0.4, 0, 0.2, 1] }}
                    />
                  </motion.svg>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
