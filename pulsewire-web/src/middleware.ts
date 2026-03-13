import { NextRequest, NextResponse } from 'next/server'

const SUPPORTED_LANGS = ['de', 'fr']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only redirect on root path, and only if no lang already chosen
  if (pathname !== '/') return NextResponse.next()

  // Don't redirect if user has a language cookie (manual selection)
  const langCookie = request.cookies.get('preferred-lang')?.value
  if (langCookie && SUPPORTED_LANGS.includes(langCookie)) {
    return NextResponse.redirect(new URL(`/${langCookie}`, request.url))
  }

  // Check Accept-Language header
  const acceptLang = request.headers.get('accept-language') || ''
  const primary = acceptLang.split(',')[0].split('-')[0].toLowerCase()

  if (SUPPORTED_LANGS.includes(primary)) {
    return NextResponse.redirect(new URL(`/${primary}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/',
}
