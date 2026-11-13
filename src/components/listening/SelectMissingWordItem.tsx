import React, { useState, useEffect } from 'react';
import { AudioPlayerStatusBox, AudioPlayState } from './AudioPlayerStatusBox';
import { playCountdownBeep } from '../../services/audio/beepSynthesizer';
import { naturalSpeech } from '../../services/audio/naturalSpeechService';

export interface SelectMissingWordItemProps {
  sentenceWithBeep: string;
  audioPromptUrl?: string;
  options: { id: string; text: string }[];
  selectedOptionId: string | null;
  onChange: (id: string) => void;
}

export const SelectMissingWordItem: React.FC<SelectMissingWordItemProps> = ({
  sentenceWithBeep,
  audioPromptUrl,
  options,
  selectedOptionId,
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
      naturalSpeech.cancel();
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
        playCountdownBeep(800, 500).then(() => {
          setPlayState('STOPPED');
          setProgressPercent(100);
        });
      };
      audio.play().catch(() => fallbackTtsWithBeep());
    } else {
      fallbackTtsWithBeep();
    }
  };

  const fallbackTtsWithBeep = () => {
    naturalSpeech.speak(sentenceWithBeep, {
      volume,
      onEnd: () => {
        playCountdownBeep(800, 500).then(() => {
          setPlayState('STOPPED');
          setProgressPercent(100);
        });
      },
      onError: () => {
        setPlayState('STOPPED');
        setProgressPercent(100);
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white border-l-4 border-pearson-blue p-4 rounded shadow-sm">
        <h2 className="text-base font-bold text-gray-800 mb-1">
          You will hear a recording about academic topics. At the end of the recording the last word or group of words has been replaced by a beep. Select the correct option to complete the recording.
        </h2>
      </div>

      <AudioPlayerStatusBox
        status={playState}
        secondsUntilPlay={secondsUntilPlay}
        progressPercent={progressPercent}
        volume={volume}
        onVolumeChange={setVolume}
      />

      <div className="bg-white p-6 rounded border border-pearson-borderGray shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-sm mb-2">Options:</h3>
        <div className="space-y-2.5">
          {options.map((opt) => (
            <div
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`p-3.5 rounded border cursor-pointer flex items-center space-x-3 transition-colors ${
                selectedOptionId === opt.id
                  ? 'border-pearson-blue bg-blue-50/70 text-blue-900'
                  : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-800'
              }`}
            >
              <input
                type="radio"
                checked={selectedOptionId === opt.id}
                onChange={() => onChange(opt.id)}
                className="h-4 w-4 text-pearson-blue focus:ring-blue-400 border-gray-300 rounded cursor-pointer"
              />
              <span className="text-sm font-medium">{opt.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
