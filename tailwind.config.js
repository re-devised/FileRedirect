module.exports = {
  purge: {
	enabled: false,
	//content: [
	//'./components/**/*.{vue,js}',
    	//'./layouts/**/*.vue',
    	//'./pages/**/*.vue',
	//]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#606EAF',
          200: '#454778'
        },
        secondary: {
          100: '#E2E2D5',
          200: '#888883'
        },
        accent1: {
          100: '#86EBB6',
          200: '#57E39A',
          300: '#53DB94'
          // 200: '#2ec4b6'
        },
        accent2: '#66CBFF',
        warning: '#ff7b00',
        background: '#1A1A1A'
      },
      fontFamily: {
        body: ['Nunito'],
        bebas: ['Bebas Neue']
      },
      keyframes: {
        slide: {
          '0%': { transform: 'translateX(0)'},
          '50%': { transform: 'translateX(40px)'},
          '100%': { transform: 'translateX(0)'}
        }
      },
      animation: {
        'slide': 'slide 0.5s linear'
      }
    },
  },
  variants: {
    opacity: ({ after }) => after(['disabled']),
    extend: {},
  },
  plugins: [],
}
