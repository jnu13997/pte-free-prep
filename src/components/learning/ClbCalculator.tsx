import React, { useState } from 'react';
import { mapPteToClb, getClbDescription } from '../../services/scoring/clbMapping';
import { Calculator, CheckCircle, Info } from 'lucide-react';

export const ClbCalculator: React.FC = () => {
  const [speaking, setSpeaking] = useState<number>(76);
  const [listening, setListening] = useState<number>(71);
  const [reading, setReading] = useState<number>(69);
  const [writing, setWriting] = useState<number>(79);

  const clbSpeaking = mapPteToClb(speaking, 'speaking');
  const clbListening = mapPteToClb(listening, 'listening');
  const clbReading = mapPteToClb(reading, 'reading');
  const clbWriting = mapPteToClb(writing, 'writing');

  // Overall lowest skill benchmark determines Express Entry minimum
  const minClb = Math.min(clbSpeaking, clbListening, clbReading, clbWriting);

  return (
    <div className="bg-white rounded-lg border border-pearson-borderGray shadow-sm p-6 space-y-6">
      <div className="flex items-center space-x-3 border-b pb-4">
        <Calculator className="w-6 h-6 text-pearson-blue" />
        <div>
          <h2 className="text-lg font-bold text-gray-900">Canadian Language Benchmark (CLB) Calculator</h2>
          <p className="text-xs text-gray-500">
            Convert your official PTE Core scores directly to IRCC CLB benchmarks for Canada Express Entry & PR.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sliders */}
        <div className="space-y-4">
          {/* Speaking */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm font-semibold text-gray-700">
              <label htmlFor="input-speaking">Speaking PTE Score:</label>
              <span className="text-pearson-blue font-bold font-mono">{speaking}</span>
            </div>
            <input
              id="input-speaking"
              aria-label="Speaking PTE Score"
              type="range"
              min="10"
              max="90"
              value={speaking}
              onChange={(e) => setSpeaking(parseInt(e.target.value) || 10)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pearson-blue"
            />
          </div>

          {/* Listening */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm font-semibold text-gray-700">
              <label htmlFor="input-listening">Listening PTE Score:</label>
              <span className="text-pearson-blue font-bold font-mono">{listening}</span>
            </div>
            <input
              id="input-listening"
              aria-label="Listening PTE Score"
              type="range"
              min="10"
              max="90"
              value={listening}
              onChange={(e) => setListening(parseInt(e.target.value) || 10)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pearson-blue"
            />
          </div>

          {/* Reading */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm font-semibold text-gray-700">
              <label htmlFor="input-reading">Reading PTE Score:</label>
              <span className="text-pearson-blue font-bold font-mono">{reading}</span>
            </div>
            <input
              id="input-reading"
              aria-label="Reading PTE Score"
              type="range"
              min="10"
              max="90"
              value={reading}
              onChange={(e) => setReading(parseInt(e.target.value) || 10)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pearson-blue"
            />
          </div>

          {/* Writing */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm font-semibold text-gray-700">
              <label htmlFor="input-writing">Writing PTE Score:</label>
              <span className="text-pearson-blue font-bold font-mono">{writing}</span>
            </div>
            <input
              id="input-writing"
              aria-label="Writing PTE Score"
              type="range"
              min="10"
              max="90"
              value={writing}
              onChange={(e) => setWriting(parseInt(e.target.value) || 10)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pearson-blue"
            />
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Calculated Benchmarks</span>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-white p-2.5 rounded border border-gray-200">
                <span className="text-xs text-gray-500 block">Speaking:</span>
                <span className="font-bold text-gray-800 text-base">CLB {clbSpeaking}</span>
              </div>
              <div className="bg-white p-2.5 rounded border border-gray-200">
                <span className="text-xs text-gray-500 block">Listening:</span>
                <span className="font-bold text-gray-800 text-base">CLB {clbListening}</span>
              </div>
              <div className="bg-white p-2.5 rounded border border-gray-200">
                <span className="text-xs text-gray-500 block">Reading:</span>
                <span className="font-bold text-gray-800 text-base">CLB {clbReading}</span>
              </div>
              <div className="bg-white p-2.5 rounded border border-gray-200">
                <span className="text-xs text-gray-500 block">Writing:</span>
                <span className="font-bold text-gray-800 text-base">CLB {clbWriting}</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-3 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-700 font-bold text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Overall Effective Express Entry Tier: CLB {minClb}</span>
            </div>
            <p className="text-xs text-gray-600">{getClbDescription(minClb)}</p>
          </div>
        </div>
      </div>

      {/* CLB Benchmark Table Info */}
      <div className="bg-blue-50 border border-blue-200 rounded p-4 text-xs text-blue-900 flex items-start space-x-2">
        <Info className="w-4 h-4 text-pearson-blue shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">IRCC Express Entry Reference Benchmarks:</span>
          <p>
            • <strong>CLB 7 (PTE ~68–70):</strong> Minimum eligibility for Federal Skilled Worker Program (FSWP).
          </p>
          <p>
            • <strong>CLB 9 (PTE ~84+):</strong> Maximum skill-transferability Comprehensive Ranking System (CRS) bonus points.
          </p>
        </div>
      </div>
    </div>
  );
};
