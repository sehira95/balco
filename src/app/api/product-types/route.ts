import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { ProductType } from '@/models/ProductType'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { name, description } = await request.json()

    const productType = await ProductType.create({
      name,
      description
    })

    return NextResponse.json(
      { message: 'Ürün türü başarıyla oluşturuldu', productType },
      { status: 201 }
    )
  } catch (error) {
    console.error('Product type error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectDB()
    
    const productTypes = await ProductType.find().sort({ name: 1 })
    
    return NextResponse.json({ productTypes })
  } catch (error) {
    console.error('Get product types error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
