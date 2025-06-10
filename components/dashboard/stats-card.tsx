import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@heroicons/react/24/outline';

interface StatsCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
}

const StatsCard = React.memo(function StatsCard({ title, value, change }: StatsCardProps) {
  const getChangeIcon = () => {
    if (!change) return null;
    
    switch (change.type) {
      case 'increase':
        return <ArrowUpIcon className="w-4 h-4 text-green-500" />;
      case 'decrease':
        return <ArrowDownIcon className="w-4 h-4 text-red-500" />;
      default:
        return <MinusIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getChangeColor = () => {
    if (!change) return 'text-gray-500';
    
    switch (change.type) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {change && (
          <div className={`flex items-center space-x-1 text-xs ${getChangeColor()}`}>
            {getChangeIcon()}
            <span>{change.value}</span>
          </div>
        )}
      </div>
    </div>
  );
});

export default StatsCard;