
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TextsLibrary from "@/components/TextsLibrary";

export default function TextsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container-custom">
          <TextsLibrary />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
