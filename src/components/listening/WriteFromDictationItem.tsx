import React, { useState, useEffect } from 'react';
import { AudioPlayerStatusBox, AudioPlayState } from './AudioPlayerStatusBox';

export interface WriteFromDictationItemProps {
  sentencePrompt: string;
  audioPromptUrl?: string;
  value: string;
  onChange: (val: string) => void;
}

export const WriteFromDictationItem: React.FC<WriteFromDictationItemProps> = ({
  sentencePrompt,
  audioPromptUrl,
  value,
  onChange,
}) => {
  const [playState, setPlayState] = useState<AudioPlayState>('PREPARING');
  const [secondsUntilPlay, setSecondsUntilPlay] = useState(7);
  const [progressPercent, setProgressPercent] = useState(0);
  const [volume, setVolume] = useState(0.85);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (playState === 'PREPARING') {
      if (secondsUntilPlay > 0) {
        timer = setTimeout(() => setSecondsUntilPlay((s) => s - 1), 1000);
      } else {
        setPlayState('PLAYING');
        startAudioPlayback();
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [playState, secondsUntilPlay]);

  const startAudioPlayback = () => {
    if (audioPromptUrl) {
      const audio = new Audio(audioPromptUrl);
      audio.volume = volume;
      audio.ontimeupdate = () => {
        if (audio.duration) {
          setProgressPercent((audio.currentTime / audio.duration) * 100);
        }
      };
      audio.onended = () => {
        setPlayState('STOPPED');
        setProgressPercent(100);
      };
      audio.play().catch(() => fallbackTts());
    } else {
      fallbackTts();
    }
  };

  const fallbackTts = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sentencePrompt);
      utterance.volume = volume;
      utterance.rate = 0.95;
      utterance.onend = () => {
        setPlayState('STOPPED');
        setProgressPercent(100);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        setPlayState('STOPPED');
        setProgressPercent(100);
      }, 4000);
    }
  };

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white border-l-4 border-pearson-blue p-4 rounded shadow-sm">
        <h2 className="text-base font-bold text-gray-800 mb-1">
          You will hear a sentence. Type the sentence in the box below exactly as you hear it. Write as much of the sentence as you can. You will hear the sentence only once.
        </h2>
      </div>

      <AudioPlayerStatusBox
        status={playState}
        secondsUntilPlay={secondsUntilPlay}
        progressPercent={progressPercent}
        volume={volume}
        onVolumeChange={setVolume}
      />

      <div className="border border-pearson-borderGray rounded bg-white shadow-sm overflow-hidden">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          placeholder="Type the sentence here..."
          className="w-full p-4 font-sans text-base text-gray-800 focus:outline-none focus:ring-1 focus:ring-pearson-blue resize-none select-text"
        />
        <div className="bg-[#f8f9fa] border-t border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600">
          Total Word Count: {wordCount}
        </div>
      </div>
    </div>
  );
};
