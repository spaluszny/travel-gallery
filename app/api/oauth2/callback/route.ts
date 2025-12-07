import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import oauth2Client from "@/utils/google-auth";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
        return NextResponse.json({ error: 'Google OAuth Error: ' + error });
    }
    if (!code) {
        return NextResponse.json({ error: 'Authorization Cannot Be Found' });
    }

    try {
        const { tokens } = await oauth2Client.getToken(code)
        console.log(tokens)

            ; (await cookies()).set({
                name: 'google_access_token',
                value: tokens.access_token || '',  // the access token
                httpOnly: true,  // for security, the cookie is accessible only by the server
                secure: process.env.NODE_ENV === 'production',  // send cookie over HTTPS only in production
                path: '/',  // cookie is available on every route
                maxAge: 60 * 60 * 24 * 7,  // 1 week
            });

        if (tokens.refresh_token) {
            (await cookies()).set({
                name: 'google_refresh_token',
                value: tokens.refresh_token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                maxAge: 60 * 60 * 24 * 30,
            })
        }

        return NextResponse.redirect(new URL("/dashboard", req.url))
    } catch (error) {
        return NextResponse.json({ error: 'Google OAuth Error failed to exchange code: ' + error });
    }
}