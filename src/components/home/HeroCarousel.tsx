'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  CAROUSEL_IMAGE_FILES,
  CAROUSEL_SLIDE_DURATION_SEC,
} from '@/lib/carousel'
import styles from './HeroCarousel.module.css'

const CAROUSEL_IMAGES = CAROUSEL_IMAGE_FILES.map((file) => ({
  src: `/images/${file}`,
  alt: 'The Master Street',
}))

/** sizes: hasta 3840px para pantallas grandes y Retina; evita pixelación en 2x/4K */
const IMAGE_SIZES =
  '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, (max-width: 1280px) 1280px, (max-width: 1920px) 1920px, 3840px'

export function HeroCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % CAROUSEL_IMAGES.length)
    }, CAROUSEL_SLIDE_DURATION_SEC * 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className={styles.section} aria-label="Carrusel de imágenes">
      <div className={styles.carouselContainer}>
        <div className={styles.track} style={{ transform: `translateX(-${index * 100}%)` }}>
          {CAROUSEL_IMAGES.map((img, i) => (
            <div key={img.src} className={styles.slide}>
              <Image
                src={img.src}
                alt={`${img.alt} – imagen ${i + 1}`}
                fill
                className={styles.image}
                sizes={IMAGE_SIZES}
                quality={95}
                priority={i === 0}
                loading={i === 0 ? undefined : 'lazy'}
              />
            </div>
          ))}
        </div>
      <div className={styles.dots} role="tablist" aria-label="Seleccionar imagen">
        {CAROUSEL_IMAGES.map((img, i) => (
          <button
            key={img.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Imagen ${i + 1}`}
            className={styles.dot}
            data-active={i === index}
            onClick={() => setIndex(i)}
          />
        ))}
        </div>
      </div>
    </section>
  )
}
