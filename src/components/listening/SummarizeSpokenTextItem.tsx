import React, { useState, useEffect } from 'react';
import { AudioPlayerStatusBox, AudioPlayState } from './AudioPlayerStatusBox';
import { WritingEditor } from '../writing/WritingEditor';

export interface SummarizeSpokenTextItemProps {
  spokenPromptText: string;
  audioPromptUrl?: string;
  value: string;
  onChange: (val: string) => void;
}

export const SummarizeSpokenTextItem: React.FC<SummarizeSpokenTextItemProps> = ({
  spokenPromptText,
  audioPromptUrl,
  value,
  onChange,
}) => {
  const [playState, setPlayState] = useState<AudioPlayState>('PREPARING');
  const [secondsUntilPlay, setSecondsUntilPlay] = useState(5);
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
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(spokenPromptText);
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
          You will hear a short lecture. Write a summary for a fellow student who was not present at the lecture. You should write 50–70 words.
        </h2>
        <p className="text-xs text-gray-500">
          You have 10 minutes to finish this task. Your response will be judged on the quality of your writing and on how well your response presents the key points.
        </p>
      </div>

      <AudioPlayerStatusBox
        status={playState}
        secondsUntilPlay={secondsUntilPlay}
        progressPercent={progressPercent}
        volume={volume}
        onVolumeChange={setVolume}
      />

      <WritingEditor
        value={value}
        onChange={onChange}
        minWords={50}
        maxWords={70}
        placeholder="Write your summary here (50 - 70 words)..."
        rows={6}
      />
    </div>
  );
};
