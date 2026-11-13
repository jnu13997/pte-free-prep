import React, { useEffect, useState, useRef } from 'react';
import { SpeakingStatusBox, SpeakingState } from './SpeakingStatusBox';
import { playCountdownBeep } from '../../services/audio/beepSynthesizer';
import { AudioRecorderEngine } from '../../services/audio/recorderEngine';
import { SpeechRecognitionService } from '../../services/audio/speechRecognition';
import { naturalSpeech } from '../../services/audio/naturalSpeechService';
import { Volume2, FileText } from 'lucide-react';

export interface RetellLectureItemProps {
  lectureText: string;
  audioPromptUrl?: string;
  imageUrl?: string;
  prepTimeSeconds?: number;
  recordingSeconds?: number;
  onRecordingComplete: (audioBlob: Blob, transcript: string, durationSeconds: number) => void;
  onTranscriptUpdate?: (transcript: string) => void;
}

export const RetellLectureItem: React.FC<RetellLectureItemProps> = ({
  lectureText,
  audioPromptUrl,
  imageUrl,
  prepTimeSeconds = 10,
  recordingSeconds = 40,
  onRecordingComplete,
  onTranscriptUpdate,
}) => {
  const [isPlayingLecture, setIsPlayingLecture] = useState(true);
  const [status, setStatus] = useState<SpeakingState>('COUNTDOWN');
  const [secondsLeft, setSecondsLeft] = useState(prepTimeSeconds);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');

  const recorderRef = useRef<AudioRecorderEngine | null>(null);
  const speechRef = useRef<SpeechRecognitionService | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    let audio: HTMLAudioElement | null = null;
    if (audioPromptUrl) {
      audio = new Audio(audioPromptUrl);
      audio.onended = () => onLectureEnded();
      audio.onerror = () => fallbackLectureTts();
      audio.play().catch(() => fallbackLectureTts());
    } else {
      fallbackLectureTts();
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
      naturalSpeech.cancel();
      if (recorderRef.current) {
        recorderRef.current.stop();
      }
      if (speechRef.current) {
        speechRef.current.stop();
      }
    };
  }, []);

  const fallbackLectureTts = () => {
    naturalSpeech.speak(lectureText, {
      onEnd: () => onLectureEnded(),
      onError: () => onLectureEnded(),
    });
  };

  const onLectureEnded = () => {
    setIsPlayingLecture(false);
    setStatus('COUNTDOWN');
    setSecondsLeft(prepTimeSeconds);
  };

  const handleSkipPrep = () => {
    if (isPlayingLecture || status !== 'COUNTDOWN') return;
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

  useEffect(() => {
    if (isPlayingLecture) return;

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
  }, [isPlayingLecture, status, secondsLeft]);

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
          You will hear a lecture. In {prepTimeSeconds} seconds, please speak into the microphone and retell what you have just heard in your own words.
        </h2>
        <p className="text-xs text-gray-500">You will have {recordingSeconds} seconds to give your response.</p>
      </div>

      <div className="bg-white p-6 rounded border border-pearson-borderGray shadow-sm space-y-4">
        {isPlayingLecture ? (
          <div className="flex items-center space-x-3 text-pearson-blue font-semibold animate-pulse py-4 justify-center">
            <Volume2 className="w-6 h-6 animate-bounce" />
            <span className="text-base">Playing spoken lecture... Take notes while listening</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-xs text-gray-500 py-1">
            <FileText className="w-4 h-4 text-pearson-blue" />
            <span>Lecture finished. Prepare your response and summarize the main concepts.</span>
          </div>
        )}

        {imageUrl && (
          <div className="flex justify-center">
            <img src={imageUrl} alt="Lecture Reference" className="max-h-60 rounded border" />
          </div>
        )}
      </div>

      <SpeakingStatusBox
        status={isPlayingLecture ? 'IDLE' : status}
        secondsLeft={secondsLeft}
        volumeLevel={volumeLevel}
        totalRecordingSeconds={recordingSeconds}
        onSkipPrep={handleSkipPrep}
        onFinishRecording={handleFinishRecording}
      />
    </div>
  );
};
