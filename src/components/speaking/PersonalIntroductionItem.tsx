import React, { useEffect, useState, useRef } from 'react';
import { SpeakingStatusBox, SpeakingState } from './SpeakingStatusBox';
import { playCountdownBeep } from '../../services/audio/beepSynthesizer';
import { AudioRecorderEngine } from '../../services/audio/recorderEngine';
import { SpeechRecognitionService } from '../../services/audio/speechRecognition';

export interface PersonalIntroductionItemProps {
  promptText: string;
  prepTimeSeconds?: number;
  recordingSeconds?: number;
  onRecordingComplete: (audioBlob: Blob, transcript: string, durationSeconds: number) => void;
  onTranscriptUpdate?: (transcript: string) => void;
}

export const PersonalIntroductionItem: React.FC<PersonalIntroductionItemProps> = ({
  promptText,
  prepTimeSeconds = 25,
  recordingSeconds = 30,
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
        handleSkipPrep();
      }
    } else if (status === 'RECORDING') {
      if (secondsLeft > 0) {
        timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
      } else {
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
        () => {
          // Silence cutoff
          finishRecording();
        },
        false // Do not cut off initial silence aggressively during personal introduction
      );
    } catch {
      // Audio capture fallback handled
    }
  };

  const finishRecording = async () => {
    if (status === 'COMPLETED') return;
    setStatus('COMPLETED');

    const duration = (Date.now() - (startTimeRef.current || Date.now())) / 1000;
    const finalTranscript = speechRef.current?.stop() || liveTranscript;

    let blob = new Blob([], { type: 'audio/webm' });
    if (recorderRef.current) {
      const res = await recorderRef.current.stop();
      blob = res.blob;
    }

    onRecordingComplete(blob, finalTranscript, Math.max(1, duration));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Pearson Official Instruction Banner */}
      <div className="bg-white border-l-4 border-pearson-blue p-4 rounded shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-800 mb-1">
              Read the prompt below. In 25 seconds, you must speak into the microphone to introduce yourself.
            </h2>
            <p className="text-xs text-pearson-blue font-semibold">
              Note: This item is not scored and is sent to institutions together with your Score Report.
            </p>
          </div>
          <span className="bg-blue-100 text-pearson-blue text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Unscored Item
          </span>
        </div>
      </div>

      {/* Recording Status Box */}
      <SpeakingStatusBox
        status={status}
        secondsLeft={secondsLeft}
        volumeLevel={volumeLevel}
        totalRecordingSeconds={recordingSeconds}
        onSkipPrep={handleSkipPrep}
        onFinishRecording={handleFinishRecording}
      />

      {/* Prompt Card */}
      <div className="bg-white p-8 rounded border border-pearson-borderGray shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
          Prompt
        </h3>
        <p className="text-lg text-gray-900 leading-relaxed font-medium">
          {promptText}
        </p>

        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600 space-y-1.5">
          <p className="font-semibold text-gray-700">Suggestions for your introduction:</p>
          <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 pl-1">
            <li>Your background, education, and current occupation</li>
            <li>Your reasons for taking the PTE English test</li>
            <li>Your future goals and aspirations for work or study</li>
          </ul>
        </div>
      </div>

      {/* Live Transcript Feedback */}
      {liveTranscript && (
        <div className="bg-blue-50/70 border border-blue-200 p-4 rounded text-sm text-blue-900">
          <span className="font-semibold block text-xs uppercase tracking-wider mb-1 text-blue-700">
            Live Microphone Transcript:
          </span>
          <p className="italic">{liveTranscript}</p>
        </div>
      )}
    </div>
  );
};
