
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bookmark, ArrowRight, BookOpen, Translate } from "lucide-react";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { toast } from "sonner";

type TranslationDirection = "english-to-sanskrit" | "sanskrit-to-english";
type LanguageDisplay = "english" | "sanskrit" | "transliterated";

export default function TranslationInterface() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [direction, setDirection] = useState<TranslationDirection>("english-to-sanskrit");
  const [displayLanguage, setDisplayLanguage] = useState<LanguageDisplay>("sanskrit");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fontSize, setFontSize] = useState<number>(16);

  // Mock translation function
  const translateText = () => {
    if (!inputText.trim()) {
      toast.error("Please enter text to translate");
      return;
    }

    setIsLoading(true);
    
    // Mock API delay
    setTimeout(() => {
      // Mock translations - in a real app, this would come from an API
      const mockTranslations: Record<string, string> = {
        "Hello": "नमस्ते",
        "Thank you": "धन्यवाद",
        "Welcome": "स्वागतम्",
        "How are you?": "कथमस्ति भवान्?",
        // For demo purposes
        "One who speaks the truth": "सत्यवादी",
        "The world is a family": "वसुधैव कुटुम्बकम्",
        "Knowledge is wealth": "विद्या धनम्",
        "Peace": "शान्तिः",
        "Wisdom": "ज्ञानम्"
      };
      
      // Default mock translation if input doesn't match our examples
      let result = "";
      
      if (direction === "english-to-sanskrit") {
        result = mockTranslations[inputText] || "संस्कृत अनुवाद";
      } else {
        // Reverse the object for sanskrit to english
        const reverseMockTranslations: Record<string, string> = {};
        Object.entries(mockTranslations).forEach(([eng, sans]) => {
          reverseMockTranslations[sans] = eng;
        });
        result = reverseMockTranslations[inputText] || "English translation";
      }
      
      setTranslatedText(result);
      setIsLoading(false);
    }, 1000);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (!isBookmarked) {
      toast.success("Translation saved to your bookmarks");
    } else {
      toast.success("Translation removed from your bookmarks");
    }
  };

  const getTransliteratedText = (text: string): string => {
    // This is a placeholder function - in a real app this would use a proper transliteration library
    // For demo purposes we're just returning a mock transliteration
    if (text === "नमस्ते") return "namaste";
    if (text === "धन्यवाद") return "dhanyavād";
    if (text === "स्वागतम्") return "svāgatam";
    if (text === "कथमस्ति भवान्?") return "kathamasti bhavān?";
    if (text === "सत्यवादी") return "satyavādī";
    if (text === "वसुधैव कुटुम्बकम्") return "vasudhaiva kuṭumbakam";
    if (text === "विद्या धनम्") return "vidyā dhanam";
    if (text === "शान्तिः") return "śāntiḥ";
    return "transliterated text";
  };

  const displayOutputText = () => {
    if (!translatedText) return "";
    if (displayLanguage === "english" && direction === "sanskrit-to-english") {
      return translatedText;
    }
    if (displayLanguage === "sanskrit" && direction === "english-to-sanskrit") {
      return translatedText;
    }
    if (displayLanguage === "transliterated" && direction === "english-to-sanskrit") {
      return getTransliteratedText(translatedText);
    }
    return translatedText; // Default fallback
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium">Sanskrit Translation Tool</h2>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={toggleBookmark}
          className={isBookmarked ? "text-saffron" : "text-gray-400"}
        >
          <Bookmark className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="space-y-6">
        {/* Translation Direction */}
        <div>
          <Label htmlFor="direction">Translation Direction</Label>
          <Select 
            value={direction} 
            onValueChange={(value) => setDirection(value as TranslationDirection)}
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english-to-sanskrit">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>English to Sanskrit</span>
                </div>
              </SelectItem>
              <SelectItem value="sanskrit-to-english">
                <div className="flex items-center">
                  <Translate className="h-4 w-4 mr-2" />
                  <span>Sanskrit to English</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Input Area */}
        <div>
          <Label htmlFor="inputText">
            {direction === "english-to-sanskrit" ? "English Text" : "Sanskrit Text"}
          </Label>
          <Textarea
            id="inputText"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={direction === "english-to-sanskrit" 
              ? "Enter English text to translate..." 
              : "Enter Sanskrit text to translate..."}
            className={`mt-1.5 min-h-32 ${direction === "sanskrit-to-english" ? "font-sanskrit" : ""}`}
          />
        </div>
        
        {/* Translate Button */}
        <div className="flex justify-center">
          <Button 
            onClick={translateText} 
            className="bg-saffron hover:bg-saffron/90 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>Translating...</>
            ) : (
              <>
                Translate
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
        
        {/* Output Area */}
        {translatedText && (
          <div className="border-t pt-6 mt-6">
            <div className="flex justify-between items-center mb-3">
              <Label>
                {direction === "english-to-sanskrit" ? "Sanskrit Translation" : "English Translation"}
              </Label>
              
              {/* Display options for Sanskrit text */}
              {direction === "english-to-sanskrit" && (
                <LanguageToggle 
                  currentLanguage={displayLanguage}
                  onLanguageChange={setDisplayLanguage}
                />
              )}
            </div>
            
            {/* Font size controls */}
            <div className="flex items-center justify-end mb-3 space-x-2">
              <Label htmlFor="font-size" className="text-sm">Font Size:</Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                className="h-7 w-7 p-0"
              >
                -
              </Button>
              <span className="text-sm w-6 text-center">{fontSize}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFontSize(Math.min(28, fontSize + 2))}
                className="h-7 w-7 p-0"
              >
                +
              </Button>
            </div>
            
            {/* Output text */}
            <div 
              className={`bg-cream rounded-lg p-4 min-h-32 flex items-center justify-center
                ${displayLanguage === "sanskrit" || (direction === "sanskrit-to-english" && displayLanguage !== "english") ? "font-sanskrit" : ""}
              `}
            >
              <p style={{ fontSize: `${fontSize}px` }} className="leading-relaxed">
                {displayOutputText()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
