
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DictionarySearchBackend from "@/components/DictionarySearchBackend";

export default function DictionaryPageBackend() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container-custom">
          <DictionarySearchBackend />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
