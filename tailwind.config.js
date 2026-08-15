export default {
  content: ['./index.html', './assets/app.js'],
  theme: {
    extend: {
      colors: {
        bg: '#FFF7F0',
        'bg-pink': '#FFF1F5',
        primary: '#FF8FAB',
        secondary: '#B388EB',
        text: '#3A2E39',
        accent: '#FFD6E0',
        btn: '#A61E4D',
        'btn-press': '#86183F',
        card: '#FFFFFF',
        'text-soft': '#6E5C6B',
        line: '#F2DDE3',
        star: '#FFE7B0'
      },
      fontFamily: {
        head: ['"Baloo 2"', 'Trebuchet MS', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', '-apple-system', 'sans-serif'],
        hand: ['"Patrick Hand"', '"Comic Sans MS"', 'cursive']
      },
      borderRadius: { xl: '30px', lg: '22px', md: '14px' }
    }
  },
  plugins: []
};
