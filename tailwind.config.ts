import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#e0c482",
          secondary: "#4b4eaa",
          accent: "#d872a7",
          neutral: "#2c2833",
          "base-100": "#ece9ec",
          info: "#7c91ee",
          success: "#76ead1",
          warning: "#a15c08",
          error: "#dd3c6f",
          body: {
            "background-color": "#e23ea2",
          }
        },
      },
    ],
  },
}
export default config
