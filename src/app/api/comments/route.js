import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { comment } = await request.json()
    const newComment = await prisma.comment.create({
      data: {
        comments: comment
      }
    })
    return Response.json(newComment)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const comments = await prisma.comment.findMany()
    return Response.json(comments)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
