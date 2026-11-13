import React, { useEffect, useState, useRef } from 'react';
import { SpeakingStatusBox, SpeakingState } from './SpeakingStatusBox';
import { playCountdownBeep } from '../../services/audio/beepSynthesizer';
import { AudioRecorderEngine } from '../../services/audio/recorderEngine';
import { SpeechRecognitionService } from '../../services/audio/speechRecognition';

export interface ReadAloudItemProps {
  passageText: string;
  prepTimeSeconds?: number;
  recordingSeconds?: number;
  onRecordingComplete: (audioBlob: Blob, transcript: string, durationSeconds: number) => void;
}

export const ReadAloudItem: React.FC<ReadAloudItemProps> = ({
  passageText,
  prepTimeSeconds = 35,
  recordingSeconds = 40,
  onRecordingComplete,
}) => {
  const [status, setStatus] = useState<SpeakingState>('COUNTDOWN');
  const [secondsLeft, setSecondsLeft] = useState(prepTimeSeconds);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');

  const recorderRef = useRef<AudioRecorderEngine | null>(null);
  const speechRef = useRef<SpeechRecognitionService | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (status === 'COUNTDOWN') {
      if (secondsLeft > 0) {
        timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
      } else {
        // Prep ended -> play beep and switch to RECORDING
        playCountdownBeep().then(() => {
          setStatus('RECORDING');
          setSecondsLeft(recordingSeconds);
          startAudioCapture();
        });
      }
    } else if (status === 'RECORDING') {
      if (secondsLeft > 0) {
        timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
      } else {
        // Recording window expired
        finishRecording();
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [status, secondsLeft]);

  const startAudioCapture = async () => {
    recorderRef.current = new AudioRecorderEngine();
    speechRef.current = new SpeechRecognitionService();
    startTimeRef.current = Date.now();

    speechRef.current.start(
      (interim) => setLiveTranscript(interim),
      (finalText) => setLiveTranscript(finalText)
    );

    try {
      await recorderRef.current.start(
        (vol) => setVolumeLevel(vol),
        () => {
          // 3-second silence auto-cutoff triggered!
          finishRecording();
        }
      );
    } catch {
      // mic error
    }
  };

  const finishRecording = async () => {
    if (status === 'COMPLETED') return;
    setStatus('COMPLETED');
    const durationSeconds = (Date.now() - startTimeRef.current) / 1000;

    let transcript = '';
    if (speechRef.current) {
      transcript = speechRef.current.stop() || liveTranscript;
    }

    if (recorderRef.current) {
      const { blob } = await recorderRef.current.stop();
      onRecordingComplete(blob, transcript, Math.max(1, durationSeconds));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white border-l-4 border-pearson-blue p-4 rounded shadow-sm">
        <h2 className="text-base font-bold text-gray-800 mb-1">
          Look at the text below. In {prepTimeSeconds} seconds, you must read this text aloud as naturally and clearly as possible.
        </h2>
        <p className="text-xs text-gray-500">You have {recordingSeconds} seconds to read aloud.</p>
      </div>

      <div className="bg-white p-8 rounded border border-pearson-borderGray shadow-sm min-h-[140px] flex items-center">
        <p className="text-lg text-gray-800 leading-relaxed font-serif select-text">
          {passageText}
        </p>
      </div>

      <SpeakingStatusBox
        status={status}
        secondsLeft={secondsLeft}
        volumeLevel={volumeLevel}
        totalRecordingSeconds={recordingSeconds}
      />
    </div>
  );
};
