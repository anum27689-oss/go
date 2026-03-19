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
        'tertiary': 'hsl(var(--tertiary))',
        'surface-container': 'hsl(var(--surface-container))',
        'tertiary-fixed': 'hsl(var(--tertiary-fixed))',
        'on-tertiary-container': 'hsl(var(--on-tertiary-container))',
        'surface-dim': 'hsl(var(--surface-dim))',
        'surface-container-low': 'hsl(var(--surface-container-low))',
        'on-secondary-fixed-variant': 'hsl(var(--on-secondary-fixed-variant))',
        'primary-fixed': 'hsl(var(--primary-fixed))',
        'outline': 'hsl(var(--outline))',
        'on-surface-variant': 'hsl(var(--on-surface-variant))',
        'secondary-fixed-dim': 'hsl(var(--secondary-fixed-dim))',
        'inverse-on-surface': 'hsl(var(--inverse-on-surface))',
        'on-tertiary': 'hsl(var(--on-tertiary))',
        'on-secondary': 'hsl(var(--on-secondary))',
        'on-tertiary-fixed-variant': 'hsl(var(--on-tertiary-fixed-variant))',
        'primary-container': 'hsl(var(--primary-container))',
        'on-primary-fixed': 'hsl(var(--on-primary-fixed))',
        'on-tertiary-fixed': 'hsl(var(--on-tertiary-fixed))',
        'on-surface': 'hsl(var(--on-surface))',
        'primary-fixed-dim': 'hsl(var(--primary-fixed-dim))',
        'error-container': 'hsl(var(--error-container))',
        'on-error': 'hsl(var(--on-error))',
        'surface': 'hsl(var(--surface))',
        'surface-bright': 'hsl(var(--surface-bright))',
        'on-secondary-container': 'hsl(var(--on-secondary-container))',
        'on-primary': 'hsl(var(--on-primary))',
        'on-secondary-fixed': 'hsl(var(--on-secondary-fixed))',
        'on-primary-container': 'hsl(var(--on-primary-container))',
        'on-background': 'hsl(var(--on-background))',
        'tertiary-fixed-dim': 'hsl(var(--tertiary-fixed-dim))',
        'outline-variant': 'hsl(var(--outline-variant))',
        'surface-container-lowest': 'hsl(var(--surface-container-lowest))',
        'tertiary-container': 'hsl(var(--tertiary-container))',
        'on-primary-fixed-variant': 'hsl(var(--on-primary-fixed-variant))',
        'secondary-fixed': 'hsl(var(--secondary-fixed))',
        'error': 'hsl(var(--error))',
        'surface-container-highest': 'hsl(var(--surface-container-highest))',
        'surface-variant': 'hsl(var(--surface-variant))',
        'surface-tint': 'hsl(var(--surface-tint))',
        'secondary-container': 'hsl(var(--secondary-container))',
        'on-error-container': 'hsl(var(--on-error-container))',
        'inverse-primary': 'hsl(var(--inverse-primary))',
        'inverse-surface': 'hsl(var(--inverse-surface))',
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
