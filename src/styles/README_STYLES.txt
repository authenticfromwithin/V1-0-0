AFW — Fonts & Global Styles

1) Put your licensed .woff2 files into:
   public/assets/fonts/ui/Inter-Variable.woff2
   public/assets/fonts/sans/Inter-Variable.woff2
   public/assets/fonts/serif/CrimsonPro-Variable.woff2

2) Ensure the app imports styles once:
   import './styles';   // in src/index.tsx or src/App.tsx

3) Theme toggle:
   document.documentElement.setAttribute('data-theme','forest'); // or ocean|mountain|autumn|snow
