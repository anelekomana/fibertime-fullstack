import "./styles.css";
import { AppProvider } from "../context/AppContext";
import ClientRouterProvider from "../components/client-router-provider";

export const metadata = {
  title: "Fibertime",
  description: "Fibertime TV Pairing Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <ClientRouterProvider>{children}</ClientRouterProvider>
        </AppProvider>
      </body>
    </html>
  );
}
