import React, { useEffect, useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useAuthContext } from '../../../hooks/useAuthContext';

const SalesChart = () => {
  const { user } = useAuthContext();
  const [salesData, setSalesData] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const chartContainerRef = useRef();
  const [maxSale, setMaxSale] = useState(1000);

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const branchResponse = await fetch(`/branch`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const branchData = await branchResponse.json();
        if (branchResponse.ok) {
          setBranches(branchData);
        } else {
          console.error('Error fetching branches:', branchData.error);
        }
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    if (user) {
      fetchBranches();
    }
  }, [user]);

  // Fetch sales data
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        let url = `/sale`;

        // Include selected start and end dates in the API request if they are defined
        if (selectedStartDate && selectedEndDate) {
          url += `?start_date=${selectedStartDate.toISOString()}&end_date=${selectedEndDate.toISOString()}`;
        }

        const salesResponse = await fetch(url, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const allSalesData = await salesResponse.json();

        if (salesResponse.ok) {
          // Filter out voided sales and create an array of objects with each date and branch combination
          const formattedSalesData = allSalesData.reduce((result, sale) => {
            if (!sale.void) {
              const saleDate = new Date(sale.createdAt).toLocaleDateString();
              const branchIndex = result.findIndex((entry) => entry.date === saleDate);

              if (branchIndex === -1) {
                // If the date entry doesn't exist, create a new one
                const newEntry = { date: saleDate };
                newEntry[sale.branch_id] = sale.totalAmount;
                result.push(newEntry);
              } else {
                // If the date entry exists, update the existing one
                result[branchIndex][sale.branch_id] = (result[branchIndex][sale.branch_id] || 0) + sale.totalAmount;
              }
            }

            return result;
          }, []);

          const maxSaleValue = Math.max(
            ...formattedSalesData.map((item) =>
              Math.max(
                ...branches.map((branch) => item[branch._id] || 0)
              )
            )
          );
          setMaxSale(Math.ceil(maxSaleValue / 1000) * 1000);

          // Sort the formattedSalesData array based on the date in ascending order
          formattedSalesData.sort((a, b) => new Date(a.date) - new Date(b.date));

          setSalesData(formattedSalesData);
        } else {
          console.error('Error fetching sales data:', allSalesData.error);
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    if (user) {
      fetchSalesData();
    }
  }, [user, selectedStartDate, selectedEndDate, branches]);

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

        {/* Bar for each branch */}
        {branches.map((branch) => (
          <Bar key={branch._id} dataKey={branch._id} fill="#8884d8" name={`Branch ${branch.branch_name}`} />
        ))}
      </BarChart>
    </div>
  );
};

export default SalesChart;
