import React from 'react';

const ShowPayslips = () => {
  const payslips = [
    { id: 1, employeeName: 'John Doe', month: '2025-09', netSalary: 5000 },
    { id: 2, employeeName: 'Jane Smith', month: '2025-09', netSalary: 4500 },
    { id: 3, employeeName: 'Alice Johnson', month: '2025-09', netSalary: 5200 },
  ];

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Payslips</h3>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Employee</th>
            <th>Month</th>
            <th>Net Salary</th>
          </tr>
        </thead>
        <tbody>
          {payslips.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.employeeName}</td>
              <td>{p.month}</td>
              <td>${p.netSalary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowPayslips;
