import { instanceUnprotected } from "@/services/instance";
import { z } from "zod";

export const authService = {
    signinOidc: async (authCode: string) => {
        const login = await instanceUnprotected.post(
            'auth/signin-oidc',
            {
                method: 'POST',
                body: JSON.stringify({
                    code: authCode,
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            }).json();

        return z.object({ 
            access_token: z.string(),
            user_name: z.string(),
            email: z.string(),
            display_name: z.string()
        }).parse(login);
    }
}