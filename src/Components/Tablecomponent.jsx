import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../ThemeContext';
import { DataGrid } from '@mui/x-data-grid';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CurrencySelector from './CurrencySelector';
import '../Styles/Graph.css';

const DataTableComponent = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [selectedCurrencies, setSelectedCurrencies] = useState([
    { value: 'AUD', label: 'AUD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' },
    { value: 'JPY', label: 'JPY' },
    { value: 'USD', label: 'USD' },
  ]);
  const [startDate, setStartDate] = useState(new Date('2022-06-01'));
  const [endDate, setEndDate] = useState(new Date('2024-06-25'));
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
      <div className="selectors-container">
        <div className="currency-selector">
          <CurrencySelector
            options={[
              { value: 'AUD', label: 'AUD' },
              { value: 'EUR', label: 'EUR' },
              { value: 'GBP', label: 'GBP' },
              { value: 'JPY', label: 'JPY' },
              { value: 'USD', label: 'USD' },
              { value: 'BRL', label: 'BRL' },
              { value: 'CAD', label: 'CAD' },
              { value: 'CHF', label: 'CHF' },
              { value: 'CLP', label: 'CLP' },
              { value: 'CNY', label: 'CNY' },
              { value: 'CZK', label: 'CZK' },
              { value: 'DKK', label: 'DKK' },
              { value: 'HKD', label: 'HKD' },
              { value: 'HUF', label: 'HUF' },
              { value: 'INR', label: 'INR' },
              { value: 'KRW', label: 'KRW' },
              { value: 'MXN', label: 'MXN' },
              { value: 'NOK', label: 'NOK' },
              { value: 'NZD', label: 'NZD' },
              { value: 'PLN', label: 'PLN' },
              { value: 'SEK', label: 'SEK' },
              { value: 'SGD', label: 'SGD' },
              { value: 'THB', label: 'THB' },
              { value: 'TWD', label: 'TWD' },
              { value: 'ZAR', label: 'ZAR' },
            ]}
            selectedCurrencies={selectedCurrencies}
            setSelectedCurrencies={setSelectedCurrencies}
          />
        </div>
        <div className="date-picker">
          <label>Select Date Range:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="date-input"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="date-input"
          />
        </div>
      </div>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={10} loading={loading} />
      </div>
    </div>
  );
};

export default DataTableComponent;
