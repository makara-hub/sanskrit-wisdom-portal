import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

interface Text {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  chapters: number;
  verses: number;
  image_url: string;
}

// Expanded collection of classical Sanskrit texts
const fallbackTexts = [
  {
    id: "bhagavad-gita",
    slug: "bhagavad-gita",
    title: "Bhagavad Gita",
    category: "Philosophy",
    description: "The sacred dialogue between Krishna and Arjuna, offering guidance on ethics, duty and spiritual wisdom.",
    chapters: 18,
    verses: 700,
    image_url: "/placeholder.svg"
  },
  {
    id: "ramayana",
    slug: "ramayana",
    title: "Ramayana",
    category: "Epic",
    description: "The epic tale of Prince Rama's journey, exemplifying duty, courage, and righteousness.",
    chapters: 7,
    verses: 24000,
    image_url: "/placeholder.svg"
  },
  {
    id: "mahabharata",
    slug: "mahabharata",
    title: "Mahabharata",
    category: "Epic",
    description: "One of the two major Sanskrit epics of ancient India, the other being the Ramayana.",
    chapters: 18,
    verses: 100000,
    image_url: "/placeholder.svg"
  },
  {
    id: "upanishads",
    slug: "upanishads",
    title: "Upanishads",
    category: "Philosophy",
    description: "Philosophical texts exploring concepts of reality, consciousness, and the nature of existence.",
    chapters: 108,
    verses: 10000,
    image_url: "/placeholder.svg"
  },
  {
    id: "vedas",
    slug: "vedas",
    title: "Vedas",
    category: "Scripture",
    description: "The oldest scriptures of Hinduism, containing hymns, philosophy, and guidance.",
    chapters: 4,
    verses: 20000,
    image_url: "/placeholder.svg"
  },
  {
    id: "yoga-sutras",
    slug: "yoga-sutras",
    title: "Yoga Sutras of Patanjali",
    category: "Philosophy",
    description: "Foundational text of yoga philosophy, outlining the eight limbs of yoga practice.",
    chapters: 4,
    verses: 196,
    image_url: "/placeholder.svg"
  },
  // New additions - Puranas
  {
    id: "vishnu-purana",
    slug: "vishnu-purana",
    title: "Vishnu Purana",
    category: "Mythology",
    description: "One of the eighteen major Puranas, focusing on Lord Vishnu and his avatars.",
    chapters: 6,
    verses: 7000,
    image_url: "/placeholder.svg"
  },
  {
    id: "shiva-purana",
    slug: "shiva-purana",
    title: "Shiva Purana",
    category: "Mythology",
    description: "Sacred text dedicated to Lord Shiva, containing stories, hymns, and philosophical teachings.",
    chapters: 7,
    verses: 24000,
    image_url: "/placeholder.svg"
  },
  {
    id: "bhagavata-purana",
    slug: "bhagavata-purana",
    title: "Bhagavata Purana",
    category: "Mythology",
    description: "One of the most popular Puranas, focusing on the life and teachings of Krishna.",
    chapters: 12,
    verses: 18000,
    image_url: "/placeholder.svg"
  },
  {
    id: "devi-bhagavata-purana",
    slug: "devi-bhagavata-purana",
    title: "Devi Bhagavata Purana",
    category: "Mythology",
    description: "Purana dedicated to the Divine Mother, exploring her various forms and teachings.",
    chapters: 12,
    verses: 18000,
    image_url: "/placeholder.svg"
  },
  {
    id: "garuda-purana",
    slug: "garuda-purana",
    title: "Garuda Purana",
    category: "Mythology",
    description: "Sacred text focusing on death, afterlife, and the journey of the soul.",
    chapters: 2,
    verses: 19000,
    image_url: "/placeholder.svg"
  },
  {
    id: "skanda-purana",
    slug: "skanda-purana",
    title: "Skanda Purana",
    category: "Mythology",
    description: "Largest of the eighteen major Puranas, dedicated to Lord Skanda or Kartikeya.",
    chapters: 7,
    verses: 81000,
    image_url: "/placeholder.svg"
  },
  // Additional Upanishads
  {
    id: "katha-upanishad",
    slug: "katha-upanishad",
    title: "Katha Upanishad",
    category: "Philosophy",
    description: "Upanishad containing the dialogue between Nachiketa and Death, exploring life's deeper meanings.",
    chapters: 2,
    verses: 119,
    image_url: "/placeholder.svg"
  },
  {
    id: "mundaka-upanishad",
    slug: "mundaka-upanishad",
    title: "Mundaka Upanishad",
    category: "Philosophy",
    description: "Upanishad teaching the distinction between higher and lower knowledge.",
    chapters: 3,
    verses: 64,
    image_url: "/placeholder.svg"
  },
  {
    id: "mandukya-upanishad",
    slug: "mandukya-upanishad",
    title: "Mandukya Upanishad",
    category: "Philosophy",
    description: "Shortest of the major Upanishads, exploring the nature of consciousness and reality.",
    chapters: 1,
    verses: 12,
    image_url: "/placeholder.svg"
  },
  {
    id: "ishavasyopanishad",
    slug: "ishavasyopanishad",
    title: "Isha Upanishad",
    category: "Philosophy",
    description: "Opening Upanishad of the Shukla Yajurveda, exploring the unity of existence.",
    chapters: 1,
    verses: 18,
    image_url: "/placeholder.svg"
  },
  {
    id: "chandogya-upanishad",
    slug: "chandogya-upanishad",
    title: "Chandogya Upanishad",
    category: "Philosophy",
    description: "One of the oldest Upanishads, containing the famous teaching 'Tat tvam asi' (Thou art That).",
    chapters: 8,
    verses: 628,
    image_url: "/placeholder.svg"
  },
  {
    id: "brihadaranyaka-upanishad",
    slug: "brihadaranyaka-upanishad",
    title: "Brihadaranyaka Upanishad",
    category: "Philosophy",
    description: "The largest of the Upanishads, exploring the nature of the Self and ultimate reality.",
    chapters: 6,
    verses: 900,
    image_url: "/placeholder.svg"
  },
  // Classical Literature and Poetry
  {
    id: "raghuvamsha",
    slug: "raghuvamsha",
    title: "Raghuvamsha",
    category: "Literature",
    description: "Kalidasa's epic poem narrating the lineage of Raghu, including the story of Rama.",
    chapters: 19,
    verses: 1564,
    image_url: "/placeholder.svg"
  },
  {
    id: "kumarasambhava",
    slug: "kumarasambhava",
    title: "Kumarasambhava",
    category: "Literature",
    description: "Kalidasa's epic poem describing the birth of Kumara (Kartikeya), son of Shiva.",
    chapters: 17,
    verses: 953,
    image_url: "/placeholder.svg"
  },
  {
    id: "meghaduta",
    slug: "meghaduta",
    title: "Meghaduta",
    category: "Literature",
    description: "Kalidasa's lyrical poem where a yaksha sends a message to his beloved through a cloud.",
    chapters: 2,
    verses: 120,
    image_url: "/placeholder.svg"
  },
  {
    id: "abhijnana-shakuntalam",
    slug: "abhijnana-shakuntalam",
    title: "Abhijnana Shakuntalam",
    category: "Literature",
    description: "Kalidasa's famous drama about King Dushyanta and Shakuntala's love story.",
    chapters: 7,
    verses: 2000,
    image_url: "/placeholder.svg"
  },
  {
    id: "kiratarjuniya",
    slug: "kiratarjuniya",
    title: "Kiratarjuniya",
    category: "Literature",
    description: "Bharavi's epic poem about Arjuna's encounter with Shiva in the form of a hunter.",
    chapters: 18,
    verses: 1400,
    image_url: "/placeholder.svg"
  },
  {
    id: "shishupala-vadha",
    slug: "shishupala-vadha",
    title: "Shishupala Vadha",
    category: "Literature",
    description: "Magha's epic poem describing Krishna's slaying of Shishupala.",
    chapters: 22,
    verses: 1800,
    image_url: "/placeholder.svg"
  },
  // Devotional Texts
  {
    id: "hanuman-chalisa",
    slug: "hanuman-chalisa",
    title: "Hanuman Chalisa",
    category: "Devotional",
    description: "Forty-verse hymn in praise of Lord Hanuman, composed by Tulsidas.",
    chapters: 1,
    verses: 40,
    image_url: "/placeholder.svg"
  },
  {
    id: "devi-mahatmya",
    slug: "devi-mahatmya",
    title: "Devi Mahatmya",
    category: "Devotional",
    description: "Sacred text celebrating the Divine Mother, also known as Chandi or Durga Saptashati.",
    chapters: 13,
    verses: 700,
    image_url: "/placeholder.svg"
  },
  {
    id: "lalita-sahasranama",
    slug: "lalita-sahasranama",
    title: "Lalita Sahasranama",
    category: "Devotional",
    description: "Thousand names of Goddess Lalita, describing her divine attributes and powers.",
    chapters: 1,
    verses: 1000,
    image_url: "/placeholder.svg"
  },
  {
    id: "vishnu-sahasranama",
    slug: "vishnu-sahasranama",
    title: "Vishnu Sahasranama",
    category: "Devotional",
    description: "Thousand names of Lord Vishnu from the Mahabharata, describing his divine qualities.",
    chapters: 1,
    verses: 1000,
    image_url: "/placeholder.svg"
  },
  {
    id: "shiva-sahasranama",
    slug: "shiva-sahasranama",
    title: "Shiva Sahasranama",
    category: "Devotional",
    description: "Thousand names of Lord Shiva, celebrating his various forms and attributes.",
    chapters: 1,
    verses: 1000,
    image_url: "/placeholder.svg"
  },
  // Philosophy and Vedanta
  {
    id: "brahma-sutras",
    slug: "brahma-sutras",
    title: "Brahma Sutras",
    category: "Philosophy",
    description: "Systematic philosophical treatise on the nature of Brahman and ultimate reality.",
    chapters: 4,
    verses: 555,
    image_url: "/placeholder.svg"
  },
  {
    id: "ashtavakra-gita",
    slug: "ashtavakra-gita",
    title: "Ashtavakra Gita",
    category: "Philosophy",
    description: "Dialogue between sage Ashtavakra and King Janaka on the nature of self and reality.",
    chapters: 20,
    verses: 298,
    image_url: "/placeholder.svg"
  },
  {
    id: "bhaja-govindam",
    slug: "bhaja-govindam",
    title: "Bhaja Govindam",
    category: "Philosophy",
    description: "Composition by Adi Shankaracharya emphasizing devotion over mere intellectual learning.",
    chapters: 1,
    verses: 31,
    image_url: "/placeholder.svg"
  },
  {
    id: "viveka-chudamani",
    slug: "viveka-chudamani",
    title: "Viveka Chudamani",
    category: "Philosophy",
    description: "Major work by Adi Shankaracharya on the discrimination between the real and unreal.",
    chapters: 1,
    verses: 580,
    image_url: "/placeholder.svg"
  },
  {
    id: "panchadashi",
    slug: "panchadashi",
    title: "Panchadashi",
    category: "Philosophy",
    description: "Advaita Vedanta text by Vidyaranya, explaining the nature of consciousness and reality.",
    chapters: 15,
    verses: 1500,
    image_url: "/placeholder.svg"
  },
  // Dharma Shastras and Law
  {
    id: "manusmriti",
    slug: "manusmriti",
    title: "Manusmriti",
    category: "Law",
    description: "An ancient legal text and constitution among the many Dharmaśāstras of Hinduism.",
    chapters: 12,
    verses: 2600,
    image_url: "/placeholder.svg"
  },
  {
    id: "yajnavalkya-smriti",
    slug: "yajnavalkya-smriti",
    title: "Yajnavalkya Smriti",
    category: "Law",
    description: "Important dharma shastra text covering law, ethics, and social regulations.",
    chapters: 3,
    verses: 1010,
    image_url: "/placeholder.svg"
  },
  {
    id: "narada-smriti",
    slug: "narada-smriti",
    title: "Narada Smriti",
    category: "Law",
    description: "Ancient legal text focusing on judicial procedures and civil law.",
    chapters: 1,
    verses: 800,
    image_url: "/placeholder.svg"
  },
  // Economics and Politics
  {
    id: "arthashastra",
    slug: "arthashastra",
    title: "Arthashastra",
    category: "Economics & Politics",
    description: "An ancient Indian treatise on statecraft, economic policy, and military strategy.",
    chapters: 15,
    verses: 6000,
    image_url: "/placeholder.svg"
  },
  {
    id: "nitishastra",
    slug: "nitishastra",
    title: "Nitishastra",
    category: "Economics & Politics",
    description: "Collection of ethical and political maxims for good governance and righteous living.",
    chapters: 5,
    verses: 500,
    image_url: "/placeholder.svg"
  },
  // Ayurveda and Sciences
  {
    id: "charaka-samhita",
    slug: "charaka-samhita",
    title: "Charaka Samhita",
    category: "Science",
    description: "Foundational text of Ayurveda, covering principles of medicine and health.",
    chapters: 8,
    verses: 12000,
    image_url: "/placeholder.svg"
  },
  {
    id: "sushruta-samhita",
    slug: "sushruta-samhita",
    title: "Sushruta Samhita",
    category: "Science",
    description: "Ancient medical text focusing on surgery and surgical procedures in Ayurveda.",
    chapters: 6,
    verses: 5000,
    image_url: "/placeholder.svg"
  },
  // Tantric Texts
  {
    id: "kularnava-tantra",
    slug: "kularnava-tantra",
    title: "Kularnava Tantra",
    category: "Tantra",
    description: "Important tantric text dealing with spiritual practices and esoteric knowledge.",
    chapters: 17,
    verses: 2000,
    image_url: "/placeholder.svg"
  },
  {
    id: "mahanirvana-tantra",
    slug: "mahanirvana-tantra",
    title: "Mahanirvana Tantra",
    category: "Tantra",
    description: "Tantric text covering worship, meditation, and spiritual liberation practices.",
    chapters: 14,
    verses: 1500,
    image_url: "/placeholder.svg"
  },
  // Additional Mantras and Hymns
  {
    id: "gayatri-mantra",
    slug: "gayatri-mantra",
    title: "Gayatri Mantra",
    category: "Scripture",
    description: "Most sacred mantra in Hinduism, invoking the divine light of universal consciousness.",
    chapters: 1,
    verses: 1,
    image_url: "/placeholder.svg"
  },
  {
    id: "mahamrityunjaya-mantra",
    slug: "mahamrityunjaya-mantra",
    title: "Mahamrityunjaya Mantra",
    category: "Scripture",
    description: "Powerful mantra dedicated to Lord Shiva for healing and protection from death.",
    chapters: 1,
    verses: 1,
    image_url: "/placeholder.svg"
  },
  {
    id: "rudram-chamakam",
    slug: "rudram-chamakam",
    title: "Rudram Chamakam",
    category: "Scripture",
    description: "Vedic hymns in praise of Rudra (Shiva), used in worship and meditation.",
    chapters: 2,
    verses: 130,
    image_url: "/placeholder.svg"
  }
];

