import React, { useEffect, useState, useRef } from 'react';
import { SpeakingStatusBox, SpeakingState } from './SpeakingStatusBox';
import { playCountdownBeep } from '../../services/audio/beepSynthesizer';
import { AudioRecorderEngine } from '../../services/audio/recorderEngine';
import { SpeechRecognitionService } from '../../services/audio/speechRecognition';
import { naturalSpeech } from '../../services/audio/naturalSpeechService';
import { Volume2 } from 'lucide-react';

export interface AnswerShortQuestionItemProps {
  questionText: string;
  audioPromptUrl?: string;
  recordingSeconds?: number;
  onRecordingComplete: (audioBlob: Blob, transcript: string, durationSeconds: number) => void;
  onTranscriptUpdate?: (transcript: string) => void;
}

export const AnswerShortQuestionItem: React.FC<AnswerShortQuestionItemProps> = ({
  questionText,
  audioPromptUrl,
  recordingSeconds = 10,
  onRecordingComplete,
  onTranscriptUpdate,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);
  const [status, setStatus] = useState<SpeakingState>('IDLE');
  const [secondsLeft, setSecondsLeft] = useState(recordingSeconds);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');

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
      naturalSpeech.cancel();
    };
  }, []);

  const fallbackTts = () => {
    naturalSpeech.speak(questionText, {
      onEnd: () => onAudioEnded(),
      onError: () => onAudioEnded(),
    });
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

  const handleFinishRecording = () => {
    if (status !== 'RECORDING') return;
    finishRecording();
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
          You will hear a question. Please give a simple and short answer. Often just one or a few words is enough.
        </h2>
        <p className="text-xs text-gray-500">You will have {recordingSeconds} seconds to give your answer.</p>
      </div>

      <div className="bg-white p-8 rounded border border-pearson-borderGray shadow-sm text-center min-h-[140px] flex flex-col items-center justify-center space-y-3">
        {isPlayingAudio ? (
          <div className="flex items-center space-x-3 text-pearson-blue font-semibold animate-pulse">
            <Volume2 className="w-6 h-6 animate-bounce" />
            <span className="text-base">Playing audio question... Listen carefully</span>
          </div>
        ) : (
          <div className="text-gray-700 text-sm font-medium">
            Question completed. Give your answer now.
          </div>
        )}
      </div>

      <SpeakingStatusBox
        status={isPlayingAudio ? 'IDLE' : status}
        secondsLeft={secondsLeft}
        volumeLevel={volumeLevel}
        totalRecordingSeconds={recordingSeconds}
        onFinishRecording={handleFinishRecording}
      />
    </div>
  );
};
