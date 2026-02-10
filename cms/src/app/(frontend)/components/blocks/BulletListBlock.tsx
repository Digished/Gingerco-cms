/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

const bulletSymbols: Record<string, string> = {
  dot: '\u2022',
  dash: '\u2014',
  check: '\u2713',
  arrow: '\u25B8',
}

export function BulletListBlock({ block }: { block: any }) {
  const {
    heading,
    description,
    columns = '1',
    lists = [],
    bulletColor = '#D4AF37',
    bulletStyle = 'dot',
    backgroundColor = 'white',
  } = block

  const bgClass = backgroundColor === 'dark' ? 'bg-dark' : backgroundColor === 'light-gray' ? 'bg-light-gray' : ''
  const symbol = bulletSymbols[bulletStyle] || bulletSymbols.dot

  return (
    <section className={`block-bullet-list ${bgClass}`}>
      <div className="bullet-list-inner">
        {heading && <h2>{heading}</h2>}
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
      </div>
    </section>
  )
}
