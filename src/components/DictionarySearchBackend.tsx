
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

interface DictionaryEntry {
  id: string;
  word: string;
  transliteration: string;
  meaning: string;
  definition: string;
  part_of_speech: string;
  etymology: string;
  usage_examples: string[];
  related_words: string[];
}

export default function DictionarySearchBackend() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a word to search");
      return;
    }

    if (!supabase) {
      toast.error("Dictionary service is not available. Please check your configuration.");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const { data, error } = await supabase.functions.invoke('dictionary-search', {
        body: { query: searchQuery.trim(), limit: 20 }
      });

      if (error) throw error;

      setSearchResults(data.results || []);
      
      if (data.results?.length === 0) {
        toast.info("No entries found for your search");
      } else {
        toast.success(`Found ${data.results.length} entries`);
      }

      // Save search to user history if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('user_history').insert({
          user_id: user.id,
          action_type: 'search',
          content: {
            query: searchQuery.trim(),
            results_count: data.results?.length || 0
          }
        });
      }
    } catch (error) {
      console.error('Dictionary search error:', error);
      toast.error("Failed to search dictionary. Please try again.");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEntry = async (entry: DictionaryEntry) => {
    if (!supabase) {
      toast.error("Service is not available.");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to save entries");
        return;
      }

      const { error } = await supabase.from('saved_items').insert({
        user_id: user.id,
        item_type: 'definition',
        item_id: entry.id,
        content: entry
      });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.info("Entry already saved");
        } else {
          throw error;
        }
      } else {
        toast.success("Entry saved to your collection");
      }
    } catch (error) {
      console.error('Save entry error:', error);
      toast.error("Failed to save entry");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search Sanskrit words, meanings, or transliterations..."
            className="pr-10"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            <Search className="h-4 w-4" />
          </div>
        </div>
        <Button 
          onClick={handleSearch}
          disabled={isLoading || !searchQuery.trim()}
          className="bg-saffron hover:bg-saffron/90"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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

      {hasSearched && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              {searchResults.length > 0 
                ? `${searchResults.length} results for "${searchQuery}"`
                : `No results for "${searchQuery}"`
              }
            </h3>
          </div>

          <div className="grid gap-4">
            {searchResults.map((entry) => (
              <Card key={entry.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-sanskrit text-saffron">{entry.word}</h4>
                        <span className="text-gray-600">({entry.transliteration})</span>
                        {entry.part_of_speech && (
                          <Badge variant="outline">{entry.part_of_speech}</Badge>
                        )}
                      </div>
                      <p className="text-lg font-medium text-darkText mb-2">{entry.meaning}</p>
                      {entry.definition && (
                        <p className="text-gray-600 mb-3">{entry.definition}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSaveEntry(entry)}
                      className="hover:bg-cream"
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>

                  {entry.usage_examples && entry.usage_examples.length > 0 && (
                    <div className="mb-3">
                      <h5 className="font-medium text-sm text-gray-700 mb-1">Usage Examples:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {entry.usage_examples.map((example, index) => (
                          <li key={index} className="italic">• {example}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {entry.etymology && (
                    <div className="mb-3">
                      <h5 className="font-medium text-sm text-gray-700 mb-1">Etymology:</h5>
                      <p className="text-sm text-gray-600">{entry.etymology}</p>
                    </div>
                  )}

                  {entry.related_words && entry.related_words.length > 0 && (
                    <div>
                      <h5 className="font-medium text-sm text-gray-700 mb-1">Related Words:</h5>
                      <div className="flex flex-wrap gap-2">
                        {entry.related_words.map((word, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {word}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!hasSearched && (
        <div className="text-center py-12 bg-cream rounded-lg">
          <BookOpen className="mx-auto h-12 w-12 text-saffron mb-4" />
          <h3 className="text-lg font-medium mb-2">Sanskrit Dictionary</h3>
          <p className="text-gray-600 mb-4">
            Search through our comprehensive collection of Sanskrit words and their meanings.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto text-sm text-gray-500">
            <div>dharma</div>
            <div>karma</div>
            <div>moksha</div>
            <div>yoga</div>
          </div>
        </div>
      )}
    </div>
  );
}
