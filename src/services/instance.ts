import { getCookie } from "@/utils/Utils";
import ky from "ky";

const prefixUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/`;

export const instance = ky.extend({
    headers: {
        Accept: 'application/json',
        Authorization: 'Bearer '.concat(getCookie("access_token")),
        "X-ID-TOKEN": getCookie("idToken")
    },
    prefixUrl
});

export const instanceUnprotected = ky.extend({
    headers: {
        Accept: 'application/json',
    },
    prefixUrl
});