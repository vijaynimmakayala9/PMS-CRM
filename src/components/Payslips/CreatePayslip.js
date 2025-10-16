import React, { useState } from 'react';

const CreatePayslip = () => {
  const [payslip, setPayslip] = useState({
    employeeName: '',
    month: '',
    basic: '',
    allowances: '',
    deductions: '',
    netSalary: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayslip({ ...payslip, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Payslip Created:\nEmployee: ${payslip.employeeName}\nMonth: ${payslip.month}\nNet Salary: ${payslip.netSalary}`);
    setPayslip({ employeeName: '', month: '', basic: '', allowances: '', deductions: '', netSalary: '' });
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Create Payslip</h3>
      <form className="w-50" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Employee Name</label>
          <input type="text" name="employeeName" className="form-control" value={payslip.employeeName} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Month</label>
          <input type="month" name="month" className="form-control" value={payslip.month} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Basic</label>
          <input type="number" name="basic" className="form-control" value={payslip.basic} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Allowances</label>
          <input type="number" name="allowances" className="form-control" value={payslip.allowances} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Deductions</label>
          <input type="number" name="deductions" className="form-control" value={payslip.deductions} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Net Salary</label>
          <input type="number" name="netSalary" className="form-control" value={payslip.netSalary} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Create Payslip</button>
      </form>
    </div>
  );
};

export default CreatePayslip;
