import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { ProductionRecord } from '@/models/ProductionRecord'

export async function POST(request: NextRequest) {
  try {
    // Mock uygulamada session kontrolü devre dışı
    // const session = await getServerSession()
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    await connectDB()
    
    const { productType, color, quantity, date, shift, operator, notes, quality } = await request.json()

    const record = await ProductionRecord.create({
      productType,
      color,
      quantity,
      date,
      shift,
      operator,
      notes,
      quality,
      createdBy: 'system-user' // Mock kullanıcı ID'si
    })

    return NextResponse.json(
      { message: 'Üretim kaydı başarıyla oluşturuldu', record },
      { status: 201 }
    )
  } catch (error) {
    console.error('Production record error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const records = await ProductionRecord.find()
      .populate('productType')
      .populate('color')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await ProductionRecord.countDocuments()

    return NextResponse.json({
      records,
      total,
      page,
      pages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Get production records error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
