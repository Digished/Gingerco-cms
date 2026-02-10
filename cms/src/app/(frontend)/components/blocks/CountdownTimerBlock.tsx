'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'

function getTimeLeft(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function resolveLinkClient(link: any): { href: string; target?: string; rel?: string } {
  let href = '#'
  if (link.linkType === 'page' && link.page) {
    const slug = typeof link.page === 'object' ? link.page.slug : null
    href = slug === 'home' ? '/' : `/${slug}`
  } else if (link.url) {
    href = link.url
  }
  return {
    href,
    ...(link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
  }
}

export function CountdownTimerBlock({ block }: { block: any }) {
  const { heading, targetDate, description, link, expiredMessage } = block
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      const tl = getTimeLeft(targetDate)
      setTimeLeft(tl)
      if (!tl) clearInterval(timer)
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  const resolved = link?.label ? resolveLinkClient(link) : null

  return (
    <section className="block-countdown">
      <div className="countdown-inner">
        <h2>{heading}</h2>
        {timeLeft ? (
          <div className="countdown-grid">
            <div className="countdown-unit">
              <span className="countdown-number">{timeLeft.days}</span>
              <span className="countdown-label">Days</span>
            </div>
            <div className="countdown-unit">
              <span className="countdown-number">{timeLeft.hours}</span>
              <span className="countdown-label">Hours</span>
            </div>
            <div className="countdown-unit">
              <span className="countdown-number">{timeLeft.minutes}</span>
              <span className="countdown-label">Minutes</span>
            </div>
            <div className="countdown-unit">
              <span className="countdown-number">{timeLeft.seconds}</span>
              <span className="countdown-label">Seconds</span>
            </div>
          </div>
        ) : (
          <p className="countdown-expired">{expiredMessage || 'This event has started!'}</p>
        )}
        {description && <p className="countdown-description">{description}</p>}
        {resolved && (
          <a
            href={resolved.href}
            className="btn btn-primary"
            style={{ marginTop: '1.5rem' }}
            {...(resolved.target ? { target: resolved.target, rel: resolved.rel } : {})}
          >
            {link.label}
          </a>
        )}
      </div>
    </section>
  )
}
