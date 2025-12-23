import { useState } from 'react';
import { CATEGORY_INFO, type FutureCategory } from '../../lib/types';
import type { ScreeningCriteria } from '../../lib/types';
import { DEFAULT_MAX_MARKET_CAP, PREFERRED_MAX_MARKET_CAP, DEFAULT_MIN_INSIDER_OWNERSHIP, DEFAULT_MIN_TAM_MULTIPLE, DEFAULT_MIN_ASYMMETRY_SCORE } from '../../lib/constants';

interface FilterPanelProps {
  criteria: ScreeningCriteria;
  onChange: (criteria: ScreeningCriteria) => void;
  onReset: () => void;
}

export default function FilterPanel({ criteria, onChange, onReset }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCategoryToggle = (category: FutureCategory) => {
    const current = criteria.categories || [];
    const newCategories = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    onChange({ ...criteria, categories: newCategories });
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(0)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(0)}M`;
    return `$${value}`;
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      {/* Header */}
      <button
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-750"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="font-medium text-white">Screening Filters</span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Filters */}
      {isExpanded && (
        <div className="px-6 py-4 border-t border-gray-700 space-y-6">
          {/* Market Cap Range */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Max Market Cap
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={100_000_000}
                max={50_000_000_000}
                step={100_000_000}
                value={criteria.maxMarketCap || DEFAULT_MAX_MARKET_CAP}
                onChange={(e) => onChange({ ...criteria, maxMarketCap: Number(e.target.value) })}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <span className="text-sm text-gray-400 w-16 text-right">
                {formatMarketCap(criteria.maxMarketCap || DEFAULT_MAX_MARKET_CAP)}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$100M</span>
              <span className="text-indigo-400">Preferred: &lt;{formatMarketCap(PREFERRED_MAX_MARKET_CAP)}</span>
              <span>$50B</span>
            </div>
          </div>

          {/* Min Insider Ownership */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Min Insider Ownership
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0}
                max={50}
                step={1}
                value={criteria.minInsiderOwnership || DEFAULT_MIN_INSIDER_OWNERSHIP}
                onChange={(e) => onChange({ ...criteria, minInsiderOwnership: Number(e.target.value) })}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <span className="text-sm text-gray-400 w-12 text-right">
                {criteria.minInsiderOwnership || DEFAULT_MIN_INSIDER_OWNERSHIP}%
              </span>
            </div>
          </div>

          {/* Min TAM Multiple */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Min TAM Multiple (Future/Current)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={100}
                step={1}
                value={criteria.minTamMultiple || DEFAULT_MIN_TAM_MULTIPLE}
                onChange={(e) => onChange({ ...criteria, minTamMultiple: Number(e.target.value) })}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <span className="text-sm text-gray-400 w-12 text-right">
                {criteria.minTamMultiple || DEFAULT_MIN_TAM_MULTIPLE}x
              </span>
            </div>
          </div>

          {/* Min Asymmetry Score */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Min Asymmetry Score
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0}
                max={10}
                step={0.5}
                value={criteria.minAsymmetryScore || DEFAULT_MIN_ASYMMETRY_SCORE}
                onChange={(e) => onChange({ ...criteria, minAsymmetryScore: Number(e.target.value) })}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <span className="text-sm text-gray-400 w-12 text-right">
                {criteria.minAsymmetryScore || DEFAULT_MIN_ASYMMETRY_SCORE}/10
              </span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Future TAM Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(CATEGORY_INFO).filter(([key]) => key !== 'other').map(([key, info]) => {
                const isSelected = criteria.categories?.includes(key as FutureCategory) ?? true;
                return (
                  <button
                    key={key}
                    onClick={() => handleCategoryToggle(key as FutureCategory)}
                    className={`
                      px-3 py-1.5 rounded-full text-xs font-medium transition-all
                      ${isSelected
                        ? 'ring-2 ring-offset-2 ring-offset-gray-800'
                        : 'opacity-50'
                      }
                    `}
                    style={{
                      backgroundColor: info.color + '20',
                      color: info.color,
                      ringColor: isSelected ? info.color : 'transparent',
                    }}
                  >
                    {info.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reset Button */}
          <div className="pt-4 border-t border-gray-700">
            <button
              onClick={onReset}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Reset all filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
