import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useOnboardingStore } from '../../lib/stores/onboardingStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const commonDislikes = [
  'cebolla', 'pimiento', 'berenjena', 'hígado', 'riñones', 
  'aceitunas', 'anchoas', 'champiñones', 'espárragos', 'brócoli',
  'coliflor', 'coles de bruselas', 'remolacha', 'pepinillos', 'cilantro',
  'ajo', 'jengibre', 'picante', 'curry', 'mostaza',
  'mayonesa', 'ketchup', 'vinagre', 'coco', 'plátano'
];

export default function Step7Dislikes() {
  const [, setLocation] = useLocation();
  const { data, updateData, nextStep, prevStep } = useOnboardingStore();
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const dislikes = data.dislikes || [];

  const filteredSuggestions = commonDislikes.filter(
    item => 
      item.toLowerCase().includes(inputValue.toLowerCase()) &&
      !dislikes.includes(item)
  );

  const addDislike = (value: string) => {
    const trimmed = value.trim().toLowerCase();
    if (trimmed && !dislikes.includes(trimmed)) {
      updateData({ dislikes: [...dislikes, trimmed] });
    }
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeDislike = (value: string) => {
    updateData({ dislikes: dislikes.filter(d => d !== value) });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addDislike(inputValue);
    }
  };

  const handleNext = () => {
    nextStep();
    setLocation('/onboarding/8');
  };

  const handleBack = () => {
    prevStep();
    setLocation('/onboarding/6');
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="card-tcf fade-in">
      <div className="text-center mb-8">
        <img 
          src="/logos/logo.png" 
          alt="TheCookFlow" 
          className="w-16 h-auto mx-auto mb-2"
        />
        <h3 className="text-2xl text-chalk">The CookFlow</h3>
      </div>

      <h2 className="text-3xl md:text-4xl text-chalk text-center mb-4">
        ¿Hay alimentos que no te gusten?
      </h2>

      <p className="text-gray-300 text-center mb-8">
        Los evitaremos en tus recetas (puedes dejarlo vacío)
      </p>

      <div className="text-center mb-6">
        <span className="text-4xl">🚫🥦</span>
      </div>

      <div className="relative mb-6">
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un alimento..."
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-500"
          data-testid="input-dislike"
        />
        
        {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-[#2a2a2a] border border-white/20 rounded-lg max-h-48 overflow-y-auto">
            {filteredSuggestions.slice(0, 8).map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => addDislike(suggestion)}
                className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors capitalize"
                data-testid={`suggestion-${suggestion}`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4">
        <p className="text-gray-400 text-sm mb-2">Sugerencias comunes:</p>
        <div className="flex flex-wrap gap-2">
          {commonDislikes.slice(0, 10).filter(s => !dislikes.includes(s)).map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => addDislike(suggestion)}
              className="px-3 py-1 rounded-full bg-white/10 text-gray-300 text-sm hover:bg-white/20 transition-colors capitalize"
              data-testid={`quick-${suggestion}`}
            >
              + {suggestion}
            </button>
          ))}
        </div>
      </div>

      {dislikes.length > 0 && (
        <div className="mb-8 p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-gray-400 text-sm mb-2">Alimentos que evitaremos:</p>
          <div className="flex flex-wrap gap-2">
            {dislikes.map((dislike) => (
              <span
                key={dislike}
                className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-sm flex items-center gap-2 capitalize"
              >
                🚫 {dislike}
                <button
                  onClick={() => removeDislike(dislike)}
                  className="hover:text-orange-300 font-bold"
                  data-testid={`remove-${dislike}`}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleBack}
          className="px-8"
          data-testid="button-back"
        >
          Atrás
        </Button>
        <button
          onClick={handleNext}
          className="btn-siguiente px-8"
          data-testid="button-next"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
