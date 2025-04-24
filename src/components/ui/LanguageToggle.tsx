
import React from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Languages } from "lucide-react";  // Confirmed correct import
import { cn } from "@/lib/utils";

type LanguageOptions = "english" | "sanskrit" | "transliterated";

interface LanguageToggleProps {
  currentLanguage: LanguageOptions;
  onLanguageChange: (language: LanguageOptions) => void;
  className?: string;
}

export function LanguageToggle({ 
  currentLanguage, 
  onLanguageChange,
  className
}: LanguageToggleProps) {
  return (
    <div className={cn("flex items-center space-x-2 rounded-md border p-1", className)}>
      <Button 
        variant={currentLanguage === "english" ? "default" : "ghost"}
        size="sm"
        onClick={() => onLanguageChange("english")}
        className="flex items-center"
      >
        <BookOpen className="h-4 w-4 mr-2" />
        English
      </Button>
      <Button
        variant={currentLanguage === "sanskrit" ? "default" : "ghost"}
        size="sm"
        onClick={() => onLanguageChange("sanskrit")}
        className="flex items-center"
      >
        <Languages className="h-4 w-4 mr-2" />
        देवनागरी
      </Button>
      <Button
        variant={currentLanguage === "transliterated" ? "default" : "ghost"}
        size="sm"
        onClick={() => onLanguageChange("transliterated")}
        className="flex items-center text-xs md:text-sm"
      >
        <Languages className="h-4 w-4 mr-2" />
        Transliterated
      </Button>
    </div>
  );
}
