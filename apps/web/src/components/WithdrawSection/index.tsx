interface WithdrawSectionProps {}

export const WithdrawSection: React.FC<WithdrawSectionProps> = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Withdraw Funds</h2>
      <div className="border-2 border-dashed border-gray-200 rounded-md p-6 flex items-center justify-center">
        <p className="text-gray-500">Withdrawal functionality will be displayed here</p>
      </div>
    </div>
  );
};

export default WithdrawSection;
