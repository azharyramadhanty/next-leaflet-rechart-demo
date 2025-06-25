import Skeleton from "@/components/Skeleton";
import { useAuth } from "@/hooks/auth/useAuth";
import { saveCookie } from "@/utils/Utils";
import { useEffect, useState } from "react";

const Authentication = () => {
  const { useSigninOidcMutation } = useAuth();  
  const [authCode, setAuthCode] = useState<string>(null);
  const signInQuery = useSigninOidcMutation(authCode);

  const handleSignIn = () => {
    signInQuery.mutateAsync()
      .then(it => {
        saveCookie("access_token", it.access_token);
        saveCookie("name", it.display_name);
        setTimeout(() => window.location.replace("/"), 3000);
      })
      .catch(error => {
        alert("error authentication: "+ error);
        window.location.replace("/");
      });
  }

  useEffect(() => {
    // const urlHash = window.location.hash;
    // const urlParams = new URLSearchParams(urlHash.replace("#", "?"));
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get("code")) setAuthCode(urlParams.get("code").trim());
    if (urlParams.get("session_state")) saveCookie("sessionId", urlParams.get("session_state").trim());

    if (authCode) handleSignIn();

  }, [authCode]);

  return (
    <div className="relative flex flex-1 flex-col overflow-auto">
      <div className="flex flex-row h-screen gap-40 justify-center items-center">
        <Skeleton />
        <Skeleton />
      </div>
    </div>
  );
}

export default Authentication;
