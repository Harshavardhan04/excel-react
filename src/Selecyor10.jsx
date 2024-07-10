import React from 'react';
import { TextField, Chip, Autocomplete } from '@mui/material';

const CurrencySelector = ({ options, selectedCurrencies, setSelectedCurrencies }) => {

  const handleChange = (event, newValue) => {
    setSelectedCurrencies(newValue);
  };

  return (
    <Autocomplete
      multiple
      id="currency-selector"
      options={options}
      getOptionLabel={(option) => option.label}
      value={selectedCurrencies}
      onChange={handleChange}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            variant="outlined"
            label={option.label}
            {...getTagProps({ index })}
            key={option.value}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Select Currencies"
          placeholder="Currencies"
          sx={{ width: 300 }} // Adjust the width as needed
        />
      )}
      sx={{
        '& .MuiAutocomplete-tag': {
          display: 'inline-block',
          maxWidth: '100px', // Adjust the max-width as needed
        },
      }}
    />
  );
};

export default CurrencySelector;
