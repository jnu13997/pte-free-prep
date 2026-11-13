export type AccentType = 'auto' | 'canadian' | 'british' | 'australian' | 'american';

export interface NaturalSpeechOptions {
  accent?: AccentType;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
  onBoundary?: (charIndex: number) => void;
}

export interface VoiceProfile {
  voice: SpeechSynthesisVoice;
  isNeural: boolean;
  accent: AccentType;
  qualityScore: number;
}

class NaturalSpeechService {
  private voices: SpeechSynthesisVoice[] = [];
  private voicesLoaded = false;
  private voiceLoadListeners: Array<(voices: SpeechSynthesisVoice[]) => void> = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private defaultAccent: AccentType = 'auto';

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      try {
        const savedAccent = localStorage.getItem('pte_preferred_accent') as AccentType | null;
        if (savedAccent) {
          this.defaultAccent = savedAccent;
        }
      } catch {
        // ignore localStorage errors
      }
    }
  }

  private initVoices(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const load = () => {
      const list = window.speechSynthesis.getVoices();
      if (list && list.length > 0) {
        this.voices = list;
        this.voicesLoaded = true;
        this.voiceLoadListeners.forEach((cb) => cb(this.voices));
        this.voiceLoadListeners = [];
      }
    };

    load();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = load;
    }
  }

  public async getVoices(): Promise<SpeechSynthesisVoice[]> {
    if (this.voicesLoaded && this.voices.length > 0) {
      return this.voices;
    }
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return [];
    }

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve(window.speechSynthesis.getVoices() || []);
      }, 1500);

      this.voiceLoadListeners.push((voices) => {
        clearTimeout(timeout);
        resolve(voices);
      });
      // trigger immediate check
      const current = window.speechSynthesis.getVoices();
      if (current && current.length > 0) {
        clearTimeout(timeout);
        this.voices = current;
        this.voicesLoaded = true;
        resolve(current);
      }
    });
  }

  public getPreferredAccent(): AccentType {
    return this.defaultAccent;
  }

  public setPreferredAccent(accent: AccentType): void {
    this.defaultAccent = accent;
    try {
      localStorage.setItem('pte_preferred_accent', accent);
    } catch {
      // ignore
    }
  }

  /**
   * Evaluates and scores voices to prioritize modern, high-definition neural/online voices
   * over legacy robotic desktop SAPI engines.
   */
  public selectBestVoice(
    voices: SpeechSynthesisVoice[],
    accent: AccentType = this.defaultAccent
  ): SpeechSynthesisVoice | null {
    if (!voices || voices.length === 0) return null;

    const scored = voices
      .filter((v) => v.lang.toLowerCase().startsWith('en'))
      .map((voice) => {
        const name = voice.name.toLowerCase();
        const lang = voice.lang.toLowerCase();
        let score = 0;
        let voiceAccent: AccentType = 'american';

        if (lang.includes('ca') || name.includes('canad')) voiceAccent = 'canadian';
        else if (lang.includes('gb') || name.includes('uk') || name.includes('brit')) voiceAccent = 'british';
        else if (lang.includes('au') || name.includes('austral')) voiceAccent = 'australian';
        else voiceAccent = 'american';

        // 1. Neural / Natural online models receive highest precedence
        const isNeural =
          name.includes('natural') ||
          name.includes('online') ||
          name.includes('neural') ||
          name.includes('enhanced') ||
          name.includes('google') ||
          name.includes('siri');

        if (isNeural) score += 100;

        // 2. Microsoft Natural voices (Edge / Windows 11) are studio quality
        if (name.includes('microsoft') && (name.includes('natural') || name.includes('online'))) {
          score += 50;
        }

        // 3. Google Chrome high quality voices
        if (name.includes('google') && !name.includes('desktop')) {
          score += 40;
        }

        // 4. Apple Enhanced voices
        if (name.includes('enhanced')) {
          score += 40;
        }

        // 5. Heavy penalty for legacy robotic SAPI 5 desktop voices
        if (name.includes('desktop') || name.includes('sapi')) {
          score -= 60;
        }

        // 6. Accent matching bonus
        if (accent !== 'auto') {
          if (voiceAccent === accent) {
            score += 80;
          } else {
            score -= 20;
          }
        }

        return { voice, isNeural, accent: voiceAccent, qualityScore: score };
      });

    if (scored.length === 0) {
      // Fallback to any english voice or first voice
      return voices.find((v) => v.lang.toLowerCase().startsWith('en')) || voices[0] || null;
    }

    scored.sort((a, b) => b.qualityScore - a.qualityScore);
    return scored[0].voice;
  }

  public cancel(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
  }

  public async speak(text: string, options: NaturalSpeechOptions = {}): Promise<void> {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (options.onError) options.onError('Speech synthesis is not supported in this environment.');
      return;
    }

    this.cancel();

    const voices = await this.getVoices();
    const chosenVoice = this.selectBestVoice(voices, options.accent || this.defaultAccent);

    return new Promise((resolve) => {
      const cleanText = text.replace(/\[beep\]/gi, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);

      if (chosenVoice) {
        utterance.voice = chosenVoice;
        utterance.lang = chosenVoice.lang;
      }

      // Authentic human cadence: slightly measured pacing (0.93-0.95x) creates
      // clear enunciation and human-like cadence instead of rushing
      utterance.rate = options.rate !== undefined ? options.rate : 0.94;
      utterance.pitch = options.pitch !== undefined ? options.pitch : 1.0;
      utterance.volume = options.volume !== undefined ? options.volume : 1.0;

      utterance.onstart = () => {
        if (options.onStart) options.onStart();
        // Prevent Chrome 15-second speech silence bug
        this.heartbeatInterval = setInterval(() => {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        }, 10000);
      };

      utterance.onboundary = (e) => {
        if (options.onBoundary) options.onBoundary(e.charIndex);
      };

      utterance.onend = () => {
        if (this.heartbeatInterval) {
          clearInterval(this.heartbeatInterval);
          this.heartbeatInterval = null;
        }
        this.currentUtterance = null;
        if (options.onEnd) options.onEnd();
        resolve();
      };

      utterance.onerror = (err) => {
        if (this.heartbeatInterval) {
          clearInterval(this.heartbeatInterval);
          this.heartbeatInterval = null;
        }
        this.currentUtterance = null;
        if (options.onError) options.onError(err);
        resolve();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    });
  }

  public isSpeaking(): boolean {
    return Boolean(
      this.currentUtterance &&
        typeof window !== 'undefined' &&
        'speechSynthesis' in window &&
        window.speechSynthesis.speaking
    );
  }
}

export const naturalSpeech = new NaturalSpeechService();
