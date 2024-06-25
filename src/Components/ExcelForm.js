import React from 'react';
import { useForm } from 'react-hook-form';
import { updateExcelFile } from '../Utils/ExcelHelper';

const ExcelForm = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      await updateExcelFile(data);
      alert('Excel file updated successfully!');
    } catch (error) {
      console.error('Error updating Excel file:', error);
      alert('Failed to update Excel file.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="excel-form">
      {Array.from({ length: 15 }, (_, index) => (
        <div key={index} className="form-group">
          <label htmlFor={`entry${index + 1}`}>Entry {index + 1}:</label>
          <input
            id={`entry${index + 1}`}
            type="text"
            {...register(`entry${index + 1}`)}
            className="form-control"
          />
        </div>
      ))}
      <button type="submit" className="btn-submit">Update Excel</button>
    </form>
  );
};

export default ExcelForm;
