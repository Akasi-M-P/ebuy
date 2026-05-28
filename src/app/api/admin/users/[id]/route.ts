import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'admin') return null
  return session
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const currentId = (session.user as { id?: string }).id
  if (params.id === currentId) {
    return NextResponse.json({ error: 'Cannot revoke your own admin access' }, { status: 400 })
  }
  await prisma.user.update({ where: { id: params.id }, data: { role: 'customer' } })
  return NextResponse.json({ success: true })
}