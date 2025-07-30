"use client";

import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "../ui/ScrollToTop";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <ScrollToTop showAfterPx={400} animationDuration={1200} />
    </div>
  );
};

export default Layout;
