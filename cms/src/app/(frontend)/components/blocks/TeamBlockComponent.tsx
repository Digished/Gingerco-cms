/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function TeamBlockComponent({ block }: { block: any }) {
  const { heading, description, showAll, selectedMembers, columns = '3' } = block

  let members: any[] = []

  try {
    const payload = await getPayload({ config: configPromise })

    if (showAll) {
      const result = await payload.find({
        collection: 'team-members',
        sort: 'order',
        limit: 50,
      })
      members = result.docs
    } else if (selectedMembers && selectedMembers.length > 0) {
      members = selectedMembers.map((m: any) => (typeof m === 'object' ? m : null)).filter(Boolean)
    }
  } catch {
    // Collection may not exist yet
  }

  if (members.length === 0) return null

  return (
    <section className="block-team">
      <div className="team-inner">
        {heading && <h2>{heading}</h2>}
        {description && <p className="team-description">{description}</p>}
        <div className={`team-grid cols-${columns}`}>
          {members.map((member: any) => {
            const profileHref = member.slug ? `/team/${member.slug}` : undefined
            const CardWrapper = profileHref ? 'a' : 'div'
            const wrapperProps = profileHref ? { href: profileHref, className: 'team-card-link' } : {}

            return (
              <CardWrapper key={member.id} {...wrapperProps as any}>
                <div className="team-card">
                  {member.photo?.url && (
                    <div className="team-card-photo">
                      <img src={member.photo.url} alt={member.photo.alt || member.name} />
                    </div>
                  )}
                  <div className="team-card-body">
                    <h3>{member.name}</h3>
                    <p className="team-card-role">{member.role}</p>
                    {member.bio && <p className="team-card-bio">{member.bio}</p>}
                    {member.specialties && (
                      <div className="team-card-specialties">
                        {member.specialties.split(',').map((s: string, i: number) => (
                          <span key={i} className="team-specialty-tag">{s.trim()}</span>
                        ))}
                      </div>
                    )}
                    {member.socialLinks && (
                      <div className="team-card-social">
                        {member.socialLinks.instagram && (
                          <a href={member.socialLinks.instagram} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2">
                              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                          </a>
                        )}
                        {member.socialLinks.facebook && (
                          <a href={member.socialLinks.facebook} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2">
                              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            </svg>
                          </a>
                        )}
                        {member.socialLinks.tiktok && (
                          <a href={member.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="none">
                              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                            </svg>
                          </a>
                        )}
                        {member.socialLinks.website && (
                          <a href={member.socialLinks.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <line x1="2" y1="12" x2="22" y2="12" />
                              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardWrapper>
            )
          })}
        </div>
      </div>
    </section>
  )
}
