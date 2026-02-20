/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { LinkButton } from '../LinkButton'

export async function EventsListBlock({ block }: { block: any }) {
  const { heading, headingColor, showCount = 6, filterByType = 'all', layout = 'grid', links, backgroundColor } = block
  const bgClass = backgroundColor === 'dark' ? 'bg-dark' : backgroundColor === 'light-gray' ? 'bg-light-gray' : 'bg-white'

  let events: any[] = []
  try {
    const payload = await getPayload({ config: configPromise })

    const where: any = {
      _status: { equals: 'published' },
    }

    if (filterByType !== 'all') {
      where.eventType = { equals: filterByType }
    }

    const result = await payload.find({
      collection: 'events',
      where,
      sort: 'date',
      limit: showCount,
      depth: 1,
    })

    events = result.docs
  } catch {
    // Events collection may not have data yet
  }

  return (
    <section className={`block-events ${bgClass}`}>
      <div className="events-inner">
        {heading && (
          <h2 style={headingColor ? { color: headingColor } : undefined}>{heading}</h2>
        )}
        {events.length === 0 ? (
          <p className="events-empty">No upcoming events at the moment. Check back soon!</p>
        ) : (
          <div className={layout === 'grid' ? 'events-grid' : 'events-list-layout'}>
            {events.map((event: any) => (
              <a key={event.id} href={`/events/${event.slug}`} className="event-card-link">
                <article className="event-card">
                  {event.featuredImage?.url && (
                    <div className="event-card-image">
                      <img src={event.featuredImage.url} alt={event.featuredImage.alt || event.title} loading="lazy" />
                    </div>
                  )}
                  <div className="event-card-body">
                    {event.eventType && (
                      <span className="event-card-type">{event.eventType}</span>
                    )}
                    <h3>{event.title}</h3>
                    <div className="event-card-meta">
                      {event.date && (
                        <span>{new Date(event.date).toLocaleDateString('en-AT', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}</span>
                      )}
                      {event.location && <span>{event.location}</span>}
                    </div>
                    {event.shortDescription && (
                      <p className="event-card-description">{event.shortDescription}</p>
                    )}
                    {event.price != null && event.price > 0 && (
                      <p className="event-card-price">
                        {event.currency === 'USD' ? '$' : '\u20AC'}{event.price}
                      </p>
                    )}
                  </div>
                </article>
              </a>
            ))}
          </div>
        )}
        {links && links.length > 0 && (
          <div className="block-actions">
            {links.map((link: any, i: number) => (
              <LinkButton key={link.id || i} link={link} className={`btn btn-${link.style || 'primary'}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
