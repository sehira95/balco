import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import { User } from '@/models/User'

export async function POST(request: Request) {
  try {
    const { name, email, password, role, department } = await request.json()

    if (!name || !email || !password) {
      return Response.json({ error: 'Gerekli alanlar eksik' }, { status: 400 })
    }

    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return Response.json({ error: 'Bu email adresi zaten kullanılıyor' }, { status: 400 })
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

    // Create user in database
    const user = await User.create(newUser)

    return Response.json({ 
      message: 'Kullanıcı başarıyla oluşturuldu',
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role }
    })

  } catch (error) {
    console.error('User creation error:', error)
    return Response.json({ error: 'Kullanıcı oluşturulurken hata oluştu' }, { status: 500 })
  }
}
