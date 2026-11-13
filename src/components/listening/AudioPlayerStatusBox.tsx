import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

export type AudioPlayState = 'PREPARING' | 'PLAYING' | 'STOPPED';

export interface AudioPlayerStatusBoxProps {
  status: AudioPlayState;
  secondsUntilPlay?: number;
  progressPercent: number;
  volume: number;
  onVolumeChange?: (newVolume: number) => void;
}

export const AudioPlayerStatusBox: React.FC<AudioPlayerStatusBoxProps> = ({
  status,
  secondsUntilPlay = 0,
  progressPercent,
  volume,
  onVolumeChange,
}) => {
  const getStatusText = () => {
    switch (status) {
      case 'PREPARING':
        return `Playing in ${secondsUntilPlay} seconds`;
      case 'PLAYING':
        return 'Playing Audio Prompt';
      case 'STOPPED':
        return 'Playback Completed';
      default:
        return 'Ready';
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto border border-pearson-borderGray rounded bg-white shadow-sm overflow-hidden select-none my-4">
      <div className="bg-[#e9ecef] px-4 py-2 border-b border-pearson-borderGray flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-sm text-gray-800">Audio Status</span>
          <span className="inline-flex items-center text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded gap-1">
            <Sparkles className="w-3 h-3 text-blue-600" />
            Natural Studio Voice
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {status === 'PLAYING' && (
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-1 bg-pearson-blue rounded-full animate-pulse h-2" />
              <span className="w-1 bg-pearson-blue rounded-full animate-pulse h-3.5" />
              <span className="w-1 bg-pearson-blue rounded-full animate-pulse h-1.5" />
              <span className="w-1 bg-pearson-blue rounded-full animate-pulse h-3" />
            </div>
          )}
          <span className={`text-xs font-semibold ${status === 'PLAYING' ? 'text-pearson-blue font-bold' : 'text-gray-600'}`}>
            {status === 'PLAYING' ? 'LIVE AUDIO' : status}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-medium">Current status:</span>
          <span
            className={`font-bold ${
              status === 'PLAYING'
                ? 'text-pearson-blue'
                : status === 'STOPPED'
                ? 'text-gray-600'
                : 'text-gray-800'
            }`}
          >
            {getStatusText()}
          </span>
        </div>

        {/* Audio Progress Bar */}
        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden border border-gray-300">
          <div
            className={`h-full transition-all duration-300 ${
              status === 'PLAYING'
                ? 'bg-pearson-blue'
                : status === 'STOPPED'
                ? 'bg-gray-400'
                : 'bg-gray-300'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>

        {/* Volume Controls */}
        <div className="flex items-center justify-between pt-1 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            {volume === 0 ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-gray-600" />}
            <span>Prompt Volume</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => onVolumeChange && onVolumeChange(parseFloat(e.target.value))}
            className="w-32 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pearson-blue"
          />
        </div>
      </div>
    </div>
  );
};
