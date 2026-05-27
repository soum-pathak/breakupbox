import { Resend } from 'resend'

let _resend: Resend | null = null
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY!)
  }
  return _resend
}


const FROM_EMAIL =
  process.env.EMAIL_FROM ?? 'BreakupBox <noreply@breakupbox.app>'

export async function sendUpgradeEmail(
  email: string,
  tier: 'one_time' | 'subscription'
): Promise<void> {
  const subject =
    tier === 'subscription'
      ? 'Welcome to Healing Mode 💜 — BreakupBox'
      : 'Your Full Checklist is Unlocked 🔓 — BreakupBox'

  const body =
    tier === 'subscription'
      ? `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #fff; padding: 40px; border-radius: 16px;">
          <h1 style="color: #f43f5e;">Welcome to Healing Mode 💜</h1>
          <p>You've unlocked your full personalized Digital Untangling Checklist plus weekly emotional re-check reminders.</p>
          <p>Every Sunday we'll send you a gentle "Digital Ghost Check" — a reminder to sweep for any new shared accounts that might have surfaced.</p>
          <p style="color: #a1a1aa;">Take care of yourself. You've got this. 💪</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: linear-gradient(to right, #f43f5e, #ec4899); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px;">Go to Dashboard</a>
        </div>`
      : `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #fff; padding: 40px; border-radius: 16px;">
          <h1 style="color: #f43f5e;">Your Full Checklist is Unlocked 🔓</h1>
          <p>You now have access to your complete, personalized Digital Untangling Checklist — all categories, all services, fully detailed.</p>
          <p>You can also export it as a PDF anytime from your dashboard.</p>
          <p style="color: #a1a1aa;">You're taking the right steps. Be proud of yourself. 💪</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: linear-gradient(to right, #f43f5e, #ec4899); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px;">View My Checklist</a>
        </div>`

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject,
    html: body,
  })
}

export async function sendGhostCheckEmail(email: string): Promise<void> {
  await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: '👻 Digital Ghost Check — Weekly Sweep',
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #fff; padding: 40px; border-radius: 16px;">
      <h1 style="color: #f43f5e;">👻 Your Weekly Digital Ghost Check</h1>
      <p style="color: #a1a1aa;">Hey — it's Sunday. Time for your weekly sweep.</p>
      <p>Since we last checked, have any new shared accounts or digital connections surfaced? Bumped into a shared playlist? Found a co-signed app?</p>
      <p>Head to your dashboard to run a fresh scan and update your checklist.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard?scan=true" style="display: inline-block; background: linear-gradient(to right, #f43f5e, #ec4899); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px;">Run My Ghost Check</a>
      <p style="color: #52525b; font-size: 12px; margin-top: 24px;">You're receiving this because you're on the Healing Mode plan. <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="color: #f43f5e;">Manage subscription</a></p>
    </div>`,
  })
}

export async function sendMagicLinkEmail(
  email: string,
  url: string
): Promise<void> {
  await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Your BreakupBox sign-in link 🔗',
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #fff; padding: 40px; border-radius: 16px;">
      <h1 style="color: #f43f5e;">Sign in to BreakupBox 💔</h1>
      <p>Click the button below to sign in. This link expires in 24 hours.</p>
      <a href="${url}" style="display: inline-block; background: linear-gradient(to right, #f43f5e, #ec4899); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px;">Sign In</a>
      <p style="color: #52525b; font-size: 12px; margin-top: 24px;">If you didn't request this, you can safely ignore this email.</p>
    </div>`,
  })
}
