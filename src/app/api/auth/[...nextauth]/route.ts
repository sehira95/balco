import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import { User } from '@/models/User'

// Mock users for authentication fallback
const mockUsers = [
  {
    _id: '1',
    email: 'admin@balco.com',
    name: 'Admin User',
    password: '$2b$12$dRZYNyXNV728t.kE9Y6i1eux.rRKnNndKekimoOrTOUXsEBPgtM6K', // admin123
    role: 'admin'
  },
  {
    _id: '2', 
    email: 'user@balco.com',
    name: 'Standard User',
    password: '$2b$12$2CxbQ9x1PZigAdtkF91UGeHCJxEPAidhwOqVYODetvKJuR/VQq6Z6', // user123
    role: 'user'
  }
]

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          await connectDB()
          
          // Try to find user in database
          const user = await User.findOne({ email: credentials.email })

          if (user) {
            const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
            if (isPasswordValid) {
              return {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
              }
            }
          }

          return null
        } catch (error) {
          console.error('Auth error:', error)
          
          // Fallback to mock users if database fails
          const mockUser = mockUsers.find(user => user.email === credentials.email)
          
          if (mockUser) {
            const isPasswordValid = await bcrypt.compare(credentials.password, mockUser.password)
            
            if (isPasswordValid) {
              return {
                id: mockUser._id,
                email: mockUser.email,
                name: mockUser.name,
                role: mockUser.role,
              }
            }
          }

          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
