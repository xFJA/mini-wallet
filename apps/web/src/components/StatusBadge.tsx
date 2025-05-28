import React from 'react';

interface StatusBadgeProps {
  status: 'completed' | 'pending' | 'failed' | string;
}

const getStatusBadgeConfig = (status: string) => {
  switch (status) {
    case 'completed':
      return {
        bgClass: 'bg-gradient-to-r from-green-500/20 to-green-600/20',
        textClass: 'text-green-400',
        borderClass: 'border-green-500/30',
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        ),
      };
    case 'pending':
      return {
        bgClass: 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20',
        textClass: 'text-yellow-400',
        borderClass: 'border-yellow-500/30',
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        ),
      };
    case 'failed':
      return {
        bgClass: 'bg-gradient-to-r from-red-500/20 to-red-600/20',
        textClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        ),
      };
    default:
      return {
        bgClass: 'bg-gradient-to-r from-gray-500/20 to-gray-600/20',
        textClass: 'text-gray-400',
        borderClass: 'border-gray-500/30',
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        ),
      };
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { bgClass, textClass, borderClass, icon } = getStatusBadgeConfig(status);

  return (
    <span
      className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-medium rounded-full border ${bgClass} ${textClass} ${borderClass}`}
    >
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
