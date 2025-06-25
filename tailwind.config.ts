import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'white-alpha-6': '#FFFFFF0F',
        success: "#00B843",
        'success-light': "#CCFFDF",
        warning: "#FF9B42",
        'warning-light': "#FFF0E5",
        danger: "#ED1B2F",
        'danger-light': "#FAE8EA"
      },
      backgroundImage: {
        'gradient-to-b': 'linear-gradient(to bottom, #cbddeb, #f6f8f9)',
        'card-gradient': 'linear-gradient(3.66deg, #654592 2.06%, #FF8652 97%)',
        'card-gradient-1': 'linear-gradient(3.66deg, #494E99 2.06%, #6AD6C0 97%)',
        'activity-gradient': 'conic-gradient(from 140.85deg at -16.31% -23.54%, #5CAFF4 -48.6deg, #04195F 7.2deg, #070A14 48.6deg, #5CAFF4 311.4deg, #04195F 367.2deg)',
        'gradient-blue' : 'conic-gradient(from 35.84deg at -6.25% 43.95%, #008FF5 -212.4deg, #66C0FF 18deg, #008FF5 147.6deg, #66C0FF 378deg)',
        'gradient-blue-1' : 'linear-gradient(180deg, #0868B9 0%, #044277 100%)',
        'gradient-blue-2' : 'linear-gradient(180deg, #2395F5 0%, #6DB8F8 100%)',
        'gradient-blue-3' : 'linear-gradient(214deg, #7BBDF5 11.73%, #C4E2FB 118.27%)',
        'card-accent-img' : "url('/assets/blue-rose-card.svg')",
        'card-accent-img-1' : "url('/assets/blue-rose-card.png')",
        'card-accent-img-wide' : "url('/assets/blue-rose-card-wide.svg')",
        'card-accent-img-red' : "url('/assets/red-rose-card.png')",
        'card-accent-img-red-1' : "url('/assets/red-rose-card.svg')",
        'card-accent-img-red-wide' : "url('/assets/red-rose-card-wide.svg')",
      },
      fontSize: {
        'xxs': '9px'
      },
      lineHeight: {
        'xxs': '11px'
      }
    },
  },
  plugins: [
    require("@tailwindcss/typography")
  ],
} satisfies Config;