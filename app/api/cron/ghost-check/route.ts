import { NextRequest, NextResponse } from 'next/server'
import { getSubscribedUsers } from '@/lib/db'
import { sendGhostCheckEmail } from '@/lib/resend'

export async function GET(req: NextRequest) {
  // Verify this is called by Vercel Cron or an authorized caller
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const subscribedUsers = await getSubscribedUsers()

    const results = await Promise.allSettled(
      subscribedUsers.map((user) =>
        user.email ? sendGhostCheckEmail(user.email) : Promise.resolve()
      )
    )

    const sent = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r) => r.status === 'rejected').length

    console.log(`Ghost Check: Sent ${sent} emails, ${failed} failed`)

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: subscribedUsers.length,
    })
  } catch (error) {
    console.error('Ghost check cron error:', error)
    return NextResponse.json({ error: 'Cron failed' }, { status: 500 })
  }
}
