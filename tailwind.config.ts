import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        headline: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        label: ['Inter', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        "tertiary": "#3f412f",
        "surface-container": "#edeeef",
        "tertiary-fixed": "#e4e4cc",
        "on-tertiary-container": "#cdceb6",
        "surface-dim": "#d9dadb",
        "surface-container-low": "#f3f4f5",
        "on-secondary-fixed-variant": "#574500",
        "primary-fixed": "#90f8ad",
        "outline": "#6f7a6f",
        "on-surface-variant": "#3f4940",
        "secondary-fixed-dim": "#e9c349",
        "inverse-on-surface": "#f0f1f2",
        "on-tertiary": "#ffffff",
        "on-secondary": "#ffffff",
        "on-tertiary-fixed-variant": "#474836",
        "primary-container": "#006432",
        "on-primary-fixed": "#00210d",
        "on-tertiary-fixed": "#1b1d0e",
        "on-surface": "#191c1d",
        "primary-fixed-dim": "#74db93",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "surface": "#f8f9fa",
        "surface-bright": "#f8f9fa",
        "on-secondary-container": "#745c00",
        "surface-container-high": "#e7e8e9",
        "on-primary": "#ffffff",
        "on-secondary-fixed": "#241a00",
        "on-primary-container": "#7ae198",
        "on-background": "#191c1d",
        "tertiary-fixed-dim": "#c8c8b0",
        "outline-variant": "#bfc9bd",
        "surface-container-lowest": "#ffffff",
        "tertiary-container": "#565845",
        "on-primary-fixed-variant": "#005228",
        "secondary-fixed": "#ffe088",
        "error": "#ba1a1a",
        "surface-container-highest": "#e1e3e4",
        "surface-variant": "#e1e3e4",
        "surface-tint": "#006d37",
        "secondary-container": "#fed65b",
        "on-error-container": "#93000a",
        "inverse-primary": "#74db93",
        "inverse-surface": "#2e3132"
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
        full: "9999px",
        md: "1rem",
        sm: "0.5rem"
      },
      fontSize: {
        "label-md": "0.875rem"
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
