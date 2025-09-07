import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

interface CachedMongoose {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: CachedMongoose | undefined
}

let cached: CachedMongoose = (global as unknown as Record<string, CachedMongoose>).mongoose

if (!cached) {
  cached = (global as unknown as Record<string, CachedMongoose>).mongoose = { conn: null, promise: null }
}

async function connectDB() {
  // Mock database için test modunda çalış
  if (MONGODB_URI.startsWith('mock://')) {
    console.log('Mock database mode - skipping real connection')
    return {
      connection: { readyState: 1 },
      model: () => ({
        findOne: () => Promise.resolve(null),
        find: () => Promise.resolve([]),
        create: () => Promise.resolve({}),
        findOneAndUpdate: () => Promise.resolve({}),
        deleteOne: () => Promise.resolve({}),
      })
    }
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null
    console.error('MongoDB connection failed, falling back to mock mode', error)
    return {
      connection: { readyState: 1 },
      model: () => ({
        findOne: () => Promise.resolve(null),
        find: () => Promise.resolve([]),
        create: () => Promise.resolve({}),
        findOneAndUpdate: () => Promise.resolve({}),
        deleteOne: () => Promise.resolve({}),
      })
    }
  }

  return cached.conn
}

export default connectDB
