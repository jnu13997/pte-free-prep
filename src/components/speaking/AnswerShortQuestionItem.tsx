import React, { useEffect, useState, useRef } from 'react';
import { SpeakingStatusBox, SpeakingState } from './SpeakingStatusBox';
import { playCountdownBeep } from '../../services/audio/beepSynthesizer';
import { AudioRecorderEngine } from '../../services/audio/recorderEngine';
import { SpeechRecognitionService } from '../../services/audio/speechRecognition';
import { Volume2 } from 'lucide-react';

export interface AnswerShortQuestionItemProps {
  questionText: string;
  audioPromptUrl?: string;
  recordingSeconds?: number;
  onRecordingComplete: (audioBlob: Blob, transcript: string, durationSeconds: number) => void;
}

export const AnswerShortQuestionItem: React.FC<AnswerShortQuestionItemProps> = ({
  questionText,
  audioPromptUrl,
  recordingSeconds = 10,
  onRecordingComplete,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);
  const [status, setStatus] = useState<SpeakingState>('IDLE');
  const [secondsLeft, setSecondsLeft] = useState(recordingSeconds);
  const [volumeLevel, setVolumeLevel] = useState(0);

  const recorderRef = useRef<AudioRecorderEngine | null>(null);
  const speechRef = useRef<SpeechRecognitionService | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    let audio: HTMLAudioElement | null = null;
    if (audioPromptUrl) {
      audio = new Audio(audioPromptUrl);
      audio.onended = () => onAudioEnded();
      audio.onerror = () => fallbackTts();
      audio.play().catch(() => fallbackTts());
    } else {
      fallbackTts();
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const fallbackTts = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(questionText);
      utterance.rate = 1.0;
      utterance.onend = () => onAudioEnded();
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => onAudioEnded(), 2500);
    }
  };

  const onAudioEnded = () => {
    setIsPlayingAudio(false);
    playCountdownBeep(1200, 200).then(() => {
      setStatus('RECORDING');
      setSecondsLeft(recordingSeconds);
      startRecording();
    });
  };

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

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (status === 'RECORDING') {
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
          You will hear a question. Please give a simple and short answer. Often just one or a few words is enough.
        </h2>
      </div>

      <div className="bg-white p-8 rounded border border-pearson-borderGray shadow-sm flex flex-col items-center justify-center min-h-[160px]">
        {isPlayingAudio ? (
          <div className="flex items-center space-x-3 text-pearson-blue animate-pulse">
            <Volume2 className="w-8 h-8" />
            <span className="font-semibold text-lg">Listening to question...</span>
          </div>
        ) : (
          <div className="text-center text-gray-700 font-medium">
            Please give your answer into the microphone now.
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
