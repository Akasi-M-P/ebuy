import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const id: string | undefined = (session?.user as any)?.id
  if (!id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id },
    select: { name: true, email: true, phone: true },
  })
  return NextResponse.json(user)
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const id: string | undefined = (session?.user as any)?.id
  if (!id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, phone } = await req.json()
  const user = await prisma.user.update({
    where: { id },
    data:  { name: name ?? undefined, phone: phone ?? undefined },
    select: { name: true, email: true, phone: true },
  })
  return NextResponse.json(user)
}