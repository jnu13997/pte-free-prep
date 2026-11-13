import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

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
        return 'Playing';
      case 'STOPPED':
        return 'Completed';
      default:
        return 'Ready';
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto border border-pearson-borderGray rounded bg-white shadow-sm overflow-hidden select-none my-4">
      <div className="bg-[#e9ecef] px-4 py-2 border-b border-pearson-borderGray flex items-center justify-between">
        <span className="font-bold text-sm text-gray-800">Audio Status</span>
        <span className="text-xs font-semibold text-gray-600">
          {status === 'PLAYING' ? 'LIVE AUDIO' : status}
        </span>
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
            <span>Volume</span>
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