const categories = [
  "All",
  "Epic",
  "Philosophy",
  "Scripture",
  "Mythology",
  "Literature",
  "Law",
  "Economics & Politics",
  "Devotional",
  "Science",
  "Tantra"
];

export default function TextsLibraryBackend() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("browse");
  const [texts, setTexts] = useState<Text[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [verseSearchQuery, setVerseSearchQuery] = useState("");
  const [verseSearchResults, setVerseSearchResults] = useState([]);
  const [isSearchingVerses, setIsSearchingVerses] = useState(false);

  useEffect(() => {
    loadTexts();
  }, []);

  const loadTexts = async () => {
    if (!supabase) {
      console.log("No Supabase connection, using fallback texts");
      setTexts(fallbackTexts);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('text-content', {
        body: {}
      });

      if (error) throw error;

      // If database has texts, use them; otherwise use fallback
      const loadedTexts = data.texts && data.texts.length > 0 ? data.texts : fallbackTexts;
      setTexts(loadedTexts);
      
      if (data.texts && data.texts.length > 0) {
        toast.success(`Loaded ${data.texts.length} texts from database`);
      } else {
        toast.info(`Loaded ${fallbackTexts.length} curated Sanskrit texts`);
      }
    } catch (error) {
      console.error('Load texts error:', error);
      console.log("Using fallback texts due to error");
      setTexts(fallbackTexts);
      toast.info(`Loaded ${fallbackTexts.length} curated Sanskrit texts`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerseSearch = async () => {
    if (!verseSearchQuery.trim()) {
      toast.error("Please enter search terms");
      return;
    }

    if (!supabase) {
      toast.error("Search service is not available");
      return;
    }

    setIsSearchingVerses(true);

    try {
      const { data, error } = await supabase
        .from('verses')
        .select(`
          *,
          texts:text_id (
            title,
            slug,
            category
          )
        `)
        .or(`sanskrit.ilike.%${verseSearchQuery}%,english_translation.ilike.%${verseSearchQuery}%,hindi_translation.ilike.%${verseSearchQuery}%,commentary.ilike.%${verseSearchQuery}%`)
        .limit(20);

      if (error) throw error;

      setVerseSearchResults(data || []);
      
      if (data?.length === 0) {
        toast.info("No verses found for your search");
      } else {
        toast.success(`Found ${data.length} verses`);
      }

      // Save search to user history if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('user_history').insert({
          user_id: user.id,
          action_type: 'verse_search',
          content: {
            query: verseSearchQuery.trim(),
            results_count: data?.length || 0
          }
        });
      }
    } catch (error) {
      console.error('Verse search error:', error);
      toast.error("Failed to search verses");
      setVerseSearchResults([]);
    } finally {
      setIsSearchingVerses(false);
    }
  };

  // Filter texts based on search query and active category
  const filteredTexts = texts.filter(text => {
    const matchesSearch = text.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          text.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || text.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-saffron" />
          <span className="ml-2 text-gray-600">Loading texts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium">Sanskrit Texts Library</h2>
        <div className="text-sm text-gray-500 bg-cream px-3 py-1 rounded-full">
          {texts.length} Texts Available
        </div>
      </div>

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
                  {category !== "All" && (
                    <span className="ml-1 text-xs opacity-70">
                      ({texts.filter(t => t.category === category).length})
                    </span>
                  )}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTexts.map(text => (
                <Link key={text.id} to={`/texts/${text.slug}`} className="block">
                  <Card className="overflow-hidden h-full card-hover">
                    <img 
                      src={text.image_url || '/placeholder.svg'} 
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

            {filteredTexts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="mx-auto h-12 w-12 mb-4" />
                <p>No texts found matching your criteria.</p>
                <p className="text-sm mt-2">Try a different category or search term.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="search">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  value={verseSearchQuery}
                  onChange={(e) => setVerseSearchQuery(e.target.value)}
                  placeholder="Search verses in Sanskrit, English, or Hindi..."
                  className="pr-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleVerseSearch()}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  <Search className="h-4 w-4" />
                </div>
              </div>
              <Button 
                onClick={handleVerseSearch}
                disabled={isSearchingVerses || !verseSearchQuery.trim()}
                className="bg-saffron hover:bg-saffron/90"
              >
                {isSearchingVerses ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-4">
              {verseSearchResults.map((verse: any) => (
                <Card key={verse.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-medium text-saffron">{verse.texts.title}</h4>
                        <p className="text-sm text-gray-500">Chapter {verse.chapter}, Verse {verse.verse}</p>
                      </div>
                      <span className="bg-cream text-saffron text-xs px-2 py-1 rounded-full">
                        {verse.texts.category}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="font-sanskrit text-lg text-darkText">{verse.sanskrit}</p>
                        {verse.transliteration && (
                          <p className="text-sm text-gray-600 italic">{verse.transliteration}</p>
                        )}
                      </div>
                      
                      {verse.english_translation && (
                        <p className="text-gray-700">{verse.english_translation}</p>
                      )}
                      
                      {verse.hindi_translation && (
                        <p className="text-gray-700">{verse.hindi_translation}</p>
                      )}
                      
                      {verse.commentary && (
                        <div className="bg-cream p-3 rounded-md">
                          <p className="text-sm text-gray-700">{verse.commentary}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {verseSearchResults.length === 0 && verseSearchQuery && !isSearchingVerses && (
              <div className="text-center py-8 text-gray-500">
                <Search className="mx-auto h-12 w-12 mb-4" />
                <p>No verses found for "{verseSearchQuery}"</p>
              </div>
            )}

            {!verseSearchQuery && (
              <div className="text-center py-8 bg-cream rounded-lg">
                <BookOpen className="mx-auto h-12 w-12 text-saffron mb-4" />
                <h3 className="text-lg font-medium mb-2">Cross-Text Verse Search</h3>
                <p className="text-gray-600 mb-4">
                  Search for specific verses or topics across all Sanskrit texts in our database.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto text-sm text-gray-500">
                  <div>dharma</div>
                  <div>karma</div>
                  <div>meditation</div>
                  <div>devotion</div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
