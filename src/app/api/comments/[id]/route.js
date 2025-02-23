import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request, { params }) {
  try {
    const comment = await prisma.comment.findUnique({
      where: {
        modelId: params.id
      }
    })
    if (!comment) {
      return Response.json({ error: 'Comment not found' }, { status: 404 })
    }
    return Response.json(comment)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { comment } = await request.json()
    const updatedComment = await prisma.comment.update({
      where: { id: params.id },
      data: { comments: comment }
    })
    return Response.json(updatedComment)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.comment.delete({
      where: { id: params.id }
    })
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
