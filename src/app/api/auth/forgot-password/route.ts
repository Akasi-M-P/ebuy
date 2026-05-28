import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { email } = await req.json()
  if (!email?.trim()) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })

  // Always respond with success to avoid leaking whether an email exists
  if (!user) {
    return NextResponse.json({ ok: true })
  }

  // Invalidate any existing reset tokens for this email
  await prisma.verificationToken.deleteMany({ where: { identifier: email } })

  const token   = randomUUID()
  const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  await prisma.verificationToken.create({
    data: { identifier: email, token, expires },
  })

  const resetUrl = `${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/reset-password?token=${token}`

  // In production: send resetUrl via email (Resend, SendGrid, etc.)
  // For now, return the link so it can be used without an email service.
  return NextResponse.json({ ok: true, resetUrl })
}