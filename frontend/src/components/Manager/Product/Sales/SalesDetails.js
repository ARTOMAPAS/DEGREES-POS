// SalesDetails.js
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { useSalesContext } from '../../../../hooks/useSalesContext';
import '../../../../style/sales.css';

const SalesDetails = ({ selectedSale, saleDetails, onClose, onSaleVoided }) => {
  const [productDetails, setProductDetails] = useState([]);
  const { user } = useAuthContext();
  const { dispatch } = useSalesContext();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productDetailsPromises = saleDetails.map(async (item) => {
          const response = await fetch(`/product/${item.productsId}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });

          const productData = await response.json();

          if (response.ok) {
            return { ...item, productDetails: productData };
          } else {
            console.error('Error fetching product details:', productData.error);
            return item;
          }
        });

        const resolvedProductDetails = await Promise.all(productDetailsPromises);
        setProductDetails(resolvedProductDetails);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [saleDetails, user.token]);

  const handleVoidSale = async () => {
    try {
      const response = await fetch(`/sale/${selectedSale._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ void: true }),
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });

      const json = await response.json();

      if (response.ok) {
        console.log('Sale voided successfully:', json);

        // Update the sales context after voiding the sale
        dispatch({ type: 'UPDATE_SALE', payload: json });

        // Execute the callback to reload the sales in BranchSalesDisplay
        onSaleVoided();
      } else {
        console.error('Error voiding sale:', json.error);
      }
    } catch (error) {
      console.error('Error voiding sale:', error);
    }
  };

  return (
    <div className="sales-details-container">
      <h2>Sales Details</h2>
      <h3>Order #: {selectedSale.orderId}</h3>
      <h3>Time: {new Date(selectedSale.createdAt).toLocaleString()}</h3>
      <h3>Status: {selectedSale.void ? 'Void' : 'Active'}</h3>
      <div>
        <table className="sales-details-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {productDetails.map((item) => (
              <tr key={item.productsId}>
                <td>{item.productDetails.product_name}</td>
                <td className="number-data">{item.quantity}</td>
                <td className="number-data">{item.productDetails.price}</td>
                <td className="number-data">{item.quantity * item.productDetails.price}</td>
              </tr>
            ))}
            <tr>
              <td></td>
              <td></td>
              <td>Total</td>
              <td className="number-data">{selectedSale.totalAmount}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button className="close-button" onClick={onClose}>
        Close
      </button>
      {!selectedSale.void && (
        <button className="void-sales" onClick={handleVoidSale}>
          Void
        </button>
      )}
    </div>
  );
};

export default SalesDetails;
