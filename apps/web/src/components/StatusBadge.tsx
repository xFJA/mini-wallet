import React from 'react';

interface StatusBadgeProps {
  status: 'completed' | 'pending' | 'failed' | string;
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <span
    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
      status
    )}`}
  >
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

export default StatusBadge;
