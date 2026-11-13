import React, { useEffect, useState, useRef } from 'react';
import { SpeakingStatusBox, SpeakingState } from './SpeakingStatusBox';
import { playCountdownBeep } from '../../services/audio/beepSynthesizer';
import { AudioRecorderEngine } from '../../services/audio/recorderEngine';
import { SpeechRecognitionService } from '../../services/audio/speechRecognition';

export interface DescribeImageItemProps {
  imageUrl?: string;
  imageAlt?: string;
  chartDescription?: string;
  prepTimeSeconds?: number;
  recordingSeconds?: number;
  onRecordingComplete: (audioBlob: Blob, transcript: string, durationSeconds: number) => void;
  onTranscriptUpdate?: (transcript: string) => void;
}

export const DescribeImageItem: React.FC<DescribeImageItemProps> = ({
  imageUrl,
  imageAlt = 'PTE Chart Image',
  chartDescription,
  prepTimeSeconds = 25,
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
      startRecording();
    });
  };

  const handleFinishRecording = () => {
    if (status !== 'RECORDING') return;
    finishRecording();
  };

  const startRecording = async () => {
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
        false
      );
    } catch {
      // mic error
    }
  };

  const finishRecording = async () => {
    if (status === 'COMPLETED') return;
    setStatus('COMPLETED');
    const duration = (Date.now() - startTimeRef.current) / 1000;

    let transcript = '';
    if (speechRef.current) {
      transcript = speechRef.current.stop() || liveTranscript;
    }
    if (recorderRef.current) {
      const { blob } = await recorderRef.current.stop();
      onRecordingComplete(blob, transcript, Math.max(1, duration));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white border-l-4 border-pearson-blue p-4 rounded shadow-sm">
        <h2 className="text-base font-bold text-gray-800 mb-1">
          Look at the image below. In {prepTimeSeconds} seconds, please speak into the microphone and describe in detail what the image is showing.
        </h2>
        <p className="text-xs text-gray-500">You will have {recordingSeconds} seconds to give your response.</p>
      </div>

      <div className="bg-white p-6 rounded border border-pearson-borderGray shadow-sm flex flex-col items-center justify-center min-h-[300px]">
        {imageUrl ? (
          <img src={imageUrl} alt={imageAlt} className="max-h-72 max-w-full object-contain rounded" />
        ) : (
          <div className="w-full max-w-lg bg-gray-50 p-6 rounded border border-gray-200 text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">PTE Visual Data Representation</span>
            <div className="text-sm font-semibold text-gray-700 bg-white p-4 rounded border border-gray-200 shadow-xs leading-relaxed">
              {chartDescription || 'Provincial electricity generation by source in Canada: Hydroelectric 61%, Nuclear 15%, Wind & Solar 11%, Natural Gas 11%, Coal 2%.'}
            </div>
            <p className="text-xs text-gray-500">
              Note trends, highest category, lowest category, and summarize in your response.
            </p>
          </div>
        )}
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
