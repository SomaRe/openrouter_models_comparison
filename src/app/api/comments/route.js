import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { modelId, comment } = await request.json()
    
    // Check if comment exists for this model
    const existingComment = await prisma.comment.findUnique({
      where: { modelId }
    })
    
    const newComment = existingComment 
      ? await prisma.comment.update({
          where: { modelId },
          data: { comments: comment }
        })
      : await prisma.comment.create({
          data: {
            modelId,
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
    // Convert to a map for easier lookup
    const commentMap = comments.reduce((map, comment) => {
      map[comment.modelId] = comment.comments
      return map
    }, {})
    return Response.json(commentMap)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
