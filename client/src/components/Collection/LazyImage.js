import { useState, useEffect, useRef } from 'react'

const LazyImage = ({ image, setIndex, setLightboxOpen, index }) => {
  const [isVisible, setIsVisible] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current)
      }
    }
  }, [])

  return (
    <img
      ref={imgRef}
      src={isVisible ? image.src : ''}
      className="w-full rounded-lg block"
      onClick={() => {
        setIndex(index)
        setLightboxOpen(true)
      }}
      loading="lazy"
      alt={image.alt || 'Image'}
    />
  )
}

export default LazyImage
