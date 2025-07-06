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

// Comprehensive collection of public domain classical Sanskrit texts
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
    id: "matsya-purana",
    slug: "matsya-purana",
    title: "Matsya Purana",
    category: "Mythology",
    description: "Ancient Purana narrating the story of Vishnu's fish avatar and cosmic cycles.",
    chapters: 3,
    verses: 14000,
    image_url: "/placeholder.svg"
  },
  {
    id: "kurma-purana",
    slug: "kurma-purana",
    title: "Kurma Purana",
    category: "Mythology",
    description: "Purana dedicated to Vishnu's tortoise incarnation and creation stories.",
    chapters: 2,
    verses: 17000,
    image_url: "/placeholder.svg"
  },
  {
    id: "varaha-purana",
    slug: "varaha-purana",
    title: "Varaha Purana",
    category: "Mythology",
    description: "Sacred text about Vishnu's boar incarnation and earth's rescue from cosmic waters.",
    chapters: 2,
    verses: 10000,
    image_url: "/placeholder.svg"
  },
  {
    id: "vamana-purana",
    slug: "vamana-purana",
    title: "Vamana Purana",
    category: "Mythology",
    description: "Purana narrating the story of Vishnu's dwarf incarnation and cosmic mythology.",
    chapters: 2,
    verses: 9500,
    image_url: "/placeholder.svg"
  },
  {
    id: "narada-purana",
    slug: "narada-purana",
    title: "Narada Purana",
    category: "Mythology",
    description: "Sacred text containing teachings and stories related to sage Narada.",
    chapters: 2,
    verses: 25000,
    image_url: "/placeholder.svg"
  },
  {
    id: "markandeya-purana",
    slug: "markandeya-purana",
    title: "Markandeya Purana",
    category: "Mythology",
    description: "Ancient Purana containing the famous Devi Mahatmya and cosmic stories.",
    chapters: 3,
    verses: 9000,
    image_url: "/placeholder.svg"
  },
  {
    id: "agni-purana",
    slug: "agni-purana",
    title: "Agni Purana",
    category: "Mythology",
    description: "Encyclopedic Purana covering rituals, medicine, astronomy, and various sciences.",
    chapters: 3,
    verses: 15400,
    image_url: "/placeholder.svg"
  },
  {
    id: "bhavishya-purana",
    slug: "bhavishya-purana",
    title: "Bhavishya Purana",
    category: "Mythology",
    description: "Purana dealing with future events, festivals, and religious observances.",
    chapters: 4,
    verses: 14500,
    image_url: "/placeholder.svg"
  },
  {
    id: "brahma-purana",
    slug: "brahma-purana",
    title: "Brahma Purana",
    category: "Mythology",
    description: "One of the oldest Puranas, focusing on creation and sacred geography of India.",
    chapters: 3,
    verses: 10000,
    image_url: "/placeholder.svg"
  },
  {
    id: "brahmanda-purana",
    slug: "brahmanda-purana",
    title: "Brahmanda Purana",
    category: "Mythology",
    description: "Purana describing the cosmic egg and genealogies of gods and sages.",
    chapters: 4,
    verses: 18000,
    image_url: "/placeholder.svg"
  },
  {
    id: "brahmavaivarta-purana",
    slug: "brahmavaivarta-purana",
    title: "Brahmavaivarta Purana",
    category: "Mythology",
    description: "Purana focusing on Krishna's divine sports and cosmic principles.",
    chapters: 4,
    verses: 18000,
    image_url: "/placeholder.svg"
  },
  {
    id: "linga-purana",
    slug: "linga-purana",
    title: "Linga Purana",
    category: "Mythology",
    description: "Sacred text dedicated to Shiva worship and the significance of the lingam.",
    chapters: 2,
    verses: 11000,
    image_url: "/placeholder.svg"
  },
  {
    id: "padma-purana",
    slug: "padma-purana",
    title: "Padma Purana",
    category: "Mythology",
    description: "Large Purana containing stories of creation, geography, and religious practices.",
    chapters: 6,
    verses: 55000,
    image_url: "/placeholder.svg"
  },
  {
    id: "vayu-purana",
    slug: "vayu-purana",
    title: "Vayu Purana",
    category: "Mythology",
    description: "Ancient Purana focusing on genealogies, cosmology, and Shiva stories.",
    chapters: 2,
    verses: 24000,
    image_url: "/placeholder.svg"
  },
  {
    id: "rigveda",
    slug: "rigveda",
    title: "Rigveda",
    category: "Scripture",
    description: "The oldest Veda containing hymns praising various deities and cosmic principles.",
    chapters: 10,
    verses: 1028,
    image_url: "/placeholder.svg"
  },
  {
    id: "samaveda",
    slug: "samaveda",
    title: "Samaveda",
    category: "Scripture",
    description: "The Veda of melodies, containing chants derived from the Rigveda.",
    chapters: 2,
    verses: 1875,
    image_url: "/placeholder.svg"
  },
  {
    id: "yajurveda",
    slug: "yajurveda",
    title: "Yajurveda",
    category: "Scripture",
    description: "The Veda of sacrificial formulas, containing prose mantras for rituals.",
    chapters: 2,
    verses: 3988,
    image_url: "/placeholder.svg"
  },
  {
    id: "atharvaveda",
    slug: "atharvaveda",
    title: "Atharvaveda",
    category: "Scripture",
    description: "The fourth Veda containing hymns, spells, and incantations for daily life.",
    chapters: 20,
    verses: 5977,
    image_url: "/placeholder.svg"
  },
  {
    id: "ashtadhyayi",
    slug: "ashtadhyayi",
    title: "Ashtadhyayi",
    category: "Grammar",
    description: "Panini's foundational work on Sanskrit grammar, the world's first formal grammar.",
    chapters: 8,
    verses: 3959,
    image_url: "/placeholder.svg"
  },
  {
    id: "nirukta",
    slug: "nirukta",
    title: "Nirukta",
    category: "Grammar",
    description: "Yaska's etymological dictionary and interpretation of Vedic words.",
    chapters: 14,
    verses: 2000,
    image_url: "/placeholder.svg"
  },
  {
    id: "mahabhashya",
    slug: "mahabhashya",
    title: "Mahabhashya",
    category: "Grammar",
    description: "Patanjali's great commentary on Panini's grammar sutras.",
    chapters: 8,
    verses: 5000,
    image_url: "/placeholder.svg"
  },
  {
    id: "aryabhatiya",
    slug: "aryabhatiya",
    title: "Aryabhatiya",
    category: "Science",
    description: "Aryabhata's foundational work on mathematics and astronomy.",
    chapters: 4,
    verses: 121,
    image_url: "/placeholder.svg"
  },
  {
    id: "brahmasphutasiddhanta",
    slug: "brahmasphutasiddhanta",
    title: "Brahmasphutasiddhanta",
    category: "Science",
    description: "Brahmagupta's comprehensive treatise on mathematics and astronomy.",
    chapters: 25,
    verses: 1000,
    image_url: "/placeholder.svg"
  },
  {
    id: "lilavati",
    slug: "lilavati",
    title: "Lilavati",
    category: "Science",
    description: "Bhaskara II's famous work on arithmetic and mathematical problems.",
    chapters: 13,
    verses: 278,
    image_url: "/placeholder.svg"
  },
  {
    id: "bijaganita",
    slug: "bijaganita",
    title: "Bijaganita",
    category: "Science",
    description: "Bhaskara II's treatise on algebra and mathematical equations.",
    chapters: 12,
    verses: 213,
    image_url: "/placeholder.svg"
  },
  {
    id: "surya-siddhanta",
    slug: "surya-siddhanta",
    title: "Surya Siddhanta",
    category: "Science",
    description: "Ancient astronomical treatise on planetary motions and calculations.",
    chapters: 14,
    verses: 500,
    image_url: "/placeholder.svg"
  },
  {
    id: "bhartrhari-shatakatraya",
    slug: "bhartrhari-shatakatraya",
    title: "Shatakatraya",
    category: "Literature",
    description: "Bhartrhari's three centuries of verses on ethics, love, and renunciation.",
    chapters: 3,
    verses: 300,
    image_url: "/placeholder.svg"
  },
  {
    id: "amarushataka",
    slug: "amarushataka",
    title: "Amarushataka",
    category: "Literature",
    description: "Amaru's collection of verses on love and passion.",
    chapters: 1,
    verses: 100,
    image_url: "/placeholder.svg"
  },
  {
    id: "gita-govinda",
    slug: "gita-govinda",
    title: "Gita Govinda",
    category: "Literature",
    description: "Jayadeva's lyrical poem about Krishna and Radha's divine love.",
    chapters: 12,
    verses: 248,
    image_url: "/placeholder.svg"
  },
  {
    id: "kadambari",
    slug: "kadambari",
    title: "Kadambari",
    category: "Literature",
    description: "Banabhatta's romantic prose tale, a masterpiece of Sanskrit literature.",
    chapters: 2,
    verses: 5000,
    image_url: "/placeholder.svg"
  },
  {
    id: "harshacharita",
    slug: "harshacharita",
    title: "Harshacharita",
    category: "Literature",
    description: "Banabhatta's biography of Emperor Harsha in ornate Sanskrit prose.",
    chapters: 8,
    verses: 3000,
    image_url: "/placeholder.svg"
  },
  {
    id: "naishadhacharita",
    slug: "naishadhacharita",
    title: "Naishadhacharita",
    category: "Literature",
    description: "Shriharsha's epic poem about King Nala and Damayanti's love story.",
    chapters: 22,
    verses: 2000,
    image_url: "/placeholder.svg"
  },
  {
    id: "sankhya-karika",
    slug: "sankhya-karika",
    title: "Sankhya Karika",
    category: "Philosophy",
    description: "Ishvarakrishna's foundational text of Sankhya philosophy.",
    chapters: 1,
    verses: 72,
    image_url: "/placeholder.svg"
  },
  {
    id: "tattva-samasa",
    slug: "tattva-samasa",
    title: "Tattva Samasa",
    category: "Philosophy",
    description: "Summary of Sankhya principles and cosmic evolution.",
    chapters: 1,
    verses: 25,
    image_url: "/placeholder.svg"
  },
  {
    id: "nyaya-sutras",
    slug: "nyaya-sutras",
    title: "Nyaya Sutras",
    category: "Philosophy",
    description: "Gautama's foundational text of logical reasoning and epistemology.",
    chapters: 5,
    verses: 528,
    image_url: "/placeholder.svg"
  },
  {
    id: "vaisheshika-sutras",
    slug: "vaisheshika-sutras",
    title: "Vaisheshika Sutras",
    category: "Philosophy",
    description: "Kanada's atomic theory and categories of existence.",
    chapters: 10,
    verses: 370,
    image_url: "/placeholder.svg"
  },
  {
    id: "mimamsa-sutras",
    slug: "mimamsa-sutras",
    title: "Mimamsa Sutras",
    category: "Philosophy",
    description: "Jaimini's treatise on ritual interpretation and Vedic hermeneutics.",
    chapters: 12,
    verses: 2621,
    image_url: "/placeholder.svg"
  },
  {
    id: "stotra-ratna",
    slug: "stotra-ratna",
    title: "Stotra Ratna",
    category: "Devotional",
    description: "Yamuna's hymns in praise of Lord Vishnu, expressing pure devotion.",
    chapters: 1,
    verses: 65,
    image_url: "/placeholder.svg"
  },
  {
    id: "chatuhshloki-bhagavata",
    slug: "chatuhshloki-bhagavata",
    title: "Chatuhshloki Bhagavata",
    category: "Devotional",
    description: "Four essential verses summarizing the entire Bhagavata philosophy.",
    chapters: 1,
    verses: 4,
    image_url: "/placeholder.svg"
  },
  {
    id: "mukunda-mala",
    slug: "mukunda-mala",
    title: "Mukunda Mala",
    category: "Devotional",
    description: "Kulashekhara's devotional hymns expressing longing for Krishna.",
    chapters: 1,
    verses: 46,
    image_url: "/placeholder.svg"
  },
  {
    id: "guru-ashtaka",
    slug: "guru-ashtaka",
    title: "Guru Ashtaka",
    category: "Devotional",
    description: "Eight verses glorifying the spiritual master and guru-disciple relationship.",
    chapters: 1,
    verses: 8,
    image_url: "/placeholder.svg"
  },
  {
    id: "prashna-upanishad",
    slug: "prashna-upanishad",
    title: "Prashna Upanishad",
    category: "Philosophy",
    description: "Upanishad dealing with six fundamental questions about existence.",
    chapters: 6,
    verses: 67,
    image_url: "/placeholder.svg"
  },
  {
    id: "taittiriya-upanishad",
    slug: "taittiriya-upanishad",
    title: "Taittiriya Upanishad",
    category: "Philosophy",
    description: "Upanishad exploring the five sheaths of human existence.",
    chapters: 3,
    verses: 84,
    image_url: "/placeholder.svg"
  },
  {
    id: "aitareya-upanishad",
    slug: "aitareya-upanishad",
    title: "Aitareya Upanishad",
    category: "Philosophy",
    description: "Upanishad describing the creation of the universe and human birth.",
    chapters: 3,
    verses: 33,
    image_url: "/placeholder.svg"
  },
  {
    id: "svetasvatara-upanishad",
    slug: "svetasvatara-upanishad",
    title: "Svetasvatara Upanishad",
    category: "Philosophy",
    description: "Upanishad emphasizing devotion to the Supreme Lord and divine grace.",
    chapters: 6,
    verses: 113,
    image_url: "/placeholder.svg"
  },
  {
    id: "rajatarangini",
    slug: "rajatarangini",
    title: "Rajatarangini",
    category: "History",
    description: "Kalhana's chronicle of the kings of Kashmir, first Indian historical work.",
    chapters: 8,
    verses: 7826,
    image_url: "/placeholder.svg"
  },
  {
    id: "mudrarakshasa",
    slug: "mudrarakshasa",
    title: "Mudrarakshasa",
    category: "Literature",
    description: "Vishakhadatta's political drama about Chandragupta Maurya's rise to power.",
    chapters: 7,
    verses: 1200,
    image_url: "/placeholder.svg"
  },
  {
    id: "varahamihira-brihat-samhita",
    slug: "varahamihira-brihat-samhita",
    title: "Brihat Samhita",
    category: "Science",
    description: "Varahamihira's encyclopedic work on astronomy, astrology, and natural phenomena.",
    chapters: 106,
    verses: 4000,
    image_url: "/placeholder.svg"
  },
  {
    id: "siddhanta-shiromani",
    slug: "siddhanta-shiromani",
    title: "Siddhanta Shiromani",
    category: "Science",
    description: "Bhaskara II's comprehensive treatise on mathematics and astronomy.",
    chapters: 4,
    verses: 1450,
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
  "Tantra",
  "Grammar",
  "History"
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
