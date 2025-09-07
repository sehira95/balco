import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Auth token varken çalışacak middleware logic buraya
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*']
}
