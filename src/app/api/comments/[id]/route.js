import { NextResponse } from 'next/server';
import { getComments, updateComments } from '@/lib/comments';

export async function GET(request, { params }) {
  try {
    const comments = await getComments();
    const comment = comments[params.id] || '';
    return NextResponse.json({ comment });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load comment' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { comment } = await request.json();
    const comments = await getComments();
    comments[params.id] = comment;
    await updateComments(comments);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}
