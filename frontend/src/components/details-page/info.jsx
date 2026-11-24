import React from 'react';
import styled from 'styled-components';

const Info = ({ report }) => {
  if (!report) return null;

  // Format tanggal agar lebih mudah dibaca
  const formattedDate = report.incidentDate
    ? new Date(report.incidentDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-';

  return (
    <StyledWrapper>
      <div className="notification">
        <div className="notiglow" />
        <div className="notiborderglow" />

        {/* Header: Nama Barang + Badge Type & Status */}
        <div className="notiheader">
          <div className="notititle">{report.itemName}</div>
          <div className="badges">
            {report.status && (
              <span className="badge badge-status">{report.status}</span>
            )}
          </div>
        </div>

        {/* Deskripsi Barang */}
        <div className="notibody">{report.description}</div>

        {/* Detail Tambahan: Lokasi, Waktu, Pelapor, Kontak */}
        <div className="notidetails">
          <div className="detail-item">
            <span className="detail-label">Location</span>
            <span className="detail-value">{report.locationDetail || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Date</span>
            <span className="detail-value">{formattedDate}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Reporter</span>
            <span className="detail-value">{report.reporterName || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Contact ({report.contactMethod})</span>
            <span className="detail-value">{report.contactValue || '-'}</span>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  width: 100%;

  .notification {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    isolation: isolate;
    position: relative;
    width: 100%;
    max-width: 38rem; /* Diperlebar dari 28rem */
    min-height: 22.5rem; /* Ditinggikan (360px, sejajar dengan tinggi kartu foto Pic) */
    height: auto;
    padding-bottom: 1.75rem;
    background: #6b4535;
    border-radius: 1.25rem;
    overflow: hidden;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 18px;
    --gradient: linear-gradient(to bottom, #a47148, #6b4535, #502300);
    --color: #502300;
    box-shadow: 0 6px 20px rgba(80, 35, 0, 0.14);
  }

  /* Lapisan dalam putih */
  .notification:before {
    position: absolute;
    content: "";
    inset: 0.15rem;
    border-radius: 1.125rem;
    background: #ffffff;
    z-index: 2;
  }

  /* Garis aksen vertikal coklat di sisi kiri */
  .notification:after {
    position: absolute;
    content: "";
    width: 0.35rem;
    inset: 1.25rem auto 1.25rem 0.85rem;
    border-radius: 0.2rem;
    background: var(--gradient);
    transition: transform 300ms ease;
    z-index: 4;
  }

  .notification:hover:after {
    transform: translateX(0.2rem);
  }

  .notiheader {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.4rem 1.75rem 0.6rem 1.9rem;
    z-index: 5;
    transition: transform 300ms ease;
  }

  .notification:hover .notiheader {
    transform: translateX(0.2rem);
  }

  .notititle {
    color: var(--color);
    font-weight: 700;
    font-size: 1.65rem; /* Diperbesar dari 1.25rem */
    line-height: 1.2;
  }

  .badges {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .badge {
    font-size: 0.8rem;
    font-weight: 700;
    padding: 0.3rem 0.75rem;
    border-radius: 999px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .badge-type {
    background-color: #6b4535;
    color: #ffffff;
  }

  .badge-status {
    background-color: #f5ebe0;
    color: #502300;
    border: 1px solid #d5bdaf;
  }

  .notibody {
    color: #5c4738;
    padding: 0.35rem 1.75rem 1.25rem 1.9rem;
    font-size: 1.05rem; /* Diperbesar dari 0.95rem */
    line-height: 1.6;
    transition: transform 300ms ease;
    z-index: 5;
  }

  .notification:hover .notibody {
    transform: translateX(0.25rem);
  }

  /* Grid informasi tambahan */
  .notidetails {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem 1.5rem;
    margin: 0 1.75rem 0 1.9rem;
    padding-top: 1.1rem;
    border-top: 1px solid #ede0d4;
    z-index: 5;
    transition: transform 300ms ease;
  }

  .notification:hover .notidetails {
    transform: translateX(0.25rem);
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .detail-label {
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #9c7a63;
  }

  .detail-value {
    font-size: 1.05rem;
    font-weight: 600;
    color: #3d1c02;
    word-break: break-word;
  }

  .notiglow,
  .notiborderglow {
    position: absolute;
    width: 26rem;
    height: 26rem;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle closest-side at center, #a47148, transparent);
    opacity: 0;
    transition: opacity 300ms ease;
    pointer-events: none;
  }

  .notiglow {
    z-index: 3;
  }

  .notiborderglow {
    z-index: 1;
  }

  .notification:hover .notiglow,
  .notification:hover .notiborderglow {
    opacity: 0.08;
  }
`;

export default Info;