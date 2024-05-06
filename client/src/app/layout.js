import { Sixtyfour } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { ThemeProvider } from "@/theme/themeProvider";
import { Toaster } from "@/components/ui/sonner";
import Image from "next/image";
import backgroundImg from "@/assets/incoBg.jpg";
import CustomPrivyProvider from "@/wagmi/wagmiProvider";

const sixtyfour = Sixtyfour({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Slotmachine",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={sixtyfour.className}>
        <CustomPrivyProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            <Toaster />

            <div className="min-h-screen bg-black relative w-full overflow-hidden flex flex-col items-center justify-center">
              <Image
                alt="background-image"
                src={backgroundImg}
                className="h-screen w-screen absolute inset-0 bottom-0"
              />

              <div className="z-50 md:p-0 px-6 w-screen grid items-center justify-center gap-4 h-[100vh] relative">
                <div>{children}</div>
              </div>
            </div>
          </ThemeProvider>
        </CustomPrivyProvider>
      </body>
    </html>
  );
}
