import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(request) {
  const { username, password } = await request.json();

  const validUsername = process.env.LOGIN_USERNAME;
  const validPassword = process.env.PASSWORD;

  if (username === validUsername && password === validPassword) {
    // Sign token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = 'HS256'
    const token = await new SignJWT({ 'urn:example:claim': true })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer('urn:example:issuer')
    .setAudience('urn:example:audience')
    .setExpirationTime('30d')
    .sign(secret)

    const response = NextResponse.json({ success: true });
    // Set cookie to persist login state.  Use __Secure- prefix.
    response.cookies.set({
        name: 'loggedIn',
        value: 'true',
        httpOnly: true,
        secure: true, // Ensures cookie is only sent over HTTPS
        sameSite: 'strict', // Mitigates CSRF attacks
        path: '/', // Makes the cookie available to the entire site
        maxAge: 60 * 60 * 24 * 30,
      });
      response.cookies.set({
        name: 'jwt',
        value: token,
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 2,
      });

    return response;
  } else {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
}
