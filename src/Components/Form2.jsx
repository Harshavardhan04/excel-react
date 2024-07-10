import React, { useState, useRef } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Container, CssBaseline, TextField, FormControl, Button, Grid, Switch, Typography, Select, MenuItem
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useForm, Controller } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import './fvaForm.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: 'linear-gradient(135deg, #1d1d1d, #333)',
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: 'linear-gradient(135deg, #ffffff, #f0f0f0)',
    },
  },
});

const FVABotForm = () => {
  const [theme, setTheme] = useState('dark');
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const [startDate, setStartDate] = useState(new Date());
  const [selectedDirectory, setSelectedDirectory] = useState('');
  const fileInputRef = useRef(null);

  const onSubmit = async (data) => {
    data.runDate = startDate.toISOString().split('T')[0];  // Format date as YYYY-MM-DD
    data.outputDirectory = selectedDirectory;  // Include the selected directory in the data
    try {
      const response = await fetch('http://localhost:5000/submit_form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form');
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDirectoryChange = (event) => {
    const directoryPath = event.target.files[0].webkitRelativePath;
    const directoryName = directoryPath.substring(0, directoryPath.indexOf('/'));
    setSelectedDirectory(directoryName);
  };

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ backgroundColor: theme === 'dark' ? '#282828' : '#f9f9f9', padding: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" gutterBottom>
          Toggle Theme
          <Switch checked={theme === 'light'} onChange={toggleTheme} />
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" className="form-control">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    control={control}
                    name="runDate"
                    render={({ field }) => (
                      <DatePicker
                        label="Select Run Date"
                        value={startDate}
                        onChange={(date) => {
                          setStartDate(date);
                          field.onChange(date);
                        }}
                        renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
                      />
                    )}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" className="form-control">
                <Controller
                  control={control}
                  name="outputType"
                  render={({ field }) => (
                    <TextField
                      select
                      label="Select Output Type"
                      {...field}
                      variant="outlined"
                      fullWidth
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="PVTableWithHeaders">PVTableWithHeaders</MenuItem>
                      <MenuItem value="PVUSDTableWithHeaders">PVUSDTableWithHeaders</MenuItem>
                      <MenuItem value="RiskTableWithHeaders">RiskTableWithHeaders</MenuItem>
                      <MenuItem value="RiskTableWithHeadersLite">RiskTableWithHeadersLite</MenuItem>
                    </TextField>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" className="form-control">
                <TextField
                  id="outputDirectory"
                  label="Enter Output Directory"
                  placeholder={selectedDirectory || "Select a directory"}
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <FontAwesomeIcon icon={faFolderOpen} onClick={handleIconClick} style={{ cursor: 'pointer', marginLeft: '10px' }} />
                    ),
                    readOnly: true,
                  }}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  webkitdirectory="true"
                  mozdirectory="true"
                  onChange={handleDirectoryChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" className="form-control">
                <TextField
                  id="curveData"
                  label="Enter Basis SOFR / Unmanaged Unsecured 3M Curve"
                  placeholder="Copy the curve (incl. tenors) from Excel without headers"
                  multiline
                  rows={2}
                  variant="outlined"
                  fullWidth
                  {...register("curveData", { required: true })}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </ThemeProvider>
  );
};

export default FVABotForm;
