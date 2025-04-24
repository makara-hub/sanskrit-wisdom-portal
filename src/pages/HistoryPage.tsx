
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Bookmark, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

// Mock data for user history
const translationHistory = [
  {
    id: 1,
    date: "2025-04-20",
    inputText: "The world is a family",
    outputText: "वसुधैव कुटुम्बकम्",
    direction: "english-to-sanskrit",
  },
  {
    id: 2,
    date: "2025-04-19",
    inputText: "Knowledge is wealth",
    outputText: "विद्या धनम्",
    direction: "english-to-sanskrit",
  },
  {
    id: 3,
    date: "2025-04-18",
    inputText: "नमस्ते",
    outputText: "Hello",
    direction: "sanskrit-to-english",
  }
];

const dictionaryHistory = [
  {
    id: 1,
    date: "2025-04-22",
    word: "धर्म",
    transliteration: "dharma",
  },
  {
    id: 2,
    date: "2025-04-21",
    word: "विद्या",
    transliteration: "vidyā",
  }
];

const bookmarks = [
  {
    id: 1,
    type: "translation",
    date: "2025-04-15",
    inputText: "Truth alone triumphs",
    outputText: "सत्यमेव जयते",
    direction: "english-to-sanskrit",
  },
  {
    id: 2,
    type: "dictionary",
    date: "2025-04-16",
    word: "धर्म",
    transliteration: "dharma",
  },
  {
    id: 3,
    type: "text",
    date: "2025-04-17",
    textId: "bhagavad-gita",
    textTitle: "Bhagavad Gita",
    chapter: 2,
    verse: 47,
    content: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
    translation: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions."
  }
];

export default function HistoryPage() {
  const handleDelete = (id: number, type: string) => {
    toast.success(`${type} item deleted`);
  };

  const handleBookmark = (id: number, type: string) => {
    toast.success(`${type} item bookmarked`);
  };

  const handleRemoveBookmark = (id: number) => {
    toast.success("Removed from bookmarks");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container-custom">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-2xl font-medium mb-6">Your History</h2>

            <Tabs defaultValue="translations">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="translations">Translations</TabsTrigger>
                <TabsTrigger value="dictionary">Dictionary</TabsTrigger>
                <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
              </TabsList>

              <TabsContent value="translations">
                <div className="space-y-4">
                  {translationHistory.length > 0 ? (
                    translationHistory.map(item => (
                      <Card key={item.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center mb-2">
                                <span className="text-xs text-gray-500 mr-2">{item.date}</span>
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                                  {item.direction === "english-to-sanskrit" ? "English → Sanskrit" : "Sanskrit → English"}
                                </span>
                              </div>
                              <div className="mb-2">
                                <p className="text-sm font-medium">Input:</p>
                                <p className={`${item.direction === "sanskrit-to-english" ? "font-sanskrit" : ""}`}>
                                  {item.inputText}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Translation:</p>
                                <p className={`${item.direction === "english-to-sanskrit" ? "font-sanskrit" : ""}`}>
                                  {item.outputText}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleBookmark(item.id, "translation")}
                              >
                                <Bookmark className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDelete(item.id, "translation")}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">You don't have any translation history yet.</p>
                      <Link to="/translate">
                        <Button>Start Translating</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="dictionary">
                <div className="space-y-4">
                  {dictionaryHistory.length > 0 ? (
                    dictionaryHistory.map(item => (
                      <Card key={item.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center mb-2">
                                <span className="text-xs text-gray-500">{item.date}</span>
                              </div>
                              <div>
                                <p className="font-sanskrit text-lg">{item.word}</p>
                                <p className="text-sm text-gray-600">{item.transliteration}</p>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleBookmark(item.id, "dictionary")}
                              >
                                <Bookmark className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDelete(item.id, "dictionary")}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">You don't have any dictionary search history yet.</p>
                      <Link to="/dictionary">
                        <Button>Search Dictionary</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="bookmarks">
                <div className="space-y-4">
                  {bookmarks.length > 0 ? (
                    bookmarks.map(item => (
                      <Card key={item.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="w-full">
                              <div className="flex items-center mb-2">
                                <span className="text-xs text-gray-500 mr-2">{item.date}</span>
                                <span className="bg-saffron/10 text-saffron text-xs px-2 py-0.5 rounded-full">
                                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                </span>
                              </div>
                              
                              {item.type === "translation" && (
                                <>
                                  <div className="mb-2">
                                    <p className="text-sm font-medium">Input:</p>
                                    <p>{item.inputText}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Translation:</p>
                                    <p className="font-sanskrit">{item.outputText}</p>
                                  </div>
                                </>
                              )}
                              
                              {item.type === "dictionary" && (
                                <div>
                                  <p className="font-sanskrit text-lg">{item.word}</p>
                                  <p className="text-sm text-gray-600">{item.transliteration}</p>
                                </div>
                              )}
                              
                              {item.type === "text" && (
                                <div>
                                  <p className="font-medium mb-1">{item.textTitle} {item.chapter}.{item.verse}</p>
                                  <p className="font-sanskrit mb-1">{item.content}</p>
                                  <p className="text-sm text-gray-600 italic">{item.translation}</p>
                                </div>
                              )}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveBookmark(item.id)}
                              className="text-saffron ml-2 flex-shrink-0"
                            >
                              <Bookmark className="h-4 w-4 fill-saffron" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">You don't have any bookmarks yet.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
