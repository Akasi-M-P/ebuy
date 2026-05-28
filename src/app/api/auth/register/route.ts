import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { name, email, password } = await req.json()

  if (!name?.trim() || !email?.trim() || !password) {
    return NextResponse.json({ error: 'Name, email and password are required.' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing?.password) {
    return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
  }

  const hashed = await hash(password, 12)

  if (existing) {
    // Guest user from a previous order — upgrade by setting name + password
    const user = await prisma.user.update({
      where: { id: existing.id },
      data:  { name, password: hashed },
      select: { id: true, name: true, email: true },
    })
    return NextResponse.json(user)
  }

  const user = await prisma.user.create({
    data: { name, email, password: hashed, role: 'customer' },
    select: { id: true, name: true, email: true },
  })
  return NextResponse.json(user, { status: 201 })
}