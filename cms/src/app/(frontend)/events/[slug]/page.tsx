/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { RichText } from '../../components/RichText'
import { VideoEmbed } from '../../components/VideoEmbed'
import { EventCTA } from '../../components/EventCTA'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ slug: string }>
}

export default async function EventDetail({ params }: Args) {
  const { slug } = await params

  try {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'events',
      where: { slug: { equals: slug }, _status: { equals: 'published' } },
      limit: 1,
      depth: 2,
    })

    const event = result.docs[0] as any
    if (!event) notFound()

    const dateStr = event.date
      ? new Date(event.date).toLocaleDateString('en-AT', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : null

    const timeStr = event.date
      ? new Date(event.date).toLocaleTimeString('en-AT', { hour: '2-digit', minute: '2-digit' })
      : null

    const endTimeStr = event.endDate
      ? new Date(event.endDate).toLocaleTimeString('en-AT', { hour: '2-digit', minute: '2-digit' })
      : null

    const currency = event.currency === 'USD' ? '$' : '\u20AC'

    return (
      <main className="event-detail">
        {/* Hero */}
        <section className="event-hero">
          {event.featuredImage?.url && (
            <img src={event.featuredImage.url} alt={event.featuredImage.alt || event.title} className="event-hero-bg" />
          )}
          <div className="event-hero-overlay" />
          <div className="event-hero-content">
            <h1>{event.title}</h1>
            {event.shortDescription && <p>{event.shortDescription}</p>}
            <div className="event-hero-actions">
              {event.externalRegistrationUrl && (
                <a href={event.externalRegistrationUrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                  Get Tickets
                </a>
              )}
              {event.price != null && (
                <span className="event-hero-price">
                  {event.price === 0 ? 'Free Event' : `From ${currency}${event.price}`}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Description / Overview */}
        {event.description && (
          <section className="event-overview">
            <div className="event-container">
              <h2 className="event-section-title">Event Overview</h2>
              <div className="rich-text">
                <RichText content={event.description} />
              </div>
            </div>
          </section>
        )}

        {/* Info Cards */}
        <section className="event-structure">
          <div className="event-container">
            <h2 className="event-section-title">Event Details</h2>
            <div className="event-info-grid">
              {dateStr && (
                <div className="info-card">
                  <div className="info-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <h3>Date</h3>
                  <p>{dateStr}</p>
                </div>
              )}
              {event.location && (
                <div className="info-card">
                  <div className="info-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <h3>Venue</h3>
                  <p>{event.location}{event.address ? `, ${event.address}` : ''}</p>
                </div>
              )}
              {timeStr && (
                <div className="info-card">
                  <div className="info-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <h3>Time</h3>
                  <p>{timeStr}{endTimeStr ? ` - ${endTimeStr}` : ''}</p>
                </div>
              )}
              {event.capacity && (
                <div className="info-card">
                  <div className="info-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <h3>Capacity</h3>
                  <p>{event.capacity} participants</p>
                </div>
              )}
              {event.eventType && (
                <div className="info-card">
                  <div className="info-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <h3>Type</h3>
                  <p style={{ textTransform: 'capitalize' }}>{event.eventType}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Sessions */}
        {event.sessions && event.sessions.length > 0 && (
          <section className="event-sessions">
            <div className="event-container">
              <h2 className="event-section-title">Sessions</h2>
              <div className="sessions-grid">
                {event.sessions.map((session: any, i: number) => (
                  <div key={session.id || i} className="session-card">
                    <h3>{session.sessionTitle}</h3>
                    <div className="session-meta">
                      {session.startTime && (
                        <span>
                          {new Date(session.startTime).toLocaleTimeString('en-AT', { hour: '2-digit', minute: '2-digit' })}
                          {session.endTime && ` - ${new Date(session.endTime).toLocaleTimeString('en-AT', { hour: '2-digit', minute: '2-digit' })}`}
                        </span>
                      )}
                      {session.instructor && <span>Led by {session.instructor}</span>}
                    </div>
                    {(session.sessionPrice != null || session.sessionCapacity) && (
                      <div className="session-details">
                        {session.sessionPrice != null && (
                          <span className="session-price">
                            {session.sessionPrice === 0 ? 'FREE' : `${currency}${session.sessionPrice}`}
                          </span>
                        )}
                        {session.sessionCapacity && (
                          <span className="session-capacity">{session.sessionCapacity} spots</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Gallery */}
        {event.gallery && event.gallery.length > 0 && (
          <section className="event-gallery">
            <div className="event-container">
              <div className="event-gallery-grid">
                {event.gallery.map((item: any, i: number) => (
                  <div key={item.id || i} className="event-gallery-item">
                    {item.image?.url && (
                      <img src={item.image.url} alt={item.image.alt || `Gallery ${i + 1}`} loading="lazy" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Video */}
        {event.videoUrl && (
          <section className="event-video-section">
            <div className="event-container">
              <div className="event-video-wrapper">
                <VideoEmbed url={event.videoUrl} />
              </div>
            </div>
          </section>
        )}

        {/* Event Sponsors / Partners */}
        {event.sponsors && event.sponsors.length > 0 && (
          <section className="event-sponsors">
            <div className="event-container">
              <h2 className="event-section-title">Event Partners & Sponsors</h2>
              <div className="sponsors-grid">
                {event.sponsors.map((sponsor: any) => {
                  const s = typeof sponsor === 'object' ? sponsor : null
                  if (!s) return null
                  const content = (
                    <div key={s.id} className="sponsor-item">
                      {s.logo?.url ? (
                        <img src={s.logo.url} alt={s.name} loading="lazy" />
                      ) : (
                        <span className="sponsor-name">{s.name}</span>
                      )}
                      {s.type && <span className="sponsor-type">{s.type}</span>}
                    </div>
                  )
                  if (s.url) {
                    return (
                      <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="sponsor-link">
                        {content}
                      </a>
                    )
                  }
                  return content
                })}
              </div>
            </div>
          </section>
        )}

        {/* Registration CTA */}
        {event.registrationEnabled !== false && (
          <EventCTA event={event} currency={currency} />
        )}
      </main>
    )
  } catch {
    notFound()
  }
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params

  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'events',
      where: { slug: { equals: slug }, _status: { equals: 'published' } },
      limit: 1,
    })

    const event = result.docs[0] as any
    if (!event) return { title: 'Not Found' }

    return {
      title: event.title,
      description: event.shortDescription || undefined,
    }
  } catch {
    return { title: 'Not Found' }
  }
}
