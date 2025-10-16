import React, { useState } from 'react';

const CreateInvoice = () => {
  const [invoice, setInvoice] = useState({
    invoiceNo: '',
    clientName: '',
    date: '',
    amount: '',
    status: 'Unpaid',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice({ ...invoice, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Invoice Created:\nInvoice No: ${invoice.invoiceNo}\nClient: ${invoice.clientName}\nDate: ${invoice.date}\nAmount: ${invoice.amount}\nStatus: ${invoice.status}`);
    setInvoice({ invoiceNo: '', clientName: '', date: '', amount: '', status: 'Unpaid' });
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Create Invoice</h3>
      <form className="w-50" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Invoice Number</label>
          <input type="text" name="invoiceNo" className="form-control" value={invoice.invoiceNo} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Client Name</label>
          <input type="text" name="clientName" className="form-control" value={invoice.clientName} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Date</label>
          <input type="date" name="date" className="form-control" value={invoice.date} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Amount</label>
          <input type="number" name="amount" className="form-control" value={invoice.amount} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select name="status" className="form-select" value={invoice.status} onChange={handleChange}>
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Create Invoice</button>
      </form>
    </div>
  );
};

export default CreateInvoice;
