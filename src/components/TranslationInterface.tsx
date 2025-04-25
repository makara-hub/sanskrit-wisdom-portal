
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bookmark, ArrowRight, BookOpen, Languages } from "lucide-react";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const LANGUAGES = {
  english: "en",
  sanskrit: "sa",
  hindi: "hi",
  spanish: "es",
  french: "fr",
  german: "de",
  italian: "it",
  portuguese: "pt",
  russian: "ru",
  japanese: "ja",
  korean: "ko",
  chinese: "zh",
  arabic: "ar",
  dutch: "nl",
  greek: "el",
  polish: "pl",
  swedish: "sv",
  turkish: "tr",
  vietnamese: "vi",
  thai: "th",
  bengali: "bn",
  tamil: "ta",
  telugu: "te",
  marathi: "mr",
  urdu: "ur",
};

export default function TranslationInterface() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("english");
  const [targetLanguage, setTargetLanguage] = useState("sanskrit");
  const [displayLanguage, setDisplayLanguage] = useState<"english" | "sanskrit" | "transliterated">("sanskrit");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [autoDetectLanguage, setAutoDetectLanguage] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast.error("Please enter text to translate");
      return;
    }

    if (!supabase) {
      toast.error("Translation service is not available. Please check your configuration.");
      return;
    }

    setIsLoading(true);
    setIsSaved(false);
    
    try {
      const { data, error } = await supabase.functions.invoke('translate', {
        body: {
          text: sourceText,
          sourceLang: autoDetectLanguage ? 'auto' : LANGUAGES[sourceLanguage as keyof typeof LANGUAGES],
          targetLang: LANGUAGES[targetLanguage as keyof typeof LANGUAGES],
        },
      });

      if (error) throw error;

      setTranslatedText(data.translatedText);
      
      // If language was auto-detected, update the source language dropdown
      if (autoDetectLanguage && data.detectedLanguage) {
        // Find the language key by its code
        const detectedLangEntry = Object.entries(LANGUAGES).find(
          ([_, code]) => code === data.detectedLanguage
        );
        if (detectedLangEntry) {
          setSourceLanguage(detectedLangEntry[0]);
        }
      }
      
      toast.success("Translation complete");
    } catch (error) {
      console.error('Translation error:', error);
      toast.error("Failed to translate text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTranslation = async () => {
    if (!supabase) {
      toast.error("Service is not available. Please check your configuration.");
      return;
    }

    try {
      const { error } = await supabase
        .from('translations')
        .insert([
          {
            source_text: sourceText,
            translated_text: translatedText,
            source_language: sourceLanguage,
            target_language: targetLanguage,
            created_at: new Date().toISOString(),
          }
        ]);

      if (error) throw error;

      setIsSaved(true);
      toast.success("Translation saved to your history");
    } catch (error) {
      console.error('Error saving translation:', error);
      toast.error("Failed to save translation. Please try again.");
    }
  };

  const handleSwapLanguages = () => {
    if (autoDetectLanguage) {
      toast.info("Cannot swap when auto-detect is enabled");
      return;
    }
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-darkText">Universal Translator</h1>
          <p className="text-gray-600">Translate between any language</p>
        </div>
        <LanguageToggle 
          currentLanguage={displayLanguage}
          onLanguageChange={setDisplayLanguage}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Text */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {!autoDetectLanguage && (
                <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Source language" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {Object.keys(LANGUAGES).map(lang => (
                      <SelectItem key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {autoDetectLanguage && (
                <div className="h-10 px-4 py-2 border rounded-md flex items-center">
                  Auto-detect
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Switch 
                  id="auto-detect"
                  checked={autoDetectLanguage}
                  onCheckedChange={setAutoDetectLanguage}
                />
                <Label htmlFor="auto-detect" className="cursor-pointer">Auto</Label>
              </div>
            </div>
            <button 
              onClick={handleSwapLanguages}
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
              aria-label="Swap languages"
              disabled={autoDetectLanguage}
            >
              <ArrowRight className="h-5 w-5 rotate-90 md:rotate-0" />
            </button>
          </div>
          
          <div className="relative">
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text to translate..."
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
                <SelectValue placeholder="Target language" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {Object.keys(LANGUAGES).map(lang => (
                  <SelectItem key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </SelectItem>
                ))}
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

      <div className="bg-cream rounded-lg p-6 mt-8">
        <h2 className="text-lg font-medium mb-4">Translation Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="formal">Formal Language</Label>
              <p className="text-sm text-gray-500">Use more formal and traditional language</p>
            </div>
            <Switch id="formal" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="pronunciation">Show Pronunciation Guide</Label>
              <p className="text-sm text-gray-500">Display pronunciation hints</p>
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
