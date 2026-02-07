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
          {members.map((member: any) => (
            <div key={member.id} className="team-card">
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
                    {member.socialLinks.instagram && <a href={member.socialLinks.instagram} target="_blank" rel="noopener noreferrer">IG</a>}
                    {member.socialLinks.facebook && <a href={member.socialLinks.facebook} target="_blank" rel="noopener noreferrer">FB</a>}
                    {member.socialLinks.tiktok && <a href={member.socialLinks.tiktok} target="_blank" rel="noopener noreferrer">TK</a>}
                    {member.socialLinks.website && <a href={member.socialLinks.website} target="_blank" rel="noopener noreferrer">Web</a>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
