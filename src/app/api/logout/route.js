import { NextResponse } from 'next/server';

export async function POST(request) {
    const response = NextResponse.json({ success: true });
    response.cookies.delete('loggedIn');
    response.cookies.delete('jwt');
    return response;
}
