import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Kolom 1: Identitas Platform */}
          <div className="footer-brand">
            <h3 className="brand-title">Lost &amp; Found</h3>
            <p className="brand-desc">
              A simple platform to find or report lost belongings in campus area
            </p>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div className="footer-links">
            <h4 className="footer-heading">Navigation</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/Views">Browse Reports</Link>
              </li>
              <li>
                <Link to="/report-submission">Submit a Report</Link>
              </li>
            
            </ul>
          </div>
        </div>

        {/* Baris Bawah: Copyright */}
        <div className="footer-bottom">
          <p>&copy; 2026 Lost &amp; Found. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;