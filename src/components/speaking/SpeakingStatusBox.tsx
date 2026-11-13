import React from 'react';
import { Mic, CheckCircle2 } from 'lucide-react';

export type SpeakingState = 'IDLE' | 'COUNTDOWN' | 'RECORDING' | 'COMPLETED';

export interface SpeakingStatusBoxProps {
  status: SpeakingState;
  secondsLeft: number;
  volumeLevel?: number; // 0 to 100
  totalRecordingSeconds?: number;
}

export const SpeakingStatusBox: React.FC<SpeakingStatusBoxProps> = ({
  status,
  secondsLeft,
  volumeLevel = 0,
  totalRecordingSeconds = 40,
}) => {
  const getStatusText = () => {
    switch (status) {
      case 'COUNTDOWN':
        return `Beginning in ${secondsLeft} seconds`;
      case 'RECORDING':
        return `Recording (${secondsLeft} seconds remaining)`;
      case 'COMPLETED':
        return 'Completed';
      case 'IDLE':
      default:
        return 'Ready';
    }
  };

  const recordingProgressPercent =
    status === 'RECORDING' && totalRecordingSeconds > 0
      ? Math.round(((totalRecordingSeconds - secondsLeft) / totalRecordingSeconds) * 100)
      : status === 'COMPLETED'
      ? 100
      : 0;

  return (
    <div className="w-full max-w-xl mx-auto border border-pearson-borderGray rounded bg-white shadow-sm overflow-hidden select-none my-4">
      <div className="bg-[#e9ecef] px-4 py-2 border-b border-pearson-borderGray flex items-center justify-between">
        <span className="font-bold text-sm text-gray-800">Recorded Answer</span>
        <div className="flex items-center space-x-1.5">
          {status === 'RECORDING' && (
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
            </span>
          )}
          <span className="text-xs font-semibold text-gray-600">
            {status === 'RECORDING' ? 'LIVE' : status}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-medium">Current status:</span>
          <span
            className={`font-bold ${
              status === 'RECORDING'
                ? 'text-pearson-blue'
                : status === 'COMPLETED'
                ? 'text-green-600'
                : 'text-gray-800'
            }`}
          >
            {getStatusText()}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden border border-gray-300">
          <div
            className={`h-full transition-all duration-300 ${
              status === 'RECORDING'
                ? 'bg-pearson-blue'
                : status === 'COMPLETED'
                ? 'bg-green-600'
                : 'bg-gray-400'
            }`}
            style={{ width: `${recordingProgressPercent}%` }}
          />
        </div>

        {/* Live Volume Level Indicator */}
        <div className="flex items-center space-x-3 pt-1">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Mic className="w-3.5 h-3.5" />
            <span>Volume:</span>
          </div>
          <div className="flex-1 bg-gray-100 h-2 rounded overflow-hidden">
            <div
              className={`h-full transition-all duration-75 ${
                volumeLevel > 70 ? 'bg-red-500' : volumeLevel > 20 ? 'bg-green-500' : 'bg-gray-300'
              }`}
              style={{ width: `${status === 'RECORDING' ? volumeLevel : 0}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 font-mono w-8 text-right">
            {status === 'RECORDING' ? `${volumeLevel}%` : '0%'}
          </span>
        </div>

        {status === 'COMPLETED' && (
          <div className="flex items-center justify-center space-x-1.5 text-xs text-green-700 bg-green-50 border border-green-200 py-1.5 rounded">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Your response has been recorded. Click Next to proceed.</span>
          </div>
        )}
      </div>
    </div>
  );
};
