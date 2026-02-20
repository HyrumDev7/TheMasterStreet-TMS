'use client'

import Link from 'next/link'
import {
  CalendarDays,
  Calendar,
  Newspaper,
  ShoppingBag,
  BookOpen,
} from 'lucide-react'
import { CalendarCardControls } from '@/components/calendar/CalendarCardControls'
import { HOME_CARDS } from '@/lib/homeCards'
import styles from '@/app/page.module.css'

const ICON_MAP = {
  CalendarDays,
  Calendar,
  Newspaper,
  ShoppingBag,
  BookOpen,
} as const

const CARD_TITLE_CLASS: Record<string, string> = {
  'card-eventos': styles.cardTitleBtnEventos,
  'card-calendario': '',
  'card-noticias': styles.cardTitleBtnNoticias,
  'card-shop': styles.cardTitleBtnShop,
  'card-historia': styles.cardTitleBtnHistoria,
}

export function HomeCardsSection() {
  return (
    <section className={styles.cardsSection}>
      <div className={styles.cardsContainer}>
        <div className={styles.cardsGrid}>
          {HOME_CARDS.map((card) => {
            const CardIcon = ICON_MAP[card.icon]
            const isCalendario = card.id === 'card-calendario'
            const imageEl = (
              <div
                className={styles.cardImage}
                style={{
                  backgroundImage: `url(/images/${card.id}.${card.imgExt})`,
                }}
              />
            )
            const titleEl = (
              <>
                {isCalendario && (
                  <CardIcon size={16} className={styles.cardTitleIcon} aria-hidden />
                )}
                <span className={styles.cardTitle}>
                  {card.title.split(' ').map((word) => (
                    <span key={word} className={styles.cardTitleLine}>
                      {word}
                    </span>
                  ))}
                  <span className={styles.cardTitleArrow}> →</span>
                </span>
              </>
            )
            if (isCalendario) {
              return (
                <div
                  key={card.id}
                  className={`${styles.card} ${styles.cardCalendario}`}
                >
                  <Link href={card.href} className={styles.cardImageLink} aria-label={card.title}>
                    {imageEl}
                  </Link>
                  <div className={styles.cardBody}>
                    <Link
                      href={card.href}
                      className={`${styles.cardTitleBtn} ${CARD_TITLE_CLASS[card.id] ?? ''}`}
                    >
                      {titleEl}
                    </Link>
                    <CalendarCardControls className={styles.cardTags} />
                  </div>
                </div>
              )
            }
            return (
              <Link key={card.id} href={card.href} className={styles.card}>
                {imageEl}
                <div className={styles.cardBody}>
                  <span className={`${styles.cardTitleBtn} ${CARD_TITLE_CLASS[card.id] ?? ''}`}>
                    {titleEl}
                  </span>
                  <div className={styles.cardTags}>
                    {card.tags.map((tag, i) => (
                      <span
                        key={tag}
                        className={i === 0 ? styles.cardTagLarge : styles.cardTagSmall}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
