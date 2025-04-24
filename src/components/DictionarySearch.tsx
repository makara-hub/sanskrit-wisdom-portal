
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { Search, Bookmark, Volume } from "lucide-react";
import { toast } from "sonner";

type LanguageDisplay = "english" | "sanskrit" | "transliterated";

interface DictionaryEntry {
  word: string;
  transliteration: string;
  meanings: string[];
  examples: {
    sanskrit: string;
    transliteration: string;
    english: string;
  }[];
  grammaticalInfo: string;
}

export default function DictionarySearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [displayLanguage, setDisplayLanguage] = useState<LanguageDisplay>("sanskrit");
  const [searchResults, setSearchResults] = useState<DictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("word");

  // Mock dictionary search function
  const searchDictionary = () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a word to search");
      return;
    }

    setIsLoading(true);

    // Mock API delay
    setTimeout(() => {
      // Mock dictionary entries - in a real app, this would come from an API or database
      const mockEntries: Record<string, DictionaryEntry> = {
        "dharma": {
          word: "धर्म",
          transliteration: "dharma",
          meanings: [
            "Righteous conduct",
            "Moral law",
            "Virtue",
            "Religious duty",
            "The natural order of things"
          ],
          examples: [
            {
              sanskrit: "धर्मो रक्षति रक्षितः",
              transliteration: "dharmo rakṣati rakṣitaḥ",
              english: "Dharma protects those who protect it"
            },
            {
              sanskrit: "यतो धर्मस्ततो जयः",
              transliteration: "yato dharmas tato jayaḥ",
              english: "Where there is dharma, there is victory"
            }
          ],
          grammaticalInfo: "Masculine noun, Nominative singular: धर्मः (dharmaḥ)"
        },
        "vidya": {
          word: "विद्या",
          transliteration: "vidyā",
          meanings: [
            "Knowledge",
            "Learning",
            "Science",
            "Scholarship",
            "Philosophy"
          ],
          examples: [
            {
              sanskrit: "विद्या ददाति विनयम्",
              transliteration: "vidyā dadāti vinayam",
              english: "Knowledge gives humility"
            },
            {
              sanskrit: "सा विद्या या विमुक्तये",
              transliteration: "sā vidyā yā vimuktaye",
              english: "That is knowledge which liberates"
            }
          ],
          grammaticalInfo: "Feminine noun, Nominative singular: विद्या (vidyā)"
        },
        "namaste": {
          word: "नमस्ते",
          transliteration: "namaste",
          meanings: [
            "I bow to you",
            "Greetings",
            "Salutations",
            "Reverence to you"
          ],
          examples: [
            {
              sanskrit: "नमस्ते गुरुदेव",
              transliteration: "namaste gurudeva",
              english: "Salutations to you, teacher"
            }
          ],
          grammaticalInfo: "From नमः (namaḥ, salutation) + ते (te, to you)"
        }
      };

      const lowerQuery = searchQuery.toLowerCase();
      let results: DictionaryEntry[] = [];

      // Check if we have exact matches in our mock data
      if (mockEntries[lowerQuery]) {
        results.push(mockEntries[lowerQuery]);
      } else {
        // Check for partial matches
        Object.values(mockEntries).forEach(entry => {
          if (
            entry.transliteration.includes(lowerQuery) ||
            entry.word.includes(searchQuery) ||
            entry.meanings.some(meaning => meaning.toLowerCase().includes(lowerQuery))
          ) {
            results.push(entry);
          }
        });

        // If still no results, return a default suggestion
        if (results.length === 0) {
          results = [mockEntries["dharma"]]; // Default to returning "dharma" as a suggestion
        }
      }

      setSearchResults(results);
      setIsLoading(false);
    }, 800);
  };

  const handleBookmark = (word: string) => {
    toast.success(`${word} added to your bookmarks`);
  };

  const playPronunciation = (word: string) => {
    toast.info(`Playing pronunciation for ${word}`);
    // In a real implementation, this would play an audio file
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-2xl font-medium mb-6">Sanskrit Dictionary</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="word">Word Search</TabsTrigger>
          <TabsTrigger value="text">Text Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="word">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a Sanskrit word or English meaning..."
                  className="pr-10"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      searchDictionary();
                    }
                  }}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  <Search className="h-4 w-4" />
                </div>
              </div>
              
              <Button
                onClick={searchDictionary}
                className="bg-royalBlue hover:bg-royalBlue/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Searching..." : "Search Dictionary"}
              </Button>
            </div>

            <LanguageToggle
              currentLanguage={displayLanguage}
              onLanguageChange={setDisplayLanguage}
              className="mb-6 justify-end"
            />

            {searchResults.length > 0 && (
              <div className="space-y-6">
                {searchResults.map((result) => (
                  <Card key={result.transliteration} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="bg-cream p-4 flex justify-between items-center">
                        <div>
                          <h3 className={`text-xl font-medium ${displayLanguage === "sanskrit" ? "font-sanskrit" : ""}`}>
                            {displayLanguage === "sanskrit" ? result.word : 
                             displayLanguage === "transliterated" ? result.transliteration : 
                             result.meanings[0]}
                          </h3>
                          {displayLanguage === "sanskrit" && (
                            <p className="text-sm text-gray-600">{result.transliteration}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => playPronunciation(result.word)}>
                            <Volume className="h-4 w-4 text-gray-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleBookmark(result.word)}>
                            <Bookmark className="h-4 w-4 text-gray-600" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2">Meanings:</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {result.meanings.map((meaning, i) => (
                              <li key={i} className="text-gray-700">{meaning}</li>
                            ))}
                          </ul>
                        </div>
                        
                        {result.grammaticalInfo && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium mb-2">Grammatical Information:</h4>
                            <p className="text-gray-700">{result.grammaticalInfo}</p>
                          </div>
                        )}
                        
                        {result.examples.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Examples:</h4>
                            <div className="space-y-4">
                              {result.examples.map((example, i) => (
                                <div key={i} className="bg-gray-50 p-3 rounded-md">
                                  <p className={`mb-1 ${displayLanguage === "sanskrit" ? "font-sanskrit" : ""}`}>
                                    {displayLanguage === "sanskrit" ? example.sanskrit : 
                                     displayLanguage === "transliterated" ? example.transliteration : 
                                     example.english}
                                  </p>
                                  <p className="text-sm text-gray-600 italic">
                                    {example.english}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="text">
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Text Analysis Tool</h3>
            <p className="text-gray-600 mb-6">
              Paste a Sanskrit text to analyze its vocabulary and grammar.
              This feature is coming soon.
            </p>
            <Button disabled className="bg-gray-300">Coming Soon</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
