import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatTAM } from '../../lib/types';

interface TAMChartProps {
  currentTAM: number;
  futureTAM: number;
  marketCap: number;
  ticker?: string;
}

export default function TAMChart({ currentTAM, futureTAM, marketCap, ticker }: TAMChartProps) {
  const data = [
    {
      name: 'Market Cap',
      value: marketCap,
      color: '#6366f1', // indigo
    },
    {
      name: 'Current TAM',
      value: currentTAM,
      color: '#f59e0b', // amber
    },
    {
      name: 'Future TAM',
      value: futureTAM,
      color: '#10b981', // emerald
    },
  ];

  const multiple = futureTAM / (currentTAM || 1);
  const potentialCapture = futureTAM * 0.1; // 10% market capture assumption
  const potentialMultiple = potentialCapture / (marketCap || 1);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 shadow-lg">
          <p className="text-white font-medium">{payload[0].payload.name}</p>
          <p className="text-gray-300">{formatTAM(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">
          TAM Analysis{ticker ? ` - ${ticker}` : ''}
        </h3>
        <p className="text-sm text-gray-400">Current vs Future Total Addressable Market</p>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={true} vertical={false} />
              <XAxis
                type="number"
                tickFormatter={(value) => formatTAM(value)}
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#9ca3af"
                fontSize={12}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-4 bg-gray-900 border-t border-gray-700">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-gray-400 mb-1">TAM Multiple</div>
            <div className="text-lg font-semibold text-amber-400">
              {multiple.toFixed(0)}x
            </div>
            <div className="text-xs text-gray-500">Future / Current</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">10% Capture Value</div>
            <div className="text-lg font-semibold text-emerald-400">
              {formatTAM(potentialCapture)}
            </div>
            <div className="text-xs text-gray-500">If 10% market share</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Potential Multiple</div>
            <div className="text-lg font-semibold text-indigo-400">
              {potentialMultiple.toFixed(0)}x
            </div>
            <div className="text-xs text-gray-500">At 10% capture</div>
          </div>
        </div>
      </div>
    </div>
  );
}
