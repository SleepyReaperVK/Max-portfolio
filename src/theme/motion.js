const motion = {
  fast: 200,
  base: 400,
  slow: 700,
  easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
}

// framer-motion variants — the ONLY scroll-reveal definition in the project
export const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: motion.base / 1000, delay, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default motion
