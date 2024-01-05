/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	safelist: [
		{
			pattern: /bg-(red|green|blue|purple|gray)-700/
		},
		{ pattern: /text-(red|green|blue|purple|gray)-500/ },
		'line-through'
	],
	plugins: [require('daisyui')]
};
