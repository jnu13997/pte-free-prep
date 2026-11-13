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
  onTranscriptUpdate?: (transcript: string) => void;
}

export const ReadAloudItem: React.FC<ReadAloudItemProps> = ({
  passageText,
  prepTimeSeconds = 35,
  recordingSeconds = 40,
  onRecordingComplete,
  onTranscriptUpdate,
}) => {
  const [status, setStatus] = useState<SpeakingState>('COUNTDOWN');
  const [secondsLeft, setSecondsLeft] = useState(prepTimeSeconds);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');

  const recorderRef = useRef<AudioRecorderEngine | null>(null);
  const speechRef = useRef<SpeechRecognitionService | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (recorderRef.current) {
        recorderRef.current.stop();
      }
      if (speechRef.current) {
        speechRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (status === 'COUNTDOWN') {
      if (secondsLeft > 0) {
        timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
      } else {
        // Prep countdown ended -> play beep and switch to RECORDING
        handleSkipPrep();
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

  const handleSkipPrep = () => {
    if (status !== 'COUNTDOWN') return;
    playCountdownBeep().then(() => {
      setStatus('RECORDING');
      setSecondsLeft(recordingSeconds);
      startAudioCapture();
    });
  };

  const handleFinishRecording = () => {
    if (status !== 'RECORDING') return;
    finishRecording();
  };

  const startAudioCapture = async () => {
    recorderRef.current = new AudioRecorderEngine();
    speechRef.current = new SpeechRecognitionService();
    startTimeRef.current = Date.now();

    speechRef.current.start(
      (interim) => {
        setLiveTranscript(interim);
        if (onTranscriptUpdate) onTranscriptUpdate(interim);
      },
      (finalText) => {
        setLiveTranscript(finalText);
        if (onTranscriptUpdate) onTranscriptUpdate(finalText);
      }
    );

    try {
      await recorderRef.current.start(
        (vol) => setVolumeLevel(vol),
        () => finishRecording(),
        false // Do not prematurely cut off candidates mid-speech
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
        onSkipPrep={handleSkipPrep}
        onFinishRecording={handleFinishRecording}
      />
    </div>
  );
};
