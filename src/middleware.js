import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) { // Mark as async
  const jwt = request.cookies.get('jwt')?.value;
  const path = request.nextUrl.pathname;

  if (path === '/login') {
    if (jwt) {
      try {
        // Verify JWT
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(jwt, secret);
        return NextResponse.redirect(new URL('/', request.url));
      } catch (error) {
        // JWT is invalid, proceed to login page
        return NextResponse.next();
      }
    }
    console.log("Middleware is running");
    return NextResponse.next();
  }

  if (!jwt) {
      console.log("Middleware - No JWT, redirect to login");
      return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(jwt, secret);
  } catch (error) {
      // JWT is invalid, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/'],
};
