import { NextResponse } from 'next/server';
import { getComments, updateComments } from '@/lib/comments';

export async function GET(request) {
  try {
    const comments = await getComments();
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load comments' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const comments = await request.json();
    await updateComments(comments);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update comments' }, { status: 500 });
  }
}
