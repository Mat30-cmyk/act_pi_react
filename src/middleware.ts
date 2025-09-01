import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: [
    '/inicio(.*)',
    '/perfil(.*)',
    '/biblioteca(.*)',
  ],
}