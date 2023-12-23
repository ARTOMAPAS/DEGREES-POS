import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../../hooks/useAuthContext';

const BranchBestSeller = () => {
  const { user } = useAuthContext();
  const [bestSeller, setBestSeller] = useState(null);
  const [bestSellerDetails, setBestSellerDetails] = useState(null);

  useEffect(() => {
    const fetchBestSeller = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const response = await fetch(`/sale?branch_id=${user.branchID}&start_date=${today.toISOString()}&end_date=${new Date().toISOString()}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const salesData = await response.json();

        if (response.ok) {
          // Filter out voided sales
          const validSales = salesData.filter((sale) => !sale.void);

          // Count the quantity of each product
          const productCount = validSales.reduce((count, sale) => {
            sale.salesTable.forEach((item) => {
              const productId = item.productsId;
              count[productId] = (count[productId] || 0) + item.quantity;
            });
            return count;
          }, {});

          // Find the most ordered product
          const mostOrderedProduct = Object.keys(productCount).reduce((maxProduct, productId) => {
            if (!maxProduct || productCount[productId] > productCount[maxProduct]) {
              return productId;
            }
            return maxProduct;
          }, null);

          setBestSeller(mostOrderedProduct);

          // Fetch product details of the most ordered product
          const productDetailsResponse = await fetch(`/product/${mostOrderedProduct}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });

          const productDetails = await productDetailsResponse.json();

          if (productDetailsResponse.ok) {
            setBestSellerDetails(productDetails);
          } else {
            console.error('Error fetching product details:', productDetails.error);
          }
        } else {
          console.error('Error fetching sales data:', salesData.error);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (user) {
      fetchBestSeller();
    }
  }, [user]);

  return (
    <div>
      <h2>Branch Best Seller of the Day</h2>
      {bestSeller ? (
        <div>
          {bestSellerDetails && (
            <div>
                {bestSellerDetails.productImage && (
                <div>
                  <img src={bestSellerDetails.productImage} alt="Product" style={{ maxWidth: '40%', height: 'auto' }} />
                </div>
              )}
              <h3>Product Details</h3>
              <p>Name: {bestSellerDetails.product_name}</p>
              <p>Description: {bestSellerDetails.description}</p>
              <p>Price: ${bestSellerDetails.price.$numberInt}</p>
              {/* You can display other product details as needed */}
            </div>
          )}
        </div>
      ) : (
        <p>No sales data available for today.</p>
      )}
    </div>
  );
};

export default BranchBestSeller;
