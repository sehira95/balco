import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Color } from '@/models/Color'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { name, hexCode } = await request.json()

    const color = await Color.create({
      name,
      hexCode
    })

    return NextResponse.json(
      { message: 'Renk başarıyla oluşturuldu', color },
      { status: 201 }
    )
  } catch (error) {
    console.error('Color error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectDB()
    
    const colors = await Color.find().sort({ name: 1 })
    
    return NextResponse.json({ colors })
  } catch (error) {
    console.error('Get colors error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
