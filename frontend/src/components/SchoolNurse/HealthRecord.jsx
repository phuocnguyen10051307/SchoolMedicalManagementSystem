import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import './HealthRecord.css';

const HealthRecord = () => {
  const [records, setRecords] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    const medicalEvents = JSON.parse(localStorage.getItem('medicalEvents')) || [];
    setRecords(medicalEvents);
  }, []);

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const filteredRecords =
    selectedFilter === 'All' || selectedFilter === 'Medical Events'
      ? records
      : [];

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="record-container">
      <div className="filter-buttons">
        {['All', 'Health Checkup', 'Vaccination', 'Medical Events'].map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterClick(filter)}
            className={selectedFilter === filter ? 'active' : ''}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="table-wrapper">
        <Table bordered hover responsive className="record-table mb-0">
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Class</th>
              <th>Event Type</th>
              <th>Severity Level</th>
              <th>Medication Given</th>
              <th>Description</th>
              <th>Date Time</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((record, index) => (
                <tr key={index}>
                  <td>{indexOfFirstRecord + index + 1}</td>
                  <td>{record.studentName}</td>
                  <td>{record.studentClass}</td>
                  <td>{record.eventType}</td>
                  <td>{record.severity}</td>
                  <td>{record.medicationName} {record.dosage}</td>
                  <td className="description-cell">{record.eventDesc}</td>
                  <td>{record.time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">No records available</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-numbers">
          <span
            className={`arrow ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
          >
            ←
          </span>

          {Array.from({ length: totalPages }, (_, index) => (
            <span
              key={index}
              className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </span>
          ))}

          <span
            className={`arrow ${currentPage === totalPages ? 'disabled' : ''}`}
            onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
          >
            →
          </span>
        </div>
      )}
    </div>
  );
};

export default HealthRecord;
