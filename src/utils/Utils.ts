import Cookies from 'js-cookie';
import { UserRoleType } from './enums/UserEnum';

export const saveCookie = (key, value, options = {}) => {
    Cookies.set(key, value, {
        expires: 2,
        secure: process.env.NODE_ENV === 'production',
        ...options,
    });
}

export const getCookie = (key) => {
    return Cookies.get(key);
}

export const formatCurrency = (num: number, currency?: string): string => {
    if (num < 1000) return `${currency ?? ''}${num}`;
    if (num < 1_000_000) return `${currency ?? ''}${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
    if (num < 1_000_000_000) return `${currency ?? ''}${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    return `${currency ?? ''}${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
};

export const toEpochSeconds = (date: Date): number => {
    return date && Math.floor(date.getTime() / 1000);
};

export const isoToEpochSeconds = (isoDate: string): number => {
    return Math.floor(new Date(isoDate).getTime() / 1000);
};

export const fromEpochSeconds = (epoch: number): Date => {
    return new Date(epoch * 1000);
};

export const getOS = (): string => {
    const userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['macOS', 'Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'];
    let os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'Windows';
    } else if (/Android/.test(userAgent)) {
        os = 'Android';
    } else if (/Linux/.test(platform)) {
        os = 'Linux';
    }

    return os;
}

export const parseToIntOrNull = (value: string | number | null): number | null => {
    if (typeof value === "string") {
        const parsed = parseInt(value, 10);
        return Number.isNaN(parsed) ? null : parsed;
    }
    return value;
};

export const changeFormatEnumValue = (value: string): string => {
    return value
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const roundUpTo2Decimals = (value: number): number => {
    return Math.ceil(value * 100) / 100;
};

export const formatSeparatorNumber = (value: any): string => {
    if (typeof value !== "number" || isNaN(value)) {
        return value;
    }

    const rounded = roundUpTo2Decimals(value);
    return rounded.toLocaleString('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

export const getElapsedTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} days ago`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} weeks ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;

    const years = Math.floor(days / 365);
    return `${years} years ago`;
}

export const toCamelCase = (str: string): string => {
    return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const convertStringToNumber = (value: any): number | null => {
    if (typeof value === 'string') {
      const trimmedValue = value.trim();
      if (trimmedValue === '' || trimmedValue === '-') {
        return 0;
      }
      const parsedNumber = parseFloat(trimmedValue);
      return isNaN(parsedNumber) ? 0 : parsedNumber;
    } else if (typeof value === 'number') {
      return value;
    } else {
      return 0;
    }
};

const isValueEmpty = (value: any): boolean => {
    if (value === null || value === 0 || value === "NaN" || Number.isNaN(value) || Array.isArray(value) && value.length === 0) return true
    
    if (typeof value === "object") return Object.values(value).every(isValueEmpty);

    return false;
};
  
export const checkedDataEmpty = (data: any): boolean => {
    return Object.values(data).every(isValueEmpty);
};

export const generateNonce = (): string => {
    const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._~';
    const result = [];
    crypto.getRandomValues(new Uint8Array(32)).forEach(chr => result.push(charset[chr % charset.length]));
    return result.join('');
}