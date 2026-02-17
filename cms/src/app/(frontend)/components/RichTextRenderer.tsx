/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { RichText } from './RichText'

export function RichTextRenderer({ content }: { content: any }) {
  return <RichText content={content} />
}
