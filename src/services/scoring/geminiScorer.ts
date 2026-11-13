export interface GeminiEvaluationResult {
  overallScore: number;
  contentScore: number;
  fluencyScore: number;
  pronunciationScore: number;
  grammarScore: number;
  vocabularyScore: number;
  feedback: string;
}

export class GeminiScorerService {
  private static API_KEY_STORAGE_KEY = 'pte_prep_gemini_api_key';

  static getSavedApiKey(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static saveApiKey(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.API_KEY_STORAGE_KEY, key.trim());
  }

  static removeApiKey(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.API_KEY_STORAGE_KEY);
  }

  static async evaluateAudioOrText(
    taskType: string,
    promptContext: string,
    userText: string,
    audioBlob?: Blob
  ): Promise<GeminiEvaluationResult | null> {
    const apiKey = this.getSavedApiKey();
    if (!apiKey) return null;

    try {
      let inlineData = null;
      if (audioBlob) {
        const base64Audio = await this.blobToBase64(audioBlob);
        inlineData = {
          mimeType: audioBlob.type || 'audio/webm',
          data: base64Audio.split(',')[1] || base64Audio,
        };
      }

      const systemPrompt = `You are a certified Pearson PTE senior examiner. Evaluate the candidate's test response for task: ${taskType}.
Target Prompt / Context: "${promptContext}".
Candidate Written / Transcribed response: "${userText}".

Return a strictly valid JSON object with the following schema:
{
  "overallScore": number (10 to 90),
  "contentScore": number (0 to 5),
  "fluencyScore": number (0 to 5),
  "pronunciationScore": number (0 to 5),
  "grammarScore": number (0 to 5),
  "vocabularyScore": number (0 to 5),
  "feedback": "2-3 sentences of constructive examiner feedback highlighting strengths and specific improvement tips."
}`;

      const contents: Array<{ parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> }> = [
        {
          parts: [{ text: systemPrompt }],
        },
      ];

      if (inlineData) {
        contents[0].parts.push({ inlineData });
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents }),
        }
      );

      if (!response.ok) return null;
      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) return null;

      // Extract JSON from response
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;
      return JSON.parse(jsonMatch[0]) as GeminiEvaluationResult;
    } catch {
      return null;
    }
  }

  private static blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
