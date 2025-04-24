import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bookmark, ArrowRight, BookOpen, Languages } from "lucide-react";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { toast } from "sonner";

export default function TranslationInterface() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("english");
  const [targetLanguage, setTargetLanguage] = useState("sanskrit");
  const [displayLanguage, setDisplayLanguage] = useState<"english" | "sanskrit" | "transliterated">("sanskrit");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleTranslate = () => {
    if (!sourceText.trim()) {
      toast.error("Please enter text to translate");
      return;
    }

    setIsLoading(true);
    
    // Mock translation delay
    setTimeout(() => {
      // This is where you would call your actual translation API
      const mockTranslation = sourceLanguage === "english" 
        ? "अहं संस्कृतं पठामि।" 
        : "I am studying Sanskrit.";
      
      setTranslatedText(mockTranslation);
      setIsLoading(false);
      toast.success("Translation complete");
    }, 1000);
  };

  const handleSaveTranslation = () => {
    // Mock saving functionality
    toast.success("Translation saved to your history");
    setIsSaved(true);
  };

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-darkText">Sanskrit Translator</h1>
          <p className="text-gray-600">Translate between Sanskrit and English</p>
        </div>
        <LanguageToggle 
          currentLanguage={displayLanguage}
          onLanguageChange={setDisplayLanguage}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Text */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="sanskrit">Sanskrit</SelectItem>
              </SelectContent>
            </Select>
            <button 
              onClick={handleSwapLanguages}
              className="p-2 rounded-md hover:bg-gray-100"
              aria-label="Swap languages"
            >
              <ArrowRight className="h-5 w-5 rotate-90 md:rotate-0" />
            </button>
          </div>
          
          <div className="relative">
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder={sourceLanguage === "english" ? "Enter English text..." : "संस्कृत पाठं लिखत..."}
              className={`w-full h-64 p-4 rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent ${
                sourceLanguage === "sanskrit" ? "font-sanskrit" : ""
              }`}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-500">
              {sourceText.length} characters
            </div>
          </div>
        </div>

        {/* Translated Text */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="sanskrit">Sanskrit</SelectItem>
              </SelectContent>
            </Select>
            <button
              onClick={handleSaveTranslation}
              className={`p-2 rounded-md hover:bg-gray-100 ${isSaved ? "text-saffron" : ""}`}
              aria-label="Save translation"
              disabled={!translatedText}
            >
              <Bookmark className="h-5 w-5" />
            </button>
          </div>
          
          <div className="relative">
            <div 
              className={`w-full h-64 p-4 rounded-md border bg-gray-50 overflow-auto ${
                targetLanguage === "sanskrit" ? "font-sanskrit" : ""
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron"></div>
                </div>
              ) : translatedText ? (
                translatedText
              ) : (
                <span className="text-gray-400">Translation will appear here...</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleTranslate}
          disabled={isLoading || !sourceText.trim()}
          className="bg-saffron hover:bg-saffron/90 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Translating...
            </>
          ) : (
            <>
              <Languages className="mr-2 h-5 w-5" /> 
              Translate
            </>
          )}
        </button>
      </div>

      {/* Additional Features */}
      <div className="bg-cream rounded-lg p-6 mt-8">
        <h2 className="text-lg font-medium mb-4">Translation Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="formal">Formal Language</Label>
              <p className="text-sm text-gray-500">Use more formal and traditional Sanskrit</p>
            </div>
            <Switch id="formal" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="pronunciation">Show Pronunciation Guide</Label>
              <p className="text-sm text-gray-500">Display pronunciation hints for Sanskrit terms</p>
            </div>
            <Switch id="pronunciation" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="grammar">Include Grammar Notes</Label>
              <p className="text-sm text-gray-500">Show grammatical analysis with translations</p>
            </div>
            <Switch id="grammar" />
          </div>
        </div>
      </div>
    </div>
  );
}
