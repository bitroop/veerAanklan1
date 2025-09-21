import "./globals.css";
import Header from "../components/Header";
import { LanguageProvider } from "../components/LanguageContext";

export const metadata = {
  title: "Veerआकलान",
  description: "AI for Every Athlete, Everywhere",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <LanguageProvider>
          <Header />
          <div className="pt-20">{children}</div>
        </LanguageProvider>
      </body>
    </html>
  );
}
