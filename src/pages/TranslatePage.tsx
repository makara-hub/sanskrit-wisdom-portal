
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TranslationInterface from "@/components/TranslationInterface";

export default function TranslatePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container-custom">
          <TranslationInterface />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
