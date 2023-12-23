import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../../hooks/useAuthContext';

const SalesReportProducts = ({ sale, cashier }) => {
  const { user } = useAuthContext();
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productDetailsPromises = sale.salesTable.map(async (item) => {
          const response = await fetch(`/product/${item.productsId}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });

          const product = await response.json();

          if (response.ok) {
            return product;
          } else {
            console.error('Error fetching product details:', product.error);
            return null;
          }
        });

        const productsData = await Promise.all(productDetailsPromises);
        setProductData(productsData.filter(Boolean));
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    if (user) {
      fetchProductDetails();
    }
  }, [user, sale.salesTable]);

  return (
    <tbody>
      {productData.map((product, index) => (
        <tr key={index}>
          <td>{cashier ? cashier.name : 'Unknown Cashier'}</td>
          <td>{sale.orderId}</td>
          <td>{product.product_name}</td>
          <td>{sale.salesTable[index].quantity}</td>
          <td>{sale.salesTable[index].productPrice}</td>
          <td>{sale.salesTable[index].quantity * sale.salesTable[index].productPrice}</td>
          <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
          <td>{new Date(sale.createdAt).toLocaleTimeString()}</td>
        </tr>
      ))}
    </tbody>
  );
};

export default SalesReportProducts;
