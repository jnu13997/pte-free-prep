import React, { useState, useEffect } from 'react';
import { naturalSpeech, AccentType } from '../../services/audio/naturalSpeechService';
import { Volume2, Check, Sparkles, X, Play, Square } from 'lucide-react';

export interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({ isOpen, onClose }) => {
  const [selectedAccent, setSelectedAccent] = useState<AccentType>(naturalSpeech.getPreferredAccent());
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [detectedVoicesCount, setDetectedVoicesCount] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedAccent(naturalSpeech.getPreferredAccent());
      naturalSpeech.getVoices().then((voices) => {
        setDetectedVoicesCount(voices.length);
      });
    } else {
      naturalSpeech.cancel();
      setIsTestingVoice(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAccentChange = (accent: AccentType) => {
    setSelectedAccent(accent);
    naturalSpeech.setPreferredAccent(accent);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleTestVoice = async () => {
    if (isTestingVoice) {
      naturalSpeech.cancel();
      setIsTestingVoice(false);
      return;
    }

    setIsTestingVoice(true);
    let sampleText = "The main campus library will extend its opening hours during the upcoming examination period.";
    if (selectedAccent === 'canadian') {
      sampleText = "Welcome to the PTE Core preparation platform. You are travelling on a business trip to Vancouver.";
    } else if (selectedAccent === 'british') {
      sampleText = "Scholarly citations must be formatted accurately according to the departmental publication guidelines.";
    } else if (selectedAccent === 'australian') {
      sampleText = "All international applicants must submit their verified documentation before the priority deadline.";
    }

    await naturalSpeech.speak(sampleText, {
      accent: selectedAccent,
      rate: 0.94,
      onEnd: () => setIsTestingVoice(false),
      onError: () => setIsTestingVoice(false),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-gray-200">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center space-x-2 text-pearson-navy">
            <Volume2 className="w-5 h-5 text-pearson-blue" />
            <h3 className="font-bold text-lg">PTE Voice & Accent Settings</h3>
          </div>
          <button
            onClick={() => {
              naturalSpeech.cancel();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Audio Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-3.5 rounded-lg flex items-start space-x-3 text-xs text-blue-900">
          <Sparkles className="w-5 h-5 text-pearson-blue shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold mb-0.5">Studio-Grade Audio Prompts Enabled</strong>
            Mock exams are pre-rendered with high-definition neural studio voices (Canadian, British, Australian, and American) to eliminate robotic browser artifacts.
          </div>
        </div>

        {/* Accent Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Preferred Regional Accent
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleAccentChange('canadian')}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                selectedAccent === 'canadian'
                  ? 'border-pearson-blue bg-blue-50/70 text-pearson-blue ring-1 ring-pearson-blue font-semibold'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="text-sm font-bold flex items-center justify-between">
                <span>Canadian English</span>
                {selectedAccent === 'canadian' && <Check className="w-4 h-4 text-pearson-blue" />}
              </div>
              <span className="text-[11px] text-gray-500 block mt-0.5">PTE Core / IRCC Standard</span>
            </button>

            <button
              onClick={() => handleAccentChange('british')}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                selectedAccent === 'british'
                  ? 'border-pearson-blue bg-blue-50/70 text-pearson-blue ring-1 ring-pearson-blue font-semibold'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="text-sm font-bold flex items-center justify-between">
                <span>British English</span>
                {selectedAccent === 'british' && <Check className="w-4 h-4 text-pearson-blue" />}
              </div>
              <span className="text-[11px] text-gray-500 block mt-0.5">PTE Academic Standard</span>
            </button>

            <button
              onClick={() => handleAccentChange('australian')}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                selectedAccent === 'australian'
                  ? 'border-pearson-blue bg-blue-50/70 text-pearson-blue ring-1 ring-pearson-blue font-semibold'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="text-sm font-bold flex items-center justify-between">
                <span>Australian English</span>
                {selectedAccent === 'australian' && <Check className="w-4 h-4 text-pearson-blue" />}
              </div>
              <span className="text-[11px] text-gray-500 block mt-0.5">Pearson Global Audio</span>
            </button>

            <button
              onClick={() => handleAccentChange('american')}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                selectedAccent === 'american'
                  ? 'border-pearson-blue bg-blue-50/70 text-pearson-blue ring-1 ring-pearson-blue font-semibold'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="text-sm font-bold flex items-center justify-between">
                <span>North American</span>
                {selectedAccent === 'american' && <Check className="w-4 h-4 text-pearson-blue" />}
              </div>
              <span className="text-[11px] text-gray-500 block mt-0.5">Clear General Dialect</span>
            </button>
          </div>
        </div>

        {/* Live Audio Test */}
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-gray-800">Test Voice Pronunciation</div>
            <p className="text-xs text-gray-500">
              Listen to a sample phrase in {selectedAccent.charAt(0).toUpperCase() + selectedAccent.slice(1)} accent.
            </p>
          </div>

          <button
            onClick={handleTestVoice}
            className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer ${
              isTestingVoice
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                : 'bg-pearson-blue hover:bg-[#005a9e] text-white shadow-xs'
            }`}
          >
            {isTestingVoice ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Sample</span>
              </>
            )}
          </button>
        </div>

        {savedSuccess && (
          <div className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded flex items-center space-x-1.5 border border-emerald-200">
            <Check className="w-4 h-4" />
            <span>Accent preference saved!</span>
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-gray-400 border-t pt-3">
          <span>{detectedVoicesCount} system voice packages detected</span>
          <button
            onClick={() => {
              naturalSpeech.cancel();
              onClose();
            }}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-semibold text-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
