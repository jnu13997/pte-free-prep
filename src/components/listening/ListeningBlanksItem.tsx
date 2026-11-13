import React, { useState, useEffect } from 'react';
import { AudioPlayerStatusBox, AudioPlayState } from './AudioPlayerStatusBox';

export interface ListeningBlanksItemProps {
  passageSegments: string[]; // e.g. ["The project was ", " by the local government to improve ", " conditions."]
  audioPromptUrl?: string;
  transcriptForFallback?: string;
  blankValues: Record<number, string>;
  onChange: (blankIndex: number, val: string) => void;
}

export const ListeningBlanksItem: React.FC<ListeningBlanksItemProps> = ({
  passageSegments,
  audioPromptUrl,
  transcriptForFallback,
  blankValues,
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
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && transcriptForFallback) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(transcriptForFallback);
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white border-l-4 border-pearson-blue p-4 rounded shadow-sm">
        <h2 className="text-base font-bold text-gray-800 mb-1">
          You will hear a recording. Type the missing words in each blank.
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
        {passageSegments.map((segment, idx) => {
          const isBlank = idx < passageSegments.length - 1;
          return (
            <React.Fragment key={idx}>
              <span>{segment}</span>
              {isBlank && (
                <input
                  type="text"
                  value={blankValues[idx] || ''}
                  onChange={(e) => onChange(idx, e.target.value)}
                  className="mx-1.5 px-2.5 py-0.5 w-32 border-b-2 border-pearson-blue bg-blue-50/40 text-center text-sm font-semibold text-gray-900 focus:outline-none focus:bg-blue-100 transition-colors"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
