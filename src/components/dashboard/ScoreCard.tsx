import type { AsymmetryScore } from '../../lib/types';

interface ScoreCardProps {
  score: AsymmetryScore;
  ticker?: string;
  showRationale?: boolean;
}

export default function ScoreCard({ score, ticker, showRationale = false }: ScoreCardProps) {
  const scores = [
    {
      label: 'Founder Conviction',
      value: score.founderConviction,
      rationale: score.rationale?.founderConviction,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      label: 'AI Disruption',
      value: score.aiDisruption,
      rationale: score.rationale?.aiDisruption,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'White Space',
      value: score.whiteSpace,
      rationale: score.rationale?.whiteSpace,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      label: 'Asymmetry',
      value: score.asymmetry,
      rationale: score.rationale?.asymmetry,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
  ];

  const getScoreColor = (value: number) => {
    if (value >= 8) return 'text-green-400';
    if (value >= 6) return 'text-yellow-400';
    if (value >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  const getBarColor = (value: number) => {
    if (value >= 8) return 'bg-green-500';
    if (value >= 6) return 'bg-yellow-500';
    if (value >= 4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Asymmetry Score{ticker ? ` - ${ticker}` : ''}
          </h3>
          <p className="text-sm text-gray-400">Based on 4 key factors</p>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${getScoreColor(score.total)}`}>
            {score.total.toFixed(1)}
          </div>
          <div className="text-sm text-gray-400">/ 10</div>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="p-6 space-y-4">
        {scores.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-gray-300">
                <span className="text-gray-500">{item.icon}</span>
                {item.label}
              </div>
              <span className={`font-semibold ${getScoreColor(item.value)}`}>
                {item.value.toFixed(1)}
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${getBarColor(item.value)} transition-all duration-500`}
                style={{ width: `${item.value * 10}%` }}
              />
            </div>
            {showRationale && item.rationale && (
              <p className="text-xs text-gray-500 mt-1">{item.rationale}</p>
            )}
          </div>
        ))}
      </div>

      {/* Score interpretation */}
      <div className="px-6 py-4 bg-gray-900 border-t border-gray-700">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span>8-10: Strong</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <span>6-8: Good</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>4-6: Fair</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>0-4: Weak</span>
          </div>
        </div>
      </div>
    </div>
  );
}
