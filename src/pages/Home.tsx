import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ProductList from '../components/ProductList'
import Intro from '../components/Intro'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    if (!loading && location.state && (location.state as any).scrollTo) {
      const targetId = (location.state as any).scrollTo
      setTimeout(() => {
        const element = document.getElementById(targetId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        } else if (targetId === 'hero') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 500) // Delay to allow animation and rendering
    }
  }, [loading, location.state])

  return (
    <>
      <AnimatePresence mode='wait'>
        {loading ? (
          <Intro key="intro" onComplete={() => setLoading(false)} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Navbar />
            <Hero />
            <ProductList />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
