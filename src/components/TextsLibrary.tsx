
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, BookOpen } from "lucide-react";

// Expanded collection of Sanskrit texts
const texts = [
  {
    id: "bhagavad-gita",
    title: "Bhagavad Gita",
    category: "Philosophy",
    description: "The sacred dialogue between Krishna and Arjuna, offering guidance on ethics, duty and spiritual wisdom.",
    chapters: 18,
    verses: 700,
    image: "/placeholder.svg"
  },
  {
    id: "ramayana",
    title: "Ramayana",
    category: "Epic",
    description: "The epic tale of Prince Rama's journey, exemplifying duty, courage, and righteousness.",
    chapters: 7,
    verses: 24000,
    image: "/placeholder.svg"
  },
  {
    id: "mahabharata",
    title: "Mahabharata",
    category: "Epic",
    description: "One of the two major Sanskrit epics of ancient India, the other being the Ramayana.",
    chapters: 18,
    verses: 100000,
    image: "/placeholder.svg"
  },
  {
    id: "upanishads",
    title: "Upanishads",
    category: "Philosophy",
    description: "Philosophical texts exploring concepts of reality, consciousness, and the nature of existence.",
    chapters: 108,
    verses: 10000,
    image: "/placeholder.svg"
  },
  {
    id: "vedas",
    title: "Vedas",
    category: "Scripture",
    description: "The oldest scriptures of Hinduism, containing hymns, philosophy, and guidance.",
    chapters: 4,
    verses: 20000,
    image: "/placeholder.svg"
  },
  {
    id: "puranas",
    title: "Puranas",
    category: "Mythology",
    description: "Ancient texts that encompass mythology, legends, and other traditional lore.",
    chapters: 18,
    verses: 400000,
    image: "/placeholder.svg"
  },
  {
    id: "arthashastra",
    title: "Arthashastra",
    category: "Economics & Politics",
    description: "An ancient Indian treatise on statecraft, economic policy, and military strategy.",
    chapters: 15,
    verses: 6000,
    image: "/placeholder.svg"
  },
  {
    id: "manusmriti",
    title: "Manusmriti",
    category: "Law",
    description: "An ancient legal text and constitution among the many Dharmaśāstras of Hinduism.",
    chapters: 12,
    verses: 2600,
    image: "/placeholder.svg"
  },
  {
    id: "yoga-sutras",
    title: "Yoga Sutras of Patanjali",
    category: "Philosophy",
    description: "Foundational text of yoga philosophy, outlining the eight limbs of yoga practice.",
    chapters: 4,
    verses: 196,
    image: "/placeholder.svg"
  },
  {
    id: "brahma-sutras",
    title: "Brahma Sutras",
    category: "Philosophy",
    description: "Systematic philosophical treatise on the nature of Brahman and ultimate reality.",
    chapters: 4,
    verses: 555,
    image: "/placeholder.svg"
  },
  {
    id: "shiva-purana",
    title: "Shiva Purana",
    category: "Mythology",
    description: "Sacred text dedicated to Lord Shiva, containing stories, hymns, and philosophical teachings.",
    chapters: 7,
    verses: 24000,
    image: "/placeholder.svg"
  },
  {
    id: "vishnu-purana",
    title: "Vishnu Purana",
    category: "Mythology",
    description: "One of the eighteen major Puranas, focusing on Lord Vishnu and his avatars.",
    chapters: 6,
    verses: 7000,
    image: "/placeholder.svg"
  },
  {
    id: "devi-mahatmya",
    title: "Devi Mahatmya",
    category: "Scripture",
    description: "Sacred text celebrating the Divine Mother, also known as Chandi or Durga Saptashati.",
    chapters: 13,
    verses: 700,
    image: "/placeholder.svg"
  },
  {
    id: "katha-upanishad",
    title: "Katha Upanishad",
    category: "Philosophy",
    description: "Upanishad containing the dialogue between Nachiketa and Death, exploring life's deeper meanings.",
    chapters: 2,
    verses: 119,
    image: "/placeholder.svg"
  },
  {
    id: "mandukya-upanishad",
    title: "Mandukya Upanishad",
    category: "Philosophy",
    description: "Shortest of the major Upanishads, exploring the nature of consciousness and reality.",
    chapters: 1,
    verses: 12,
    image: "/placeholder.svg"
  },
  {
    id: "bhagavata-purana",
    title: "Bhagavata Purana",
    category: "Mythology",
    description: "One of the most popular Puranas, focusing on the life and teachings of Krishna.",
    chapters: 12,
    verses: 18000,
    image: "/placeholder.svg"
  },
  {
    id: "hanuman-chalisa",
    title: "Hanuman Chalisa",
    category: "Devotional",
    description: "Forty-verse hymn in praise of Lord Hanuman, composed by Tulsidas.",
    chapters: 1,
    verses: 40,
    image: "/placeholder.svg"
  },
  {
    id: "sundara-kanda",
    title: "Sundara Kanda",
    category: "Epic",
    description: "Fifth book of the Ramayana, focusing on Hanuman's journey to Lanka.",
    chapters: 1,
    verses: 2885,
    image: "/placeholder.svg"
  },
  {
    id: "gayatri-mantra",
    title: "Gayatri Mantra",
    category: "Scripture",
    description: "Most sacred mantra in Hinduism, invoking the divine light of universal consciousness.",
    chapters: 1,
    verses: 1,
    image: "/placeholder.svg"
  },
  {
    id: "ishavasyopanishad",
    title: "Isha Upanishad",
    category: "Philosophy",
    description: "Opening Upanishad of the Shukla Yajurveda, exploring the unity of existence.",
    chapters: 1,
    verses: 18,
    image: "/placeholder.svg"
  },
  {
    id: "ashtavakra-gita",
    title: "Ashtavakra Gita",
    category: "Philosophy",
    description: "Dialogue between sage Ashtavakra and King Janaka on the nature of self and reality.",
    chapters: 20,
    verses: 298,
    image: "/placeholder.svg"
  },
  {
    id: "bhaja-govindam",
    title: "Bhaja Govindam",
    category: "Devotional",
    description: "Composition by Adi Shankaracharya emphasizing devotion over mere intellectual learning.",
    chapters: 1,
    verses: 31,
    image: "/placeholder.svg"
  },
  {
    id: "viveka-chudamani",
    title: "Viveka Chudamani",
    category: "Philosophy",
    description: "Major work by Adi Shankaracharya on the discrimination between the real and unreal.",
    chapters: 1,
    verses: 580,
    image: "/placeholder.svg"
  },
  {
    id: "panchadashi",
    title: "Panchadashi",
    category: "Philosophy",
    description: "Advaita Vedanta text by Vidyaranya, explaining the nature of consciousness and reality.",
    chapters: 15,
    verses: 1500,
    image: "/placeholder.svg"
  }
];

