import React, { useEffect, useState, useRef } from 'react';
import { SpeakingStatusBox, SpeakingState } from './SpeakingStatusBox';
import { playCountdownBeep } from '../../services/audio/beepSynthesizer';
import { AudioRecorderEngine } from '../../services/audio/recorderEngine';
import { SpeechRecognitionService } from '../../services/audio/speechRecognition';
import { naturalSpeech } from '../../services/audio/naturalSpeechService';
import { Volume2 } from 'lucide-react';

export interface RespondToSituationItemProps {
  situationText: string;
  rolePrompt: string;
  audioPromptUrl?: string;
  prepTimeSeconds?: number;
  recordingSeconds?: number;
  onRecordingComplete: (audioBlob: Blob, transcript: string, durationSeconds: number) => void;
}

export const RespondToSituationItem: React.FC<RespondToSituationItemProps> = ({
  situationText,
  rolePrompt,
  audioPromptUrl,
  prepTimeSeconds = 25,
  recordingSeconds = 40,
  onRecordingComplete,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);
  const [status, setStatus] = useState<SpeakingState>('COUNTDOWN');
  const [secondsLeft, setSecondsLeft] = useState(prepTimeSeconds);
  const [volumeLevel, setVolumeLevel] = useState(0);

  const recorderRef = useRef<AudioRecorderEngine | null>(null);
  const speechRef = useRef<SpeechRecognitionService | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    let audio: HTMLAudioElement | null = null;
    if (audioPromptUrl) {
      audio = new Audio(audioPromptUrl);
      audio.onended = () => onAudioFinished();
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
      naturalSpeech.cancel();
    };
  }, []);

  const fallbackTts = () => {
    naturalSpeech.speak(situationText, {
      onEnd: () => onAudioFinished(),
      onError: () => onAudioFinished(),
    });
  };

  const onAudioFinished = () => {
    setIsPlayingAudio(false);
    setStatus('COUNTDOWN');
    setSecondsLeft(prepTimeSeconds);
  };

  useEffect(() => {
    if (isPlayingAudio) return;

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
  }, [isPlayingAudio, status, secondsLeft]);

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
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-800">
            Listen to and read a description of a situation. You will have {prepTimeSeconds} seconds to prepare. When you hear the beep, speak into the microphone.
          </h2>
          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded font-semibold ml-2 whitespace-nowrap">
            PTE Core Task
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">You will have {recordingSeconds} seconds to respond.</p>
      </div>

      <div className="bg-white p-6 rounded border border-pearson-borderGray shadow-sm space-y-4">
        {isPlayingAudio && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 px-4 py-3 rounded text-sm text-blue-900 font-medium animate-pulse">
            <Volume2 className="w-5 h-5 text-blue-600 animate-bounce" />
            <span>Playing situation audio prompt (Canadian Native Accent)...</span>
          </div>
        )}

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Situation</span>
          <p className="text-base text-gray-800 mt-1 leading-relaxed">{situationText}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded text-sm text-blue-900 font-medium">
          {rolePrompt}
        </div>
      </div>

      <SpeakingStatusBox
        status={isPlayingAudio ? 'COUNTDOWN' : status}
        secondsLeft={isPlayingAudio ? 0 : secondsLeft}
        volumeLevel={volumeLevel}
        totalRecordingSeconds={recordingSeconds}
      />
    </div>
  );
};
