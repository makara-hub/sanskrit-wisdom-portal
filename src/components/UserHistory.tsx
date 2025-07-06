
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, Bookmark, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

interface HistoryItem {
  id: string;
  action_type: string;
  content: any;
  created_at: string;
}

interface SavedItem {
  id: string;
  item_type: string;
  content: any;
  created_at: string;
}

export default function UserHistory() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("history");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    if (!supabase) {
      toast.error("Service is not available");
      setIsLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to view your history");
        setIsLoading(false);
        return;
      }

      // Load history
      const { data: history, error: historyError } = await supabase
        .from('user_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (historyError) throw historyError;

      // Load saved items
      const { data: saved, error: savedError } = await supabase
        .from('saved_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (savedError) throw savedError;

      setHistoryItems(history || []);
      setSavedItems(saved || []);
    } catch (error) {
      console.error('Load user data error:', error);
      toast.error("Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSavedItem = async (itemId: string) => {
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('saved_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setSavedItems(prev => prev.filter(item => item.id !== itemId));
      toast.success("Item removed from saved collection");
    } catch (error) {
      console.error('Delete saved item error:', error);
      toast.error("Failed to remove item");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'translation':
        return '🔄';
      case 'search':
        return '🔍';
      case 'verse_search':
        return '📖';
      case 'text_view':
        return '👁️';
      default:
        return '📝';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-saffron" />
          <span className="ml-2 text-gray-600">Loading your data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-2xl font-medium mb-6">Your Activity</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="history">Recent Activity</TabsTrigger>
          <TabsTrigger value="saved">Saved Items</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <div className="space-y-4">
            {historyItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <History className="mx-auto h-12 w-12 mb-4" />
                <p>No activity yet. Start exploring Sanskrit texts and translations!</p>
              </div>
            ) : (
              historyItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{getActionIcon(item.action_type)}</span>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {item.action_type.replace('_', ' ')}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {formatDate(item.created_at)}
                            </span>
                          </div>
                          
                          {item.action_type === 'translation' && (
                            <div className="space-y-1">
                              <p className="text-sm">
                                <strong>From:</strong> {item.content.sourceLang} → {item.content.targetLang}
                              </p>
                              <p className="text-sm text-gray-600">"{item.content.sourceText}"</p>
                            </div>
                          )}
                          
                          {(item.action_type === 'search' || item.action_type === 'verse_search') && (
                            <div className="space-y-1">
                              <p className="text-sm">
                                <strong>Query:</strong> "{item.content.query}"
                              </p>
                              <p className="text-sm text-gray-600">
                                Found {item.content.results_count} results
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <div className="space-y-4">
            {savedItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bookmark className="mx-auto h-12 w-12 mb-4" />
                <p>No saved items yet. Save translations, verses, or dictionary entries to access them later!</p>
              </div>
            ) : (
              savedItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {item.item_type}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {formatDate(item.created_at)}
                          </span>
                        </div>
                        
                        {item.item_type === 'definition' && (
                          <div className="space-y-1">
                            <p className="font-medium">
                              {item.content.word} ({item.content.transliteration})
                            </p>
                            <p className="text-sm text-gray-600">{item.content.meaning}</p>
                          </div>
                        )}
                        
                        {item.item_type === 'translation' && (
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">"{item.content.sourceText}"</p>
                            <p className="font-medium">"{item.content.translatedText}"</p>
                          </div>
                        )}
                        
                        {item.item_type === 'verse' && (
                          <div className="space-y-1">
                            <p className="font-medium">{item.content.textTitle}</p>
                            <p className="text-sm text-gray-600">
                              Chapter {item.content.chapter}, Verse {item.content.verse}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSavedItem(item.id)}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
