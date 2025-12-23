import { useState } from 'react';
import { CATEGORY_INFO, formatMarketCap, formatPercent, type Company, type FutureCategory } from '../../lib/types';

interface CompanyTableProps {
  companies: Company[];
  onCompanyClick?: (ticker: string) => void;
}

type SortField = 'ticker' | 'marketCap' | 'insiderOwnership' | 'tamMultiple' | 'scoreTotal' | 'priceChange30d';
type SortDirection = 'asc' | 'desc';

export default function CompanyTable({ companies, onCompanyClick }: CompanyTableProps) {
  const [sortField, setSortField] = useState<SortField>('scoreTotal');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedCompanies = [...companies].sort((a, b) => {
    let aVal: number | string = 0;
    let bVal: number | string = 0;

    switch (sortField) {
      case 'ticker':
        aVal = a.ticker;
        bVal = b.ticker;
        break;
      case 'marketCap':
        aVal = a.marketCap || 0;
        bVal = b.marketCap || 0;
        break;
      case 'insiderOwnership':
        aVal = a.insiderOwnership || 0;
        bVal = b.insiderOwnership || 0;
        break;
      case 'tamMultiple':
        aVal = a.tamMultiple || 0;
        bVal = b.tamMultiple || 0;
        break;
      case 'scoreTotal':
        aVal = a.scores?.total || 0;
        bVal = b.scores?.total || 0;
        break;
      case 'priceChange30d':
        aVal = a.priceChange30d || 0;
        bVal = b.priceChange30d || 0;
        break;
    }

    if (typeof aVal === 'string') {
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal);
    }

    return sortDirection === 'asc' ? aVal - (bVal as number) : (bVal as number) - aVal;
  });

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          <svg
            className={`w-4 h-4 transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </th>
  );

  const ScoreBadge = ({ score }: { score: number }) => {
    let bgColor = 'bg-gray-600';
    if (score >= 8) bgColor = 'bg-green-600';
    else if (score >= 6) bgColor = 'bg-yellow-600';
    else if (score >= 4) bgColor = 'bg-orange-600';
    else bgColor = 'bg-red-600';

    return (
      <span className={`${bgColor} px-2 py-1 rounded text-xs font-medium`}>
        {score.toFixed(1)}
      </span>
    );
  };

  const CategoryBadge = ({ category }: { category: FutureCategory }) => {
    const info = CATEGORY_INFO[category];
    return (
      <span
        className="px-2 py-1 rounded text-xs font-medium"
        style={{ backgroundColor: info.color + '20', color: info.color }}
      >
        {info.label}
      </span>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <SortHeader field="ticker">Ticker</SortHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <SortHeader field="marketCap">Market Cap</SortHeader>
              <SortHeader field="insiderOwnership">Insider %</SortHeader>
              <SortHeader field="tamMultiple">TAM Multiple</SortHeader>
              <SortHeader field="priceChange30d">30D Change</SortHeader>
              <SortHeader field="scoreTotal">Score</SortHeader>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sortedCompanies.map((company) => (
              <tr
                key={company.ticker}
                className="hover:bg-gray-750 cursor-pointer transition-colors"
                onClick={() => onCompanyClick?.(company.ticker)}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium text-white">{company.ticker}</div>
                    <div className="text-sm text-gray-400">{company.name}</div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <CategoryBadge category={company.futureCategory} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-gray-300">
                  {formatMarketCap(company.marketCap)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-gray-300">
                  {company.insiderOwnership ? `${company.insiderOwnership.toFixed(1)}%` : 'N/A'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-gray-300">
                  {company.tamMultiple ? `${company.tamMultiple.toFixed(0)}x` : 'TBD'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={company.priceChange30d && company.priceChange30d >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {formatPercent(company.priceChange30d)}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <ScoreBadge score={company.scores?.total || 0} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <button
                    className="text-indigo-400 hover:text-indigo-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to watchlist logic
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {companies.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No companies match your criteria
        </div>
      )}
    </div>
  );
}