// Updated categories to include new ones
const categories = [
  "All",
  "Epic",
  "Philosophy",
  "Scripture",
  "Mythology",
  "Law",
  "Economics & Politics",
  "Devotional"
];

export default function TextsLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("browse");

  // Filter texts based on search query and active category
  const filteredTexts = texts.filter(text => {
    const matchesSearch = text.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          text.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || text.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-2xl font-medium mb-6">Sanskrit Texts Library</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="browse">Browse Texts</TabsTrigger>
          <TabsTrigger value="search">Search Verses</TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative flex-1">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for texts..."
                  className="pr-10"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  <Search className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className={activeCategory === category ? "bg-saffron hover:bg-saffron/90" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTexts.map(text => (
                <Link key={text.id} to={`/texts/${text.id}`} className="block">
                  <Card className="overflow-hidden h-full card-hover">
                    <img 
                      src={text.image} 
                      alt={text.title} 
                      className="w-full h-40 object-cover" 
                    />
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium">{text.title}</h3>
                        <span className="bg-cream text-saffron text-xs px-2 py-1 rounded-full">{text.category}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{text.description}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{text.chapters} Chapters</span>
                        <span>{text.verses.toLocaleString()} Verses</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="search">
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Cross-Text Verse Search</h3>
            <p className="text-gray-600 mb-6">
              Search for specific verses or topics across all Sanskrit texts.
              This feature is coming soon.
            </p>
            <Button disabled className="bg-gray-300">Coming Soon</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
