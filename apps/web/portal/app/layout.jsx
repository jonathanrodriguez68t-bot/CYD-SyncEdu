import '../css/styles.css';

export const metadata = {
  title: 'CYD SyncEdu - Portal',
  description: 'Prototipo del portal académico y asistente inteligente SyncIA.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
