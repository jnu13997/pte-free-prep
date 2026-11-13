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
}

export const DescribeImageItem: React.FC<DescribeImageItemProps> = ({
  imageUrl,
  imageAlt = 'PTE Chart Image',
  chartDescription,
  prepTimeSeconds = 25,
  recordingSeconds = 40,
  onRecordingComplete,
}) => {
  const [status, setStatus] = useState<SpeakingState>('COUNTDOWN');
  const [secondsLeft, setSecondsLeft] = useState(prepTimeSeconds);
  const [volumeLevel, setVolumeLevel] = useState(0);

  const recorderRef = useRef<AudioRecorderEngine | null>(null);
  const speechRef = useRef<SpeechRecognitionService | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (status === 'COUNTDOWN') {
      if (secondsLeft > 0) {
        timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
      } else {
        playCountdownBeep().then(() => {
          setStatus('RECORDING');
          setSecondsLeft(recordingSeconds);
          startRecording();
        });
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

  const startRecording = async () => {
    recorderRef.current = new AudioRecorderEngine();
    speechRef.current = new SpeechRecognitionService();
    startTimeRef.current = Date.now();

    speechRef.current.start(
      () => {},
      () => {}
    );

    try {
      await recorderRef.current.start(
        (vol) => setVolumeLevel(vol),
        () => finishRecording()
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
      transcript = speechRef.current.stop();
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
          <img
            src={imageUrl}
            alt={imageAlt}
            className="max-h-80 max-w-full object-contain rounded border border-gray-200 shadow-xs"
          />
        ) : (
          <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded p-6 text-center">
            <h3 className="font-bold text-gray-700 mb-2">Annual Global Renewable Energy Adoption</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between border-b pb-1">
                <span>Solar PV (2020 - 2025):</span>
                <span className="font-semibold text-pearson-blue">32% Increase</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span>Wind Power (2020 - 2025):</span>
                <span className="font-semibold text-pearson-blue">24% Increase</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span>Hydroelectric:</span>
                <span className="font-semibold text-gray-700">Stable at 45% Share</span>
              </div>
            </div>
            {chartDescription && <p className="text-xs text-gray-500 mt-3">{chartDescription}</p>}
          </div>
        )}
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
