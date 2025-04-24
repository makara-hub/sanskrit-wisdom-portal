
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DictionarySearch from "@/components/DictionarySearch";

export default function DictionaryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container-custom">
          <DictionarySearch />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
