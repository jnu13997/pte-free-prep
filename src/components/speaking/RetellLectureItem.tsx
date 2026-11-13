import React, { useEffect, useState, useRef } from 'react';
import { SpeakingStatusBox, SpeakingState } from './SpeakingStatusBox';
import { playCountdownBeep } from '../../services/audio/beepSynthesizer';
import { AudioRecorderEngine } from '../../services/audio/recorderEngine';
import { SpeechRecognitionService } from '../../services/audio/speechRecognition';
import { Volume2 } from 'lucide-react';

export interface RetellLectureItemProps {
  lectureText: string;
  audioPromptUrl?: string;
  imageUrl?: string;
  prepTimeSeconds?: number;
  recordingSeconds?: number;
  onRecordingComplete: (audioBlob: Blob, transcript: string, durationSeconds: number) => void;
}

export const RetellLectureItem: React.FC<RetellLectureItemProps> = ({
  lectureText,
  audioPromptUrl,
  imageUrl,
  prepTimeSeconds = 10,
  recordingSeconds = 40,
  onRecordingComplete,
}) => {
  const [isPlayingLecture, setIsPlayingLecture] = useState(true);
  const [status, setStatus] = useState<SpeakingState>('IDLE');
  const [secondsLeft, setSecondsLeft] = useState(prepTimeSeconds);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [scratchNotes, setScratchNotes] = useState('');

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
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const fallbackLectureTts = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(lectureText);
      utterance.rate = 1.0;
      utterance.onend = () => onLectureEnded();
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => onLectureEnded(), 4000);
    }
  };

  const onLectureEnded = () => {
    setIsPlayingLecture(false);
    setStatus('COUNTDOWN');
    setSecondsLeft(prepTimeSeconds);
  };

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
      <div className="bg-white border-l-4 border-pearson-blue p-4 rounded shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-800">
            You will hear a lecture. After listening to the lecture, in {prepTimeSeconds} seconds, please speak into the microphone and retell what you have just heard from the lecture in your own words.
          </h2>
          <p className="text-xs text-gray-500 mt-1">You have {recordingSeconds} seconds to give your response.</p>
        </div>
        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded font-semibold ml-2 whitespace-nowrap">
          PTE Academic Task
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded border border-pearson-borderGray shadow-sm flex flex-col items-center justify-center min-h-[220px]">
          {isPlayingLecture ? (
            <div className="flex flex-col items-center space-y-2 text-pearson-blue animate-pulse">
              <Volume2 className="w-10 h-10" />
              <span className="font-semibold text-base">Listening to lecture...</span>
            </div>
          ) : (
            <div className="text-center text-gray-700 font-medium text-sm">
              Lecture completed. Prepare to speak in your own words.
            </div>
          )}
          {imageUrl && (
            <img src={imageUrl} alt="Lecture context" className="mt-4 max-h-40 rounded object-contain" />
          )}
        </div>

        <div className="bg-white p-4 rounded border border-pearson-borderGray shadow-sm flex flex-col">
          <label className="text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
            Scratch Note-taking Pad (Optional)
          </label>
          <textarea
            value={scratchNotes}
            onChange={(e) => setScratchNotes(e.target.value)}
            placeholder="Jot down key points, keywords, and lecture ideas here..."
            className="w-full flex-1 p-2.5 text-sm border border-gray-200 rounded focus:outline-pearson-blue resize-none font-mono"
            rows={6}
          />
        </div>
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
