// src/components/AssignedWorks.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MdEdit, MdDelete, MdExpandMore, MdExpandLess } from 'react-icons/md';
import * as XLSX from 'xlsx';

const AssignedWorks = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportDates, setExportDates] = useState({
    startDate: '',
    endDate: ''
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [sheetFilter, setSheetFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const modalRef = useRef(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowExportModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await fetch('https://admin-emp.onrender.com/api/all_assign_projects');
      const data = await res.json();
      if (data.success) {
        setAssignments(data.data);
      } else {
        setError('Failed to load assignments');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`https://admin-emp.onrender.com/api/delete_assign_project/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setAssignments(prev => prev.filter(a => a._id !== id));
      } else {
        alert('Delete failed: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  // Get unique projects for filter
  const allProjects = [...new Set(assignments.flatMap(a => a.projects.map(p => p.projectName)))];

  // Filter logic
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch =
      assignment.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.employName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSheet = sheetFilter ? assignment.sheet === sheetFilter : true;
    const matchesProject = projectFilter
      ? assignment.projects.some(p => p.projectName === projectFilter)
      : true;
    return matchesSearch && matchesSheet && matchesProject;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAssignments = filteredAssignments.slice(startIndex, startIndex + itemsPerPage);

  // Enhanced Export Functionality with Improved Alignment and Styling
  const handleExport = () => {
    if (!exportDates.startDate || !exportDates.endDate) {
      alert('Please select both start and end dates');
      return;
    }

    const start = new Date(exportDates.startDate);
    const end = new Date(exportDates.endDate);

    if (start > end) {
      alert('Start date must be before end date');
      return;
    }

    // Group assignments by employee
    const employeeMap = new Map();

    assignments.forEach(assignment => {
      assignment.projects.forEach(project => {
        const projectStart = new Date(project.startDate);
        const projectEnd = new Date(project.endDate);

        // Check if project overlaps with export date range
        if (projectEnd >= start && projectStart <= end) {
          const empKey = `${assignment.empId}-${assignment.employName}`;

          if (!employeeMap.has(empKey)) {
            employeeMap.set(empKey, {
              empId: assignment.empId,
              employName: assignment.employName,
              sheet: assignment.sheet,
              projects: []
            });
          }

          employeeMap.get(empKey).projects.push({
            projectName: project.projectName,
            startDate: new Date(project.startDate).toLocaleDateString(),
            endDate: new Date(project.endDate).toLocaleDateString(),
            hours: project.hours,
            shift: project.shift,
            comment: project.comment || ''
          });
        }
      });
    });

    if (employeeMap.size === 0) {
      alert('No assignments found in the selected date range');
      return;
    }

    // Create worksheet data
    const ws = XLSX.utils.aoa_to_sheet([]);

    // Add "Daily WorkSheet" heading with styling
    const heading = `Daily WorkSheet (${exportDates.startDate})`;
    ws['A1'] = { v: heading, t: 's' };

    // Style main heading - Bold, larger font, colored background
    ws['A1'].s = {
      font: { bold: true, sz: 18, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "1976D2" } }, // Blue background
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "medium", color: { rgb: "000000" } },
        bottom: { style: "medium", color: { rgb: "000000" } },
        left: { style: "medium", color: { rgb: "000000" } },
        right: { style: "medium", color: { rgb: "000000" } }
      }
    };

    // Merge heading across all columns (A1 to I1)
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }];

    // Add header row (starting at A3)
    const headers = [
      'Employee ID',
      'Employee Name',
      'Sheet Type',
      'Project Name',
      'Start Date',
      'End Date',
      'Hours',
      'Shift',
      'Comment'
    ];

    // Set headers in row 3 with enhanced styling
    headers.forEach((header, i) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 2, c: i });
      ws[cellAddress] = { v: header, t: 's' };

      // Bold header styling with teal background
      ws[cellAddress].s = {
        font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "009688" } }, // Teal background
        alignment: { horizontal: "center", vertical: "center", wrapText: true },
        border: {
          top: { style: "medium", color: { rgb: "000000" } },
          bottom: { style: "medium", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } }
        }
      };
    });

    // Add data rows (starting at row 4)
    let currentRow = 3; // Row index (0-based, so row 4 = index 3)
    const dataMerges = [];

    // Alternating row colors for better readability
    let isAlternateRow = false;

    for (const [empKey, empData] of employeeMap) {
      const projectCount = empData.projects.length;
      const rowColor = isAlternateRow ? "F5F5F5" : "FFFFFF"; // Light gray / White

      // First project row
      const firstProject = empData.projects[0];
      const firstRowData = [
        empData.empId,
        empData.employName,
        empData.sheet,
        firstProject.projectName,
        firstProject.startDate,
        firstProject.endDate,
        firstProject.hours,
        firstProject.shift,
        firstProject.comment
      ];

      firstRowData.forEach((value, colIndex) => {
        const cellAddress = XLSX.utils.encode_cell({ r: currentRow, c: colIndex });
        ws[cellAddress] = { v: value, t: 's' };

        // Determine alignment based on column type
        let hAlign = "center";
        if (colIndex === 1) hAlign = "left"; // Employee Name - left aligned
        if (colIndex === 3) hAlign = "left"; // Project Name - left aligned
        if (colIndex === 8) hAlign = "left"; // Comment - left aligned

        // Apply styling with proper alignment
        ws[cellAddress].s = {
          font: { sz: 11 },
          fill: { fgColor: { rgb: rowColor } },
          alignment: {
            horizontal: hAlign,
            vertical: "center",
            wrapText: colIndex === 8 // Wrap text for comments
          },
          border: {
            top: { style: "thin", color: { rgb: "CCCCCC" } },
            bottom: { style: "thin", color: { rgb: "CCCCCC" } },
            left: { style: "thin", color: { rgb: "CCCCCC" } },
            right: { style: "thin", color: { rgb: "CCCCCC" } }
          }
        };
      });

      // Merge employee cells for multi-project employees
      if (projectCount > 1) {
        [0, 1, 2].forEach(colIndex => {
          dataMerges.push({
            s: { r: currentRow, c: colIndex },
            e: { r: currentRow + projectCount - 1, c: colIndex }
          });

          // Update merged cell styling to center vertically
          const cellAddress = XLSX.utils.encode_cell({ r: currentRow, c: colIndex });
          if (ws[cellAddress] && ws[cellAddress].s) {
            ws[cellAddress].s.alignment.vertical = "center";
          }
        });
      }

      // Add remaining projects
      for (let i = 1; i < projectCount; i++) {
        const project = empData.projects[i];
        const rowData = [
          '', // Empty for merged cells
          '',
          '',
          project.projectName,
          project.startDate,
          project.endDate,
          project.hours,
          project.shift,
          project.comment
        ];

        rowData.forEach((value, colIndex) => {
          const cellAddress = XLSX.utils.encode_cell({ r: currentRow + i, c: colIndex });
          ws[cellAddress] = { v: value, t: 's' };

          // Determine alignment based on column type
          let hAlign = "center";
          if (colIndex === 3) hAlign = "left"; // Project Name - left aligned
          if (colIndex === 8) hAlign = "left"; // Comment - left aligned

          // Apply styling
          ws[cellAddress].s = {
            font: { sz: 11 },
            fill: { fgColor: { rgb: rowColor } },
            alignment: {
              horizontal: hAlign,
              vertical: "center",
              wrapText: colIndex === 8
            },
            border: {
              top: { style: "thin", color: { rgb: "CCCCCC" } },
              bottom: { style: "thin", color: { rgb: "CCCCCC" } },
              left: { style: "thin", color: { rgb: "CCCCCC" } },
              right: { style: "thin", color: { rgb: "CCCCCC" } }
            }
          };
        });
      }

      currentRow += projectCount;
      isAlternateRow = !isAlternateRow; // Toggle for next employee
    }

    // Apply all merges (heading + data)
    ws['!merges'] = ws['!merges'].concat(dataMerges);

    // Set column widths for better readability
    ws['!cols'] = [
      { wch: 15 }, // Employee ID
      { wch: 25 }, // Employee Name (increased)
      { wch: 15 }, // Sheet Type
      { wch: 30 }, // Project Name (increased)
      { wch: 15 }, // Start Date
      { wch: 15 }, // End Date
      { wch: 10 }, // Hours
      { wch: 12 }, // Shift
      { wch: 35 }  // Comment (increased)
    ];

    // Set row heights for heading
    ws['!rows'] = [
      { hpt: 30 }, // Row 1 (heading) - taller
      { hpt: 15 }, // Row 2 (empty)
      { hpt: 25 }  // Row 3 (headers) - medium height
    ];

    // Set worksheet range
    const lastCol = XLSX.utils.encode_col(headers.length - 1);
    const lastRow = currentRow;
    ws['!ref'] = `A1:${lastCol}${lastRow}`;

    // Create workbook and download
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "AssignedWorks");

    const fileName = `DailyWorkSheet_${exportDates.startDate.replace(/-/g, '')}.xlsx`;
    XLSX.writeFile(wb, fileName);

    setShowExportModal(false);
    setExportDates({ startDate: '', endDate: '' });
  };

  if (loading) return <div className="container-fluid py-5 text-center">Loading assignments...</div>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h2 className="fw-bold" style={{ color: '#009788' }}>Assigned Works</h2>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-success"
            onClick={() => setShowExportModal(true)}
          >
            Export Sheet
          </button>
          <Link to="/add-worksheet" className="btn text-white fw-semibold" style={{ backgroundColor: '#009788' }}>
            Add Worksheet
          </Link>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered" ref={modalRef}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Export Assigned Works</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowExportModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Start Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={exportDates.startDate}
                    onChange={(e) => setExportDates({ ...exportDates, startDate: e.target.value })}
                    max={exportDates.endDate || undefined}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">End Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={exportDates.endDate}
                    onChange={(e) => setExportDates({ ...exportDates, endDate: e.target.value })}
                    min={exportDates.startDate || undefined}
                  />
                </div>
                <div className="text-muted small">
                  <em>Exports all assignments with projects overlapping this date range</em>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowExportModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn text-white"
                  style={{ backgroundColor: '#009788' }}
                  onClick={handleExport}
                >
                  Download Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search by employee ID or name..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={sheetFilter}
                onChange={(e) => { setSheetFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="">All Sheet Types</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="testing">Testing</option>
                <option value="design">Design</option>
                <option value="Full Stack">Full Stack</option>
                <option value="Digital Marketing">Digital Marketing</option>
              </select>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={projectFilter}
                onChange={(e) => { setProjectFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="">All Projects</option>
                {allProjects.map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom-2" style={{ borderColor: '#009788' }}>
          <h4 className="mb-0 fw-bold" style={{ color: '#009788' }}>Work Assignments</h4>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ backgroundColor: '#009788', color: 'white' }}>
                  <th className="py-3 px-4">S.no</th>
                  <th className="py-3 px-4">Employee ID</th>
                  <th className="py-3 px-4">Employee Name</th>
                  <th className="py-3 px-4">Sheet Type</th>
                  <th className="py-3 px-4">Projects</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAssignments.length > 0 ? (
                  paginatedAssignments.map((assignment, index) => (
                    <React.Fragment key={assignment._id}>
                      <tr>
                        <td className="py-3 px-4">{startIndex + index + 1}</td>
                        <td className="py-3 px-4">{assignment.empId}</td>
                        <td className="py-3 px-4">{assignment.employName}</td>
                        <td className="py-3 px-4">
                          <span className="badge bg-info text-dark">
                            {assignment.sheet}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {assignment.projects.length} project(s)
                          <button
                            className="btn btn-sm ms-2"
                            onClick={() => toggleExpand(assignment._id)}
                          >
                            {expandedRows.has(assignment._id) ? <MdExpandLess /> : <MdExpandMore />}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="d-flex gap-3">
                            <Link to={`/edit-worksheet/${assignment._id}`} title="Edit">
                              <MdEdit size={20} style={{ color: '#009788', cursor: 'pointer' }} />
                            </Link>
                            <span
                              onClick={() => handleDelete(assignment._id)}
                              title="Delete"
                              style={{ cursor: 'pointer', opacity: deletingId === assignment._id ? 0.6 : 1 }}
                            >
                              {deletingId === assignment._id ? 'Deleting...' : <MdDelete size={20} color="#dc3545" />}
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Projects Row */}
                      {expandedRows.has(assignment._id) && (
                        <tr>
                          <td colSpan="6" className="px-4 pb-3">
                            <div className="row g-3">
                              {assignment.projects.map((project, pIndex) => (
                                <div key={pIndex} className="col-md-6 col-lg-4">
                                  <div className="card border">
                                    <div className="card-body p-3">
                                      <h6 className="fw-bold mb-2">{project.projectName}</h6>
                                      <p className="mb-1"><small>Start: {new Date(project.startDate).toLocaleDateString()}</small></p>
                                      <p className="mb-1"><small>End: {new Date(project.endDate).toLocaleDateString()}</small></p>
                                      <p className="mb-1"><small>Hours: {project.hours}</small></p>
                                      <p className="mb-1"><small>Shift: {project.shift}</small></p>
                                      {project.comment && (
                                        <p className="mb-0"><small>Comment: {project.comment}</small></p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">No assignments found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <nav>
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}>
                      Prev
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignedWorks;