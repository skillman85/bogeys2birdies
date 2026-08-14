import './globals.css';

export const metadata = {
  title: 'Bogeys2Birdies | Real Golf. Real Progress.',
  description: 'An honest club golfer’s pursuit of better golf — experiments, data, gear and the road to a lower handicap.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
