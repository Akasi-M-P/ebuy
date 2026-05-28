import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { token, password } = await req.json()

  if (!token || !password) {
    return NextResponse.json({ error: 'Token and password are required.' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  }

  const record = await prisma.verificationToken.findUnique({ where: { token } })

  if (!record) {
    return NextResponse.json({ error: 'Invalid or already-used reset link.' }, { status: 400 })
  }
  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } })
    return NextResponse.json({ error: 'This reset link has expired. Please request a new one.' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email: record.identifier } })
  if (!user) {
    return NextResponse.json({ error: 'Account not found.' }, { status: 404 })
  }

  const hashed = await hash(password, 12)
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } })
  await prisma.verificationToken.delete({ where: { token } })

  return NextResponse.json({ ok: true })
}