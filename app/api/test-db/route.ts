import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const result = await sql`SELECT NOW()`
    return NextResponse.json({ success: true, time: result.rows[0] })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Database connection failed', details: error }, { status: 500 })
  }
}