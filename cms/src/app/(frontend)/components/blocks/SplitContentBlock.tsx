/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RichTextRenderer } from '../RichTextRenderer'
import { InlineFormBlock } from './InlineFormBlock'

const layoutMap: Record<string, string> = {
  '50-50': '1fr 1fr',
  '60-40': '3fr 2fr',
  '40-60': '2fr 3fr',
  '70-30': '7fr 3fr',
  '30-70': '3fr 7fr',
}

async function resolveForm(formRef: any) {
  if (!formRef) return null
  if (typeof formRef === 'object' && formRef.id) return formRef

  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.findByID({ collection: 'forms', id: formRef, depth: 2 })
    return result
  } catch {
    return null
  }
}

async function ColumnContent({ col }: { col: any }) {
  if (!col) return null

  const { contentType, heading, richText, form } = col

  if (contentType === 'form') {
    const formData = await resolveForm(form)
    if (!formData) return null

    return (
      <div className="split-col-content">
        {heading && <h3>{heading}</h3>}
        <InlineFormBlock formData={formData} />
      </div>
    )
  }

  return (
    <div className="split-col-content">
      {heading && <h3>{heading}</h3>}
      {richText && <RichTextRenderer content={richText} />}
    </div>
  )
}

export async function SplitContentBlock({ block }: { block: any }) {
  const {
    layout = '50-50',
    leftColumn,
    rightColumn,
    backgroundColor = 'white',
    verticalAlign = 'top',
  } = block

  const bgClass = backgroundColor === 'dark' ? 'bg-dark' : backgroundColor === 'light-gray' ? 'bg-light-gray' : ''
  const gridCols = layoutMap[layout] || layoutMap['50-50']

  return (
    <section className={`block-split-content ${bgClass}`}>
      <div
        className="split-content-grid"
        style={{
          gridTemplateColumns: gridCols,
          alignItems: verticalAlign === 'center' ? 'center' : 'start',
        }}
      >
        <div className="split-col split-col-left">
          <ColumnContent col={leftColumn} />
        </div>
        <div className="split-col split-col-right">
          <ColumnContent col={rightColumn} />
        </div>
      </div>
    </section>
  )
}
