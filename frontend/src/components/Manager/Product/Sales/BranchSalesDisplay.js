
const BranchSalesDisplay = ({ sales, onViewDetails }) => {

  return (
    <div className="branch-sales-display">
          <table className="sales-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sales &&
                sales.map((sale) => (
                  <tr key={sale._id}>
                    <td>{sale.orderId}</td>
                    <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                    <td>{new Date(sale.createdAt).toLocaleTimeString()}</td>
                    <td>{sale.void ? 'Void' : 'Active'}</td>
                    <td>
                      <button onClick={() => onViewDetails(sale)}>View Details</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
    </div>
  );
};

export default BranchSalesDisplay;
