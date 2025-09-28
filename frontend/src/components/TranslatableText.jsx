import React, { useState } from 'react';
import LanguageTranslator from './LanguageTranslator';

const TranslatableText = ({ 
  children, 
  originalText,
  className = '',
  translatorClassName = '',
  showTranslatorInline = false,
  allowTranslation = true
}) => {
  const [displayText, setDisplayText] = useState(originalText || children);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const handleTranslated = (translatedText, languageCode) => {
    setDisplayText(translatedText);
    setCurrentLanguage(languageCode);
  };

  const textToUse = originalText || (typeof children === 'string' ? children : '');

  if (!allowTranslation) {
    return <span className={className}>{children}</span>;
  }

  return (
    <div className="space-y-2">
      {/* Translated Text */}
      <div className={className}>
        {displayText}
      </div>
      
      {/* Translation Controls */}
      {showTranslatorInline && textToUse && (
        <LanguageTranslator
          originalText={textToUse}
          onTranslated={handleTranslated}
          className={`${translatorClassName} flex justify-start`}
          size="small"
          showBadge={currentLanguage !== 'en'}
        />
      )}
    </div>
  );
};

export default TranslatableText;