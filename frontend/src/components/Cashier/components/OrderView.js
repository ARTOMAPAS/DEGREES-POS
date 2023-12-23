// OrderView.js

import React from 'react';

const OrderView = ({ orderedItems, updateQuantity, removeItem }) => {
  return (
    <div className="order-view">
      <center>
        <h3>Order</h3>
      </center>
      <table className="ordered-items">
        <thead>
          <tr>
            <th>Product</th>
            <th>QTY</th>
            <th>Price</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orderedItems.map((item, index) => (
            <tr key={`${item.product_id}_${index}`} className="ordered-item">
              <td>{item.product_name}</td>
              <td>
                <button onClick={() => updateQuantity(index, 'decrease')}>&lt;</button>
                <span className='quantity'>{item.quantity}</span>
                <button onClick={() => updateQuantity(index, 'increase')}>&gt;</button>
              </td>
              <td className='number-data'>{item.price}</td>
              <td className='number-data'>{item.total}</td>
              <td>
                
                <button onClick={() => removeItem(index)}>Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderView;
