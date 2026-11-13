interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
    length: number;
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export class SpeechRecognitionService {
  private recognition: SpeechRecognitionInstance | null = null;
  private isListening = false;
  private currentTranscript = '';

  static isSupported(): boolean {
    return typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  start(
    onInterim: (text: string) => void,
    onFinal: (text: string) => void,
    onError?: (error: string) => void
  ): boolean {
    if (!SpeechRecognitionService.isSupported()) {
      if (onError) onError('Speech recognition not supported in this browser.');
      return false;
    }

    try {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionClass) return false;

      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.currentTranscript = '';

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            this.currentTranscript += (this.currentTranscript ? ' ' : '') + item[0].transcript.trim();
            onFinal(this.currentTranscript);
          } else {
            interim += item[0].transcript;
          }
        }
        onInterim(interim);
      };

      this.recognition.onerror = (event: { error: string }) => {
        if (event.error !== 'no-speech' && onError) {
          onError(event.error);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onFinal(this.currentTranscript);
      };

      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (err) {
      if (onError) onError(String(err));
      return false;
    }
  }

  stop(): string {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
      this.isListening = false;
    }
    return this.currentTranscript;
  }
}
