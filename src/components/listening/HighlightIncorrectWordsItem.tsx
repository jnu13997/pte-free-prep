import React, { useState, useEffect } from 'react';
import { AudioPlayerStatusBox, AudioPlayState } from './AudioPlayerStatusBox';

export interface HighlightIncorrectWordsItemProps {
  transcript: string;
  audioPromptUrl?: string;
  highlightedIndices: number[];
  onChange: (indices: number[]) => void;
}

export const HighlightIncorrectWordsItem: React.FC<HighlightIncorrectWordsItemProps> = ({
  transcript,
  audioPromptUrl,
  highlightedIndices,
  onChange,
}) => {
  const [playState, setPlayState] = useState<AudioPlayState>('PREPARING');
  const [secondsUntilPlay, setSecondsUntilPlay] = useState(7);
  const [progressPercent, setProgressPercent] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const words = transcript.split(/\s+/).filter(Boolean);

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
      const utterance = new SpeechSynthesisUtterance(transcript);
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
      }, 5000);
    }
  };

  const toggleWordHighlight = (index: number) => {
    if (highlightedIndices.includes(index)) {
      onChange(highlightedIndices.filter((i) => i !== index));
    } else {
      onChange([...highlightedIndices, index]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none">
      <div className="bg-white border-l-4 border-pearson-blue p-4 rounded shadow-sm">
        <h2 className="text-base font-bold text-gray-800 mb-1">
          You will hear a recording. Below is a transcript of the recording. Some words in the transcript differ from what the speaker(s) said. Please click on the words that are different.
        </h2>
      </div>

      <AudioPlayerStatusBox
        status={playState}
        secondsUntilPlay={secondsUntilPlay}
        progressPercent={progressPercent}
        volume={volume}
        onVolumeChange={setVolume}
      />

      <div className="bg-white p-8 rounded border border-pearson-borderGray shadow-sm leading-loose text-base text-gray-800">
        {words.map((word, index) => {
          const isHighlighted = highlightedIndices.includes(index);
          return (
            <span
              key={index}
              onClick={() => toggleWordHighlight(index)}
              className={`inline-block px-1 py-0.5 mx-0.5 rounded cursor-pointer transition-colors ${
                isHighlighted
                  ? 'bg-yellow-200 text-yellow-900 font-semibold shadow-xs'
                  : 'hover:bg-gray-100'
              }`}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
