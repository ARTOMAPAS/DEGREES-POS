import React from 'react';
import { useReactToPrint } from 'react-to-print';

const OrderConfirmationModal = ({ branchData,orderedItems,totalAmount, confirmOrder, cancelOrder }) => {

  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    pageStyle: `
      @page {
        size: 89mm 127mm;
        margin: 0;
      }
      @media print {
        body {
          color: black;
          background-color: white;
        }
      }
    `,
    content: () => {
      // Invoke the content function to get the reference to the component
      const content = componentRef.current;

      confirmOrder()
      // Return the content without calling window.print() immediately
      return content;
    },
  });
  

  const currentDate = new Date().toLocaleDateString('en-US');
  return (
    <div className="order-confirmation-modal">
      <div ref={componentRef}>
        {/* Order slip structure */}
        <div className="order-slip">
          <div className="store-info">
            <h2>{branchData.branch_name}</h2>
            <p>{branchData.location}</p>
            <p>Phone: (123) 456-7890</p>
          </div>
          <div className="order-details">
            <p>Date: {currentDate}</p>
            <table className="ordered-items">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>QTY</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orderedItems.map((item) => (
                  <tr key={item.product_id} className="ordered-item">
                    <td>{item.product_name}</td>
                    <td className='number-data'>{item.quantity}</td>
                    <td className='number-data'>{item.total}</td>
                  </tr>
                ))}
                <tr>
                  <td></td>
                  <td>Total:</td>
                  <td className='number-data'>{totalAmount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="confirmation-buttons">
        <button onClick={handlePrint}>Confirm and Print Order</button>
        <button onClick={() => cancelOrder()}>Cancel Order</button>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;
