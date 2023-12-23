import React, { useEffect, useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useAuthContext } from '../../../hooks/useAuthContext';

const BranchSalesChart = () => {
  const { user } = useAuthContext();
  const [salesData, setSalesData] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const chartContainerRef = useRef();
  const [maxSale, setMaxSale] = useState(1000); 

  useEffect(() => {
    const fetchSalesData = async () => {
      console.log(user.branchID)
      try {
        let url = `/sale`;

        // Include selected start and end dates in the API request if they are defined
        if (selectedStartDate && selectedEndDate) {
          url += `&start_date=${selectedStartDate.toISOString()}&end_date=${selectedEndDate.toISOString()}`;
        }

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const salesData = await response.json();

        if (response.ok) {
            

          // Aggregate sales data per day
          const aggregatedSales = salesData.reduce((result, sale) => {
            // Check if the sale is not void and belongs to the user's branch
            if (!sale.void && sale.branch_id === user.branchID) {
              const saleDate = new Date(sale.createdAt).toLocaleDateString();
              result[saleDate] = (result[saleDate] || 0) + sale.totalAmount;
            }
            return result;
          }, {});
          

          // Convert aggregatedSales object to an array of objects
          const formattedSalesData = Object.keys(aggregatedSales).map((date) => ({
            date,
            totalSales: aggregatedSales[date],
          }));

          const maxSaleValue = Math.max(...formattedSalesData.map(item => item.totalSales));
            setMaxSale(Math.ceil(maxSaleValue / 1000) * 1000);
          // Sort the formattedSalesData array based on the date in ascending order
          formattedSalesData.sort((a, b) => new Date(a.date) - new Date(b.date));

          setSalesData(formattedSalesData);
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    if (user) {
      fetchSalesData();
    }
  }, [user, selectedStartDate, selectedEndDate]);

  const handleStartDateChange = (event) => {
    const startDate = new Date(event.target.value);
    setSelectedStartDate(startDate);
  };

  const handleEndDateChange = (event) => {
    const endDate = new Date(event.target.value);
    setSelectedEndDate(endDate);
  };

  return (
    <div>
      <div>
        <label>
          Select Start Date:
          <input type="date" onChange={handleStartDateChange} value={selectedStartDate?.toISOString().split('T')[0]} />
        </label>
        <label>
          Select End Date:
          <input type="date" onChange={handleEndDateChange} value={selectedEndDate?.toISOString().split('T')[0]} />
        </label>
      </div>
      <BarChart width={chartContainerRef.current?.clientWidth || 730} height={250} data={salesData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, maxSale]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalSales" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default BranchSalesChart;
