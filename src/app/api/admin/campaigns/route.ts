import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const s = await getServerSession(authOptions)
  return s?.user?.role === 'admin' ? s : null
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const campaigns = await prisma.emailCampaign.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(campaigns)
}

export async function POST(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name, subject, send } = await req.json()
  if (!name?.trim() || !subject?.trim()) {
    return NextResponse.json({ error: 'Name and subject are required.' }, { status: 400 })
  }

  let recipients = 0
  let sentAt: Date | null = null
  let status = 'draft'

  if (send) {
    recipients = await prisma.user.count({ where: { role: 'customer' } })
    sentAt     = new Date()
    status     = 'sent'
  }

  const campaign = await prisma.emailCampaign.create({
    data: { name, subject, status, sentAt, recipients },
  })
  return NextResponse.json(campaign, { status: 201 })
}