import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const s = await getServerSession(authOptions)
  return s?.user?.role === 'admin' ? s : null
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { send } = await req.json()

  if (send) {
    const recipients = await prisma.user.count({ where: { role: 'customer' } })
    const campaign = await prisma.emailCampaign.update({
      where: { id: params.id },
      data: { status: 'sent', sentAt: new Date(), recipients },
    })
    return NextResponse.json(campaign)
  }

  return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 })
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await prisma.emailCampaign.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}