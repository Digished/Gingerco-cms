/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ slug: string }>
}

export default async function TeamMemberProfile({ params }: Args) {
  const { slug } = await params

  try {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'team-members',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })

    const member = result.docs[0] as any
    if (!member) notFound()

    const specialties = member.specialties
      ? member.specialties.split(',').map((s: string) => s.trim()).filter(Boolean)
      : []

    const extraPhotos = [member.photo2, member.photo3].filter((p: any) => p?.url)

    return (
      <main className="team-profile">
        <div className="team-profile-inner">
          {/* Hero / Main Photo + Info */}
          <div className="team-profile-hero">
            <div className="team-profile-photo-col">
              {member.photo?.url ? (
                <img src={member.photo.url} alt={member.photo.alt || member.name} className="team-profile-photo" />
              ) : (
                <div className="team-profile-placeholder">
                  <span>{member.name.charAt(0)}</span>
                </div>
              )}
            </div>

            <div className="team-profile-info">
              <h1>{member.name}</h1>
              <p className="team-profile-role">{member.role}</p>

              {specialties.length > 0 && (
                <div className="team-profile-specialties">
                  {specialties.map((s: string, i: number) => (
                    <span key={i} className="team-specialty-tag">{s}</span>
                  ))}
                </div>
              )}

              {member.bio && (
                <div className="team-profile-bio">
                  <p>{member.bio}</p>
                </div>
              )}

              {member.socialLinks && (
                <div className="team-profile-social">
                  {member.socialLinks.instagram && (
                    <a href={member.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
                      <svg className="social-icon" viewBox="0 0 24 24">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                      Instagram
                    </a>
                  )}
                  {member.socialLinks.facebook && (
                    <a href={member.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="social-link">
                      <svg className="social-icon" viewBox="0 0 24 24">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                      Facebook
                    </a>
                  )}
                  {member.socialLinks.tiktok && (
                    <a href={member.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="social-link">
                      <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                      </svg>
                      TikTok
                    </a>
                  )}
                  {member.socialLinks.website && (
                    <a href={member.socialLinks.website} target="_blank" rel="noopener noreferrer" className="social-link">
                      <svg className="social-icon" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                      Website
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Extra Photos Gallery */}
          {extraPhotos.length > 0 && (
            <div className="team-profile-gallery">
              {extraPhotos.map((photo: any, i: number) => (
                <div key={i} className="team-profile-gallery-item">
                  <img src={photo.url} alt={photo.alt || `${member.name} photo ${i + 2}`} />
                </div>
              ))}
            </div>
          )}

          <div className="team-profile-back">
            <a href="/" className="btn btn-outline">&larr; Back</a>
          </div>
        </div>
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
      collection: 'team-members',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    const member = result.docs[0] as any
    if (!member) return { title: 'Not Found' }

    return {
      title: `${member.name} - ${member.role}`,
      description: member.bio || undefined,
    }
  } catch {
    return { title: 'Not Found' }
  }
}
