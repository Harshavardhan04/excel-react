import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

const CurrencySelector = ({ options, selectedCurrencies, setSelectedCurrencies }) => {
  const handleCurrencyChange = (event, newValue) => {
    setSelectedCurrencies(newValue);
  };

  return (
    <Autocomplete
      multiple
      options={options}
      getOptionLabel={(option) => option.label}
      value={selectedCurrencies}
      onChange={handleCurrencyChange}
      renderInput={(params) => (
        <TextField {...params} variant="outlined" label="Select Currencies" placeholder="Currencies" />
      )}
      renderTags={(value, getTagProps) => 
        value.length > 5
          ? `${value.slice(0, 5).map((option) => option.label).join(', ')}... (+${value.length - 5} more)`
          : value.map((option, index) => (
              <span key={index} {...getTagProps({ index })}>
                {option.label}
              </span>
            ))
      }
    />
  );
};

export default CurrencySelector;
