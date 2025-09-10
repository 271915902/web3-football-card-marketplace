import React, { ReactNode } from "react";
import Header from "@/components/home/Header";

function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}

export default RootLayout;
