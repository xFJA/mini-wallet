interface TransactionListProps {}

export const TransactionList: React.FC<TransactionListProps> = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Transaction History</h2>
      <div className="border-2 border-dashed border-gray-200 rounded-md p-6 flex items-center justify-center">
        <p className="text-gray-500">Transaction history will be displayed here</p>
      </div>
    </div>
  );
};

export default TransactionList;
