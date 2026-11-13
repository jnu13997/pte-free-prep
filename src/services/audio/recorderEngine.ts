export interface FluencyMetric {
  wpm: number;
  fluencyScore: number; // 0 to 5 (Pearson scale)
  pausesDetected: number;
  durationSeconds: number;
}

export function calculateSpeechRateAndFluency(
  transcript: string,
  durationSeconds: number,
  pausesDetected: number
): FluencyMetric {
  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (durationSeconds <= 0 || wordCount === 0) {
    return {
      wpm: 0,
      fluencyScore: 0,
      pausesDetected,
      durationSeconds,
    };
  }

  const minutes = durationSeconds / 60;
  const wpm = Math.round(wordCount / minutes);

  // In PTE, natural oral fluency corresponds to ~120-150 words per minute
  // with smooth rhythm and minimal unnatural hesitation.
  let fluencyScore = 5;

  if (wpm < 50 || wpm > 240) {
    fluencyScore = 1;
  } else if (wpm < 80 || wpm > 210) {
    fluencyScore = 2;
  } else if (wpm < 105 || wpm > 185) {
    fluencyScore = 3;
  } else if (wpm < 120 || wpm > 170) {
    fluencyScore = 4;
  } else {
    fluencyScore = 5;
  }

  // Deduct for excessive hesitation pauses
  if (pausesDetected >= 4) {
    fluencyScore = Math.max(1, fluencyScore - 2);
  } else if (pausesDetected >= 2) {
    fluencyScore = Math.max(1, fluencyScore - 1);
  }

  return {
    wpm,
    fluencyScore,
    pausesDetected,
    durationSeconds,
  };
}

export class AudioRecorderEngine {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphoneStream: MediaStream | null = null;
  private silenceTimer: NodeJS.Timeout | null = null;
  private consecutiveSilenceSeconds = 0;
  private silenceCutoffTriggered = false;
  private volumeCheckInterval: NodeJS.Timeout | null = null;

  async start(
    onVolumeChange?: (volume: number) => void,
    onSilenceCutoff?: () => void
  ): Promise<void> {
    this.audioChunks = [];
    this.consecutiveSilenceSeconds = 0;
    this.silenceCutoffTriggered = false;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.microphoneStream = stream;

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      this.audioContext = new AudioCtx();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      const source = this.audioContext.createMediaStreamSource(stream);
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      this.volumeCheckInterval = setInterval(() => {
        if (!this.analyser) return;
        this.analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const normalizedVolume = Math.min(100, Math.round((average / 128) * 100));

        if (onVolumeChange) {
          onVolumeChange(normalizedVolume);
        }

        // Pearson 3-second silence detector
        if (normalizedVolume < 5) {
          this.consecutiveSilenceSeconds += 0.2;
          if (this.consecutiveSilenceSeconds >= 3.0 && !this.silenceCutoffTriggered) {
            this.silenceCutoffTriggered = true;
            if (onSilenceCutoff) {
              onSilenceCutoff();
            }
          }
        } else {
          this.consecutiveSilenceSeconds = 0;
        }
      }, 200);
    }

    // MIME type selection
    const mimeType = MediaRecorder.isTypeSupported('audio/webm')
      ? 'audio/webm'
      : MediaRecorder.isTypeSupported('audio/mp4')
      ? 'audio/mp4'
      : '';

    this.mediaRecorder = mimeType
      ? new MediaRecorder(stream, { mimeType })
      : new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start(100);
  }

  stop(): Promise<{ blob: Blob; mimeType: string }> {
    return new Promise((resolve) => {
      if (this.volumeCheckInterval) {
        clearInterval(this.volumeCheckInterval);
        this.volumeCheckInterval = null;
      }
      if (this.silenceTimer) {
        clearTimeout(this.silenceTimer);
        this.silenceTimer = null;
      }

      if (this.microphoneStream) {
        this.microphoneStream.getTracks().forEach((track) => track.stop());
      }
      if (this.audioContext) {
        try {
          this.audioContext.close();
        } catch {
          // ignore
        }
      }

      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        const fallbackBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        resolve({ blob: fallbackBlob, mimeType: 'audio/webm' });
        return;
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const finalBlob = new Blob(this.audioChunks, { type: mimeType });
        resolve({ blob: finalBlob, mimeType });
      };

      this.mediaRecorder.stop();
    });
  }
}
