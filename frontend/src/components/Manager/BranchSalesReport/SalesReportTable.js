import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../../hooks/useAuthContext';
import SalesReportProducts from './SalesReportProducts';

const SalesReportTable = ({ sales }) => {
  const { user } = useAuthContext();
  const [cashier, setCashier] = useState(null);

  useEffect(() => {
    const fetchCashierDetails = async (cashierId) => {
      try {
        const response = await fetch(`/user/${cashierId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const cashierDetails = await response.json();

        if (response.ok) {
          setCashier(cashierDetails);
        } else {
          console.error('Error fetching cashier details:', cashierDetails.error);
        }
      } catch (error) {
        console.error('Error fetching cashier details:', error);
      }
    };

    const processSales = Array.isArray(sales) ? sales : [sales];

    processSales.forEach((sale) => {
      if (user && sale.cashier) {
        fetchCashierDetails(sale.cashier);
      }
    });
  }, [user, sales]);

  // Check if cashier is defined before rendering SalesReportProducts
  if (!cashier) {
    return null; // or some loading state if you prefer
  }

  return (
    <SalesReportProducts
      key={Array.isArray(sales) ? sales.map((sale) => sale._id).join('-') : sales._id}
      cashier={cashier}
      sale={sales}
    />
  );
};

export default SalesReportTable;
