import { useMutation } from "@tanstack/react-query";
import { authService } from "./authService";

const useSigninOidcMutation = (authCode: string) =>
    useMutation({
        mutationKey: ["SIGN_IN_OIDC"],
        mutationFn: async () => authService.signinOidc(authCode),
    });
    
export const useAuth = () => {
    return {
        useSigninOidcMutation
    }
}