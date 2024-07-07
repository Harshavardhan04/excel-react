import React, { useState, useRef, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm, Controller } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faFolderOpen, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import './fvaForm.css';

const darkTheme = {
  bodyBg: 'linear-gradient(135deg, #1d1d1d, #333)',
  formBg: '#282828',
  textColor: '#ffffff',
  inputBg: '#444',
  inputColor: '#fff',
  labelColor: '#b3b3b3',
  buttonBg: '#6200ea',
  buttonHoverBg: '#3700b3',
  borderColor: '#555',
  placeholderColor: '#757575',
  toggleBg: '#757575',
  toggleSwitchBg: '#121212',
  cardBg: '#2c2c2c',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const lightTheme = {
  bodyBg: 'linear-gradient(135deg, #ffffff, #f0f0f0)',
  formBg: '#f9f9f9',
  textColor: '#000000',
  inputBg: '#ffffff',
  inputColor: '#000',
  labelColor: '#333333',
  buttonBg: '#6200ea',
  buttonHoverBg: '#3700b3',
  borderColor: '#ccc',
  placeholderColor: '#aaa',
  toggleBg: '#ccc',
  toggleSwitchBg: '#ffffff',
  cardBg: '#ffffff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const FormContainer = styled.div.attrs({
  className: 'form-container',
})`
  background-color: ${(props) => props.theme.formBg};
  color: ${(props) => props.theme.textColor};
  box-shadow: ${(props) => props.theme.boxShadow};
`;

const FVABotForm = () => {
  const [theme, setTheme] = useState(darkTheme);
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const [startDate, setStartDate] = useState(new Date());
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.body.style.background = theme.bodyBg;
    document.body.style.color = theme.textColor;
  }, [theme]);

  const onSubmit = async (data) => {
    data.runDate = startDate.toISOString().split('T')[0];  // Format date as YYYY-MM-DD
    try {
      const response = await fetch('http://localhost:5000/submit_form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === darkTheme ? lightTheme : darkTheme));
  };

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <FormContainer>
        <div className="toggle-switch-container">
          <label className="toggle-label">Toggle Theme</label>
          <div
            className={`toggle-switch ${theme === lightTheme ? 'active' : ''}`}
            onClick={toggleTheme}
            style={{ backgroundColor: theme.toggleBg }}
          >
            <div
              style={{
                backgroundColor: theme.toggleSwitchBg,
              }}
            ></div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="label">Select Run Date</label>
            <div className="icon-wrapper">
              <FontAwesomeIcon icon={faCalendarAlt} />
            </div>
            <div className="date-input-wrapper">
              <Controller
                control={control}
                name="runDate"
                render={({ field }) => (
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => {
                      setStartDate(date);
                      field.onChange(date);
                    }}
                    className="custom-datepicker"
                    calendarClassName={theme === darkTheme ? 'calendar-dark' : 'calendar-light'}
                    style={{ backgroundColor: theme.inputBg, color: theme.inputColor }}
                  />
                )}
              />
            </div>
            {errors.runDate && <p className="error-message">This field is required</p>}
          </div>
          <div className="form-group">
            <label className="label">Select Output Type</label>
            <div className="radio-group">
              <label className="radio-label" style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor }}>
                <input
                  type="radio"
                  className="radio-input"
                  {...register("outputType", { required: true })}
                  value="all"
                />
                All
              </label>
              <label className="radio-label" style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor }}>
                <input
                  type="radio"
                  className="radio-input"
                  {...register("outputType", { required: true })}
                  value="PVTableWithHeaders"
                />
                PVTableWithHeaders
              </label>
              <label className="radio-label" style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor }}>
                <input
                  type="radio"
                  className="radio-input"
                  {...register("outputType", { required: true })}
                  value="PVUSDTableWithHeaders"
                />
                PVUSDTableWithHeaders
              </label>
              <label className="radio-label" style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor }}>
                <input
                  type="radio"
                  className="radio-input"
                  {...register("outputType", { required: true })}
                  value="RiskTableWithHeaders"
                />
                RiskTableWithHeaders
              </label>
              <label className="radio-label" style={{ backgroundColor: theme.cardBg, borderColor: theme.borderColor }}>
                <input
                  type="radio"
                  className="radio-input"
                  {...register("outputType", { required: true })}
                  value="RiskTableWithHeadersLite"
                />
                RiskTableWithHeadersLite
              </label>
            </div>
            {errors.outputType && <p className="error-message">This field is required</p>}
          </div>
          <div className="form-group">
            <label htmlFor="outputDirectory" className="label">Enter Output Directory</label>
            <div className="icon-wrapper" onClick={handleIconClick} style={{ cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faFolderOpen} />
            </div>
            <input
              type="text"
              id="outputDirectory"
              className="input"
              {...register("outputDirectory", { required: true })}
              placeholder="\\global.nomura.com\gm\EU\Business_Reso\..."
              style={{ backgroundColor: theme.inputBg, color: theme.inputColor, borderColor: theme.borderColor }}
            />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            {errors.outputDirectory && <p className="error-message">This field is required</p>}
          </div>
          <div className="form-group">
            <label htmlFor="curveData" className="label">Enter Basis SOFR / Unmanaged Unsecured 3M Curve</label>
            <div className="icon-wrapper">
              <FontAwesomeIcon icon={faExchangeAlt} />
            </div>
            <textarea
              id="curveData"
              className="textarea textarea-small"
              {...register("curveData", { required: true })}
              rows="2"
              placeholder="Copy the curve (incl. tenors) from Excel without headers"
              style={{ backgroundColor: theme.inputBg, color: theme.inputColor, borderColor: theme.borderColor }}
            />
            {errors.curveData && <p className="error-message">This field is required</p>}
          </div>
          <button
            type="submit"
            className="submit-button"
            style={{ backgroundColor: theme.buttonBg }}
          >
            Submit
          </button>
        </form>
      </FormContainer>
    </ThemeProvider>
  );
};

export default FVABotForm;
