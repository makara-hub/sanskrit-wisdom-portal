
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
      toast.error("Service is not available. Please check your configuration.");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('text-content', {
        body: {}
      });

      if (error) throw error;

      setTexts(data.texts || []);
      toast.success(`Loaded ${data.texts?.length || 0} texts`);
    } catch (error) {
      console.error('Load texts error:', error);
      toast.error("Failed to load texts");
      setTexts([]);
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
