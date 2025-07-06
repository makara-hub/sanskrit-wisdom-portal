
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TextsLibraryBackend from "@/components/TextsLibraryBackend";

export default function TextsPageBackend() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container-custom">
          <TextsLibraryBackend />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
