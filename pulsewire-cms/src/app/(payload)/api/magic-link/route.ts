import { getPayload } from 'payload'
import configPromise from '@payload-config'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

const MAGIC_LINK_EXPIRY_MS = 15 * 60 * 1000 // 15 minutes

// In-memory store — swap for Redis/DB in production
const tokenStore = new Map<string, { email: string; expiresAt: number }>()

/**
 * POST /api/magic-link
 * Body: { email: string }
 * Sends a magic link email to the user.
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    const normalizedEmail = email?.toLowerCase().trim()

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return Response.json({ error: 'Valid email required' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // Find or auto-create user
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: normalizedEmail } },
      limit: 1,
    })

    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: normalizedEmail,
          // Random password — user never uses password flow
          password: crypto.randomBytes(32).toString('hex'),
        },
      })
    }

    // One-time token
    const token = crypto.randomBytes(32).toString('hex')
    tokenStore.set(token, {
      email: normalizedEmail,
      expiresAt: Date.now() + MAGIC_LINK_EXPIRY_MS,
    })

    const verifyURL = `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3005'}/api/magic-link/verify?token=${token}`

    await payload.sendEmail({
      to: normalizedEmail,
      subject: '🔑 Sign in to PulseWire',
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#fff;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <div style="width:10px;height:10px;border-radius:50%;background:#E63946;flex-shrink:0;"></div>
            <span style="font-size:20px;font-weight:800;color:#0A0A0A;letter-spacing:-0.5px;">PulseWire</span>
          </div>
          <p style="color:#9CA3AF;font-size:12px;margin:0 0 32px;">Global News · Local Insight</p>

          <h1 style="font-size:22px;font-weight:700;color:#1D3557;margin:0 0 12px;">Your sign-in link</h1>
          <p style="color:#4B5563;font-size:15px;line-height:1.6;margin:0 0 28px;">
            Tap the button below to sign in instantly — no password needed.<br>
            This link expires in <strong>15 minutes</strong>.
          </p>

          <a href="${verifyURL}"
             style="display:inline-block;background:#E63946;color:#fff;font-weight:700;
                    font-size:15px;padding:14px 32px;border-radius:12px;text-decoration:none;letter-spacing:-0.2px;">
            Sign in to PulseWire →
          </a>

          <p style="color:#D1D5DB;font-size:12px;margin-top:32px;line-height:1.5;">
            If you didn't request this email, you can safely ignore it.<br>
            This link can only be used once.
          </p>
        </div>
      `,
    })

    return Response.json({ success: true })
  } catch (err) {
    console.error('[magic-link POST]', err)
    return Response.json({ error: 'Failed to send magic link' }, { status: 500 })
  }
}

/**
 * GET /api/magic-link/verify?token=xxx
 * Validates the token, returns a Payload JWT for the user.
 * Mobile app calls this after intercepting the deep link.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return Response.json({ error: 'Token required' }, { status: 400 })
    }

    const entry = tokenStore.get(token)
    if (!entry) {
      return Response.json({ error: 'Invalid or already used token' }, { status: 401 })
    }
    if (Date.now() > entry.expiresAt) {
      tokenStore.delete(token)
      return Response.json({ error: 'Token expired — request a new link' }, { status: 401 })
    }

    // Consume token (one-time use)
    tokenStore.delete(token)

    const payload = await getPayload({ config: configPromise })

    // Get user record
    const result = await payload.find({
      collection: 'users',
      where: { email: { equals: entry.email } },
      limit: 1,
    })

    if (result.totalDocs === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    const user = result.docs[0]

    // Mint a Payload-compatible JWT manually using the same secret
    const payloadSecret = process.env.PAYLOAD_SECRET!
    const jwtToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        collection: 'users',
      },
      payloadSecret,
      { expiresIn: '30d' }
    )

    return Response.json({
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        displayName: (user as any).displayName ?? null,
      },
    })
  } catch (err) {
    console.error('[magic-link GET]', err)
    return Response.json({ error: 'Verification failed' }, { status: 500 })
  }
}
