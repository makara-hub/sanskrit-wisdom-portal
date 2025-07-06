
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserHistory from "@/components/UserHistory";

export default function HistoryPageBackend() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container-custom">
          <UserHistory />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
