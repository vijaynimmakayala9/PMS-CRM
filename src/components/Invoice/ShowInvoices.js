import React from 'react';

const ShowInvoices = () => {
  const invoices = [
    { id: 1, invoiceNo: 'INV001', clientName: 'Acme Corp', date: '2025-10-14', amount: 5000, status: 'Paid', file: '/files/invoice1.pdf' },
    { id: 2, invoiceNo: 'INV002', clientName: 'Globex', date: '2025-10-14', amount: 3500, status: 'Unpaid', file: '/files/invoice2.pdf' },
    { id: 3, invoiceNo: 'INV003', clientName: 'Initech', date: '2025-10-14', amount: 7200, status: 'Paid', file: '/files/invoice3.pdf' },
  ];

  const getStatusColor = (status) => {
    return status === 'Paid' ? 'green' : 'red';
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Invoices</h3>
      <table className="table table-bordered align-middle">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Invoice No</th>
            <th>Client</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.id}</td>
              <td>{inv.invoiceNo}</td>
              <td>{inv.clientName}</td>
              <td>{inv.date}</td>
              <td>${inv.amount}</td>
              <td style={{ color: getStatusColor(inv.status), fontWeight: 'bold' }}>
                {inv.status}
              </td>
              <td>
                <a
                  href={inv.file}
                  download
                  className="btn btn-sm btn-outline-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    fontSize: '0.9rem',
                  }}
                >
                  {/* Simple download icon using unicode */}
                  &#128190; Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowInvoices;
