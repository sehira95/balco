import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import { User } from '@/models/User'

// Import tempUsers array from auth route
import { addTempUser } from '../auth/[...nextauth]/route'

export async function POST(request: Request) {
  try {
    const { name, email, password, role, department } = await request.json()

    if (!name || !email || !password) {
      return Response.json({ error: 'Gerekli alanlar eksik' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      department: department || 'Genel'
    }

    try {
      await connectDB()

      // Check if user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return Response.json({ error: 'Bu email adresi zaten kullanılıyor' }, { status: 400 })
      }

      // Create user in database
      const user = await User.create(newUser)

      return Response.json({ 
        message: 'Kullanıcı başarıyla oluşturuldu',
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      })
    } catch (error) {
      console.error('Database error:', error)
      
      // If database fails, create temp user with required fields
      const tempUser = {
        _id: Math.random().toString(36).substr(2, 9),
        ...newUser,
        createdAt: new Date().toISOString()
      }
      
      addTempUser(tempUser)
      
      return Response.json({ 
        message: 'Kullanıcı başarıyla oluşturuldu (geçici olarak)',
        user: { id: tempUser._id, name: tempUser.name, email: tempUser.email, role: tempUser.role }
      })
    }
  } catch (error) {
    console.error('User creation error:', error)
    return Response.json({ error: 'Kullanıcı oluşturulurken hata oluştu' }, { status: 500 })
  }
}
