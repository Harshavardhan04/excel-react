import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../ThemeContext';
import { DataGrid } from '@mui/x-data-grid';
import '../Styles/Graph.css';

const DataTableComponent = ({ selectedCurrencies, startDate, endDate }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/xva');
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getFilteredData = () => {
    return data.filter((d) => {
      const date = new Date(d.Date).getTime();
      return date >= startDate.getTime() && date <= endDate.getTime();
    });
  };

  const filteredData = getFilteredData();

  const generateColumns = () => {
    const baseColumns = [
      { field: 'id', headerName: 'ID', width: 90 },
      { field: 'date', headerName: 'Date', width: 150 },
      { field: 'target', headerName: 'Target', width: 150 },
    ];

    const currencyColumns = selectedCurrencies.map((currency) => ({
      field: currency.value.toLowerCase(),
      headerName: currency.label,
      width: 150,
    }));

    return [...baseColumns, ...currencyColumns, { field: 'total', headerName: 'Total', width: 150 }];
  };

  const generateRows = () => {
    return filteredData.map((d, index) => {
      const rowData = {
        id: index + 1,
        date: d.Date,
        target: d.Target,
        total: d.Total,
      };
      selectedCurrencies.forEach((currency) => {
        rowData[currency.value.toLowerCase()] = d[currency.value];
      });
      return rowData;
    });
  };

  const columns = generateColumns();
  const rows = generateRows();

  return (
    <div className={`data-table-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={10} loading={loading} />
      </div>
    </div>
  );
};

export default DataTableComponent;
