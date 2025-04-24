
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Translate, BookOpen, Search, History } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden mandala-bg">
          <div className="container-custom text-center max-w-4xl">
            <h1 className="text-3xl md:text-5xl font-bold text-darkText mb-6">
              Discover the Wisdom of <span className="text-saffron">Sanskrit</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Explore ancient texts, translate between Sanskrit and English,
              and dive into the rich cultural heritage of Sanskrit literature.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/translate">
                <Button className="bg-saffron hover:bg-saffron/90 text-white px-6 py-6 h-auto text-lg w-full sm:w-auto">
                  <Translate className="mr-2 h-5 w-5" /> Start Translating
                </Button>
              </Link>
              <Link to="/texts">
                <Button variant="outline" className="border-royalBlue text-royalBlue hover:bg-royalBlue hover:text-white px-6 py-6 h-auto text-lg w-full sm:w-auto">
                  <BookOpen className="mr-2 h-5 w-5" /> Browse Texts
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <h2 className="section-title text-center mb-12">Explore Our Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon={<Translate />} 
                title="Sanskrit Translation" 
                description="Translate between Sanskrit and English with our intuitive translation tool."
                link="/translate"
              />
              <FeatureCard 
                icon={<Search />} 
                title="Sanskrit Dictionary" 
                description="Look up Sanskrit words, their meanings, and usage examples."
                link="/dictionary"
              />
              <FeatureCard 
                icon={<BookOpen />} 
                title="Classical Texts" 
                description="Explore ancient Sanskrit texts including Ramayana, Mahabharata, Vedas and more."
                link="/texts"
              />
              <FeatureCard 
                icon={<History />} 
                title="Learning Resources" 
                description="Learn Sanskrit grammar, common phrases, and pronunciation."
                link="/learning"
              />
            </div>
          </div>
        </section>

        {/* Featured Texts Section */}
        <section className="py-16 bg-cream">
          <div className="container-custom">
            <h2 className="section-title text-center mb-12">Featured Sanskrit Texts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TextCard 
                title="Bhagavad Gita" 
                description="The sacred dialogue between Krishna and Arjuna, offering guidance on ethics, duty and spiritual wisdom."
                image="/placeholder.svg"
                link="/texts/bhagavad-gita"
              />
              <TextCard 
                title="Ramayana" 
                description="The epic tale of Prince Rama's journey, exemplifying duty, courage, and righteousness."
                image="/placeholder.svg"
                link="/texts/ramayana"
              />
              <TextCard 
                title="Upanishads" 
                description="Philosophical texts exploring concepts of reality, consciousness, and the nature of existence."
                image="/placeholder.svg"
                link="/texts/upanishads"
              />
            </div>
            <div className="text-center mt-12">
              <Link to="/texts">
                <Button variant="outline" className="border-saffron text-saffron hover:bg-saffron hover:text-white">
                  View All Texts
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Dictionary Preview */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="section-title mb-6">Comprehensive Sanskrit Dictionary</h2>
                <p className="text-gray-600 mb-6">
                  Our Sanskrit dictionary provides detailed information on thousands of Sanskrit words, 
                  including definitions, grammatical information, and example usage from classical texts.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-saffron/20 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-saffron font-medium">✓</span>
                    </div>
                    <span>Search in Devanagari or transliterated text</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-saffron/20 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-saffron font-medium">✓</span>
                    </div>
                    <span>Audio pronunciations of Sanskrit words</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-saffron/20 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-saffron font-medium">✓</span>
                    </div>
                    <span>Example sentences from classical texts</span>
                  </li>
                </ul>
                <Link to="/dictionary">
                  <Button className="bg-royalBlue hover:bg-royalBlue/90 text-white">
                    Explore Dictionary
                  </Button>
                </Link>
              </div>
              <div className="bg-cream p-8 rounded-xl shadow-sm">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="mb-4 pb-4 border-b">
                    <h3 className="font-sanskrit text-xl font-medium text-darkText mb-1">धर्म</h3>
                    <p className="text-sm text-gray-500">dharma</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-900">Definition:</h4>
                      <p className="text-gray-700">
                        Righteous conduct, virtue, moral law, duty, religious merit
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-900">Example:</h4>
                      <p className="font-sanskrit text-gray-700 mb-1">
                        धर्मो रक्षति रक्षितः
                      </p>
                      <p className="text-sm text-gray-600 italic">
                        "Dharma protects those who protect it."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-royalBlue text-white py-16">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-6">Begin Your Sanskrit Journey Today</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Create an account to save your translations, bookmark favorite texts, and track your learning progress.
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-white text-royalBlue hover:bg-gray-100">
                Create Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, link }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string,
  link: string
}) => {
  return (
    <Link to={link} className="block">
      <div className="bg-white border rounded-xl p-6 h-full shadow-sm hover:shadow-md transition-shadow card-hover">
        <div className="h-12 w-12 bg-saffron/10 rounded-lg flex items-center justify-center mb-4 text-saffron">
          {icon}
        </div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </Link>
  );
};

// Text Card Component
const TextCard = ({ title, description, image, link }: {
  title: string,
  description: string,
  image: string,
  link: string
}) => {
  return (
    <Link to={link} className="block">
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm card-hover">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover" 
        />
        <div className="p-6">
          <h3 className="text-xl font-medium mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default Index;
