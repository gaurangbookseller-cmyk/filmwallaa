import React, { useState, useEffect } from 'react';
import { Languages, Loader2, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import translationService, { SUPPORTED_LANGUAGES } from '../services/translationService';

const LanguageTranslator = ({ 
  originalText, 
  onTranslated, 
  className = '',
  size = 'default',
  showBadge = true 
}) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translatedText, setTranslatedText] = useState(originalText);
  const [error, setError] = useState(null);

  const handleTranslate = async (targetLanguageCode) => {
    if (targetLanguageCode === 'en') {
      // Reset to original English
      setTranslatedText(originalText);
      setCurrentLanguage('en');
      if (onTranslated) onTranslated(originalText, 'en');
      return;
    }

    setIsTranslating(true);
    setError(null);

    try {
      const translated = await translationService.translateText(
        originalText, 
        targetLanguageCode, 
        'en'
      );
      
      setTranslatedText(translated);
      setCurrentLanguage(targetLanguageCode);
      
      if (onTranslated) {
        onTranslated(translated, targetLanguageCode);
      }
    } catch (err) {
      setError('Translation failed. Please try again.');
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Update translated text when original text changes
  useEffect(() => {
    if (currentLanguage === 'en') {
      setTranslatedText(originalText);
    } else {
      // Re-translate with new text
      handleTranslate(currentLanguage);
    }
  }, [originalText]);

  const currentLang = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage);
  const sizeClasses = {
    small: 'text-xs',
    default: 'text-sm',
    large: 'text-base'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Language Badge */}
      {showBadge && currentLanguage !== 'en' && (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
          {currentLang?.native || currentLang?.name}
        </Badge>
      )}

      {/* Translation Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size={size === 'small' ? 'sm' : 'default'}
            className={`${sizeClasses[size]} flex items-center space-x-1 border-gray-300 hover:border-orange-400`}
            disabled={isTranslating}
          >
            {isTranslating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Translating...</span>
              </>
            ) : (
              <>
                <Languages className="h-4 w-4" />
                <span>Translate</span>
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-48">
          <div className="px-2 py-1 text-xs font-semibold text-gray-500 border-b">
            Choose Language
          </div>
          
          {SUPPORTED_LANGUAGES.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleTranslate(language.code)}
              className={`cursor-pointer ${
                currentLanguage === language.code 
                  ? 'bg-orange-50 text-orange-700' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span>{language.name}</span>
                <span className="text-xs text-gray-500">{language.native}</span>
              </div>
            </DropdownMenuItem>
          ))}
          
          {currentLanguage !== 'en' && (
            <>
              <div className="border-t my-1" />
              <DropdownMenuItem
                onClick={() => handleTranslate('en')}
                className="cursor-pointer hover:bg-gray-50 text-blue-600"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to English
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Error Message */}
      {error && (
        <span className="text-xs text-red-600">{error}</span>
      )}
    </div>
  );
};

export default LanguageTranslator;