import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	// ✅ Safelist custom and conditionally used classes
	safelist: [
		"max-h-[100px]",
		"opacity-0",
		"opacity-100",
		"transition-all",
		"duration-300",
		"ease-in-out",
	],

	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				scaleFadeIn: {
					'0%': { transform: 'scale(0.5)', opacity: '0' },
					'60%': { transform: 'scale(1.1)', opacity: '0.7' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'error-expand': {
					'0%': { maxHeight: '0', opacity: '0' },
					'100%': { maxHeight: '100px', opacity: '1' },
				},
				'error-collapse': {
					'0%': { maxHeight: '100px', opacity: '1' },
					'100%': { maxHeight: '0', opacity: '0' },
				},
				shake: {
					'0%, 100%': { transform: 'translateX(0)' },
					'20%': { transform: 'translateX(-4px)' },
					'40%': { transform: 'translateX(4px)' },
					'60%': { transform: 'translateX(-4px)' },
					'80%': { transform: 'translateX(4px)' },
				},
			},
			
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'scale-fade-in': 'scaleFadeIn 300ms ease-out',
				'error-expand': 'error-expand 0.3s ease-out forwards',
				'error-collapse': 'error-collapse 0.2s ease-in forwards',
				shake: 'shake 0.6s ease-in-out',
			}
		}
	},
	
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
