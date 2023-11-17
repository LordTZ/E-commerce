import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prismaBase = globalForPrisma.prisma ?? prismaClientSingleton()

export const prisma = prismaBase.$extends({
  query: {
    cart: {
      async update({args, query}) {
        args.data = {...args.data, updatedAt: new Date() }
        return query(args)
      }
    }
  },
})

export default prismaBase

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaBase

// Path: src/lib/db/index.ts