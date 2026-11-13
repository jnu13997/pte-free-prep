import { describe, it, expect } from 'vitest';
import { naturalSpeech } from '../../src/services/audio/naturalSpeechService';

describe('naturalSpeechService', () => {
  const mockVoices: SpeechSynthesisVoice[] = [
    {
      name: 'Microsoft David Desktop - English (United States)',
      lang: 'en-US',
      default: true,
      localService: true,
      voiceURI: 'urn:moz-tts:sapi:Microsoft David Desktop - English (United States)?en-US',
    },
    {
      name: 'Microsoft Jenny Online (Natural) - English (United States)',
      lang: 'en-US',
      default: false,
      localService: false,
      voiceURI: 'urn:moz-tts:azure:JennyOnline',
    },
    {
      name: 'Microsoft Liam Online (Natural) - English (Canada)',
      lang: 'en-CA',
      default: false,
      localService: false,
      voiceURI: 'urn:moz-tts:azure:LiamOnline',
    },
    {
      name: 'Microsoft Sonia Online (Natural) - English (United Kingdom)',
      lang: 'en-GB',
      default: false,
      localService: false,
      voiceURI: 'urn:moz-tts:azure:SoniaOnline',
    },
    {
      name: 'Microsoft Natasha Online (Natural) - English (Australia)',
      lang: 'en-AU',
      default: false,
      localService: false,
      voiceURI: 'urn:moz-tts:azure:NatashaOnline',
    },
  ];

  it('prioritizes natural neural voices over robotic desktop voices', () => {
    const selected = naturalSpeech.selectBestVoice(mockVoices, 'auto');
    expect(selected).not.toBeNull();
    expect(selected?.name).not.toContain('Desktop');
    expect(selected?.name).toContain('Natural');
  });

  it('selects Canadian accent when requested for PTE Core', () => {
    const selected = naturalSpeech.selectBestVoice(mockVoices, 'canadian');
    expect(selected?.name).toContain('Liam');
    expect(selected?.lang).toBe('en-CA');
  });

  it('selects British accent when requested for PTE Academic', () => {
    const selected = naturalSpeech.selectBestVoice(mockVoices, 'british');
    expect(selected?.name).toContain('Sonia');
    expect(selected?.lang).toBe('en-GB');
  });

  it('selects Australian accent when requested', () => {
    const selected = naturalSpeech.selectBestVoice(mockVoices, 'australian');
    expect(selected?.name).toContain('Natasha');
    expect(selected?.lang).toBe('en-AU');
  });

  it('persists preferred accent to service state', () => {
    naturalSpeech.setPreferredAccent('australian');
    expect(naturalSpeech.getPreferredAccent()).toBe('australian');

    // restore
    naturalSpeech.setPreferredAccent('auto');
    expect(naturalSpeech.getPreferredAccent()).toBe('auto');
  });
});
