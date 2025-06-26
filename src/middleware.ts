import { NextRequest, NextResponse } from "next/server";
import { generateNonce } from "./utils/Utils";

// Apply middleware to only to this routes
export const config = { matcher: "/:path*" };

export async function middleware(req: NextRequest) {
    const AUTH_URL = "https://login-v3.qa.idaman.pertamina.com/connect/authorize?";
    const CLIENT_ID = "a9d5192f2d854b86b8c11ec5715c5f35";
    const REDIRECT_URI = "https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--3000--cb7c0bca.local-credentialless.webcontainer-api.io/authentication";
    const accessToken = req.cookies.get("access_token")?.value;
    const { pathname } = req.nextUrl
    // const refreshToken = req.cookies.get("refresh_token")?.value;

    // Check if user is not logged
    if (!accessToken) {
        try {
            if (pathname === '/' 
                || pathname === '/vessel-performance' 
                || pathname === '/vessel-comparison' 
                || pathname === '/bunker-performance' 
                || pathname === '/planning-simulation' 
                || pathname === '/schedule-realization'
            ) {
                const params = new URLSearchParams();
                params.append("client_id", CLIENT_ID);
                params.append("redirect_uri", REDIRECT_URI);
                params.append("response_type", "code");
                params.append("nonce", generateNonce());
                params.append("scope", "openid profile email");

                const redirectResponse = NextResponse.redirect(AUTH_URL.concat(params.toString()));
                redirectResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
                redirectResponse.headers.set('Pragma', 'no-cache');
                redirectResponse.headers.set('Expires', '0');

                return redirectResponse;
                
            }
        } catch (error) {
            console.log("error from middleware: ", error);
        }
    } else {
        // Verify if token is valid
        const verifyTokenResponse = await fetch("https://smartbunker-pis.southeastasia.cloudapp.azure.com/api/segment/search/all", {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    
        // if UNAUTHORIZED
        if (verifyTokenResponse.status === 401) {
            // try refreshing the token
            // if (refreshToken) {
            //     const refreshResponse = await fetch(req.nextUrl.origin + "/api/auth/refresh", {
            //         method: "POST",
            //         headers: { Cookie: `refresh_token=${refreshToken}` },
            //     });

            //     if (refreshResponse.ok) {
            //         const newToken = await refreshResponse.json();
            //         const response = NextResponse.next();
            //         response.cookies.set("access_token", newToken.access_token, { httpOnly: true });
            //         return response;
            //     }
            // }

            // If refresh fails,
            // Clear cookies and Try redirect to login page
            const params = new URLSearchParams();
            params.append("client_id", "a9d5192f2d854b86b8c11ec5715c5f35");
            params.append("redirect_uri", "https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--3000--cb7c0bca.local-credentialless.webcontainer-api.io/authentication");
            params.append("response_type", "code");
            params.append("nonce", generateNonce());
            params.append("scope", "openid profile email");

            const redirectResponse = NextResponse.redirect("https://login-v3.qa.idaman.pertamina.com/connect/authorize?".concat(params.toString()));
            redirectResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
            redirectResponse.headers.set('Pragma', 'no-cache');
            redirectResponse.headers.set('Expires', '0');
            redirectResponse.cookies.set('access_token', '');
            redirectResponse.cookies.set('idToken', '');

            return redirectResponse;
        } else return NextResponse.next();
    }
}