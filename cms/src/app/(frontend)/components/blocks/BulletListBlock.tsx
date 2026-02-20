/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { LinkButton } from '../LinkButton'

const bulletSymbols: Record<string, string> = {
  dot: '\u2022',
  dash: '\u2014',
  check: '\u2713',
  arrow: '\u25B8',
}

export function BulletListBlock({ block }: { block: any }) {
  const {
    heading,
    headingColor,
    description,
    columns = '1',
    lists = [],
    bulletColor = '#D4AF37',
    bulletStyle = 'dot',
    links,
    backgroundColor = 'white',
  } = block

  const bgClass = backgroundColor === 'dark' ? 'bg-dark' : backgroundColor === 'light-gray' ? 'bg-light-gray' : ''
  const symbol = bulletSymbols[bulletStyle] || bulletSymbols.dot

  return (
    <section className={`block-bullet-list ${bgClass}`}>
      <div className="bullet-list-inner">
        {heading && (
          <h2 style={headingColor ? { color: headingColor } : undefined}>{heading}</h2>
        )}
        {description && <p className="bullet-list-description">{description}</p>}
        <div className={`bullet-list-grid cols-${columns}`}>
          {lists.map((list: any, i: number) => (
            <div key={list.id || i} className="bullet-list-column">
              {list.listHeading && <h3>{list.listHeading}</h3>}
              <ul className="bullet-items">
                {list.items?.map((item: any, j: number) => (
                  <li key={item.id || j}>
                    <span className="bullet-icon" style={{ color: bulletColor }}>{symbol}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
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
