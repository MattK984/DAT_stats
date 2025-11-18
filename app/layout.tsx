import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DAT Dashboard',
  description: 'Top digital asset treasuries dashboard'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <header className="mb-6">
            <h1 className="text-3xl font-bold">Digital Asset Treasury Dashboard</h1>
            <p className="text-sm text-slate-600">
              Monitor share and token prices, treasury value, NAV, and premiums for leading DATs.
            </p>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
