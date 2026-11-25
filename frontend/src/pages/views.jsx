import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

// components
import Card from '../components/view-page/card.jsx';
import Counter from '../components/view-page/counter.jsx';
import Searchbar from '../components/view-page/searchbar.jsx';
// styles
import "./views.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function resolveImageUrl(imageUrl) {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  return `${API_BASE_URL}${imageUrl}`;
}

function View() {
  const [reports, setReports] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // 1. Ambil daftar kategori saat halaman pertama kali dibuka
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/categories`);
        if (!res.ok) throw new Error("Failed to load categories.");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  // 2. Ambil daftar laporan setiap kali kategori berubah
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({ limit: "50" });
        if (selectedCategory) {
          params.append("categoryId", String(selectedCategory));
        }

        const res = await fetch(`${API_BASE_URL}/api/results?${params.toString()}`);
        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.error || "Failed to fetch reports.");
        }

        setReports(result.data || []);
      } catch (err) {
        setError(err.message || "Unable to connect to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [selectedCategory]);

  // Filter berdasarkan teks di Searchbar
  const filteredReports = reports.filter((report) =>
    report.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="searchbar-container">
        <Searchbar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Tag Kategori */}
      <div className="category-filter-container" style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", margin: "0 20px 20px" }}>
        <button
          type="button"
          onClick={() => setSelectedCategory(null)}
          style={{
            padding: "6px 14px",
            borderRadius: "999px",
            border: "1px solid #6b4535",
            backgroundColor: selectedCategory === null ? "#6b4535" : "#ffffff",
            color: selectedCategory === null ? "#ffffff" : "#502300",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            type="button"
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
            style={{
              padding: "6px 14px",
              borderRadius: "999px",
              border: "1px solid #6b4535",
              backgroundColor: selectedCategory === cat.id ? "#6b4535" : "#ffffff",
              color: selectedCategory === cat.id ? "#ffffff" : "#502300",
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="counter-container">
        <Counter count={filteredReports.length} />
      </div>

      <div className="card-container">
        {loading ? (
          <p>Loading reports...</p>
        ) : error ? (
          <div className="not-found-container">
            <p>{error}</p>
          </div>
        ) : filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <Card
              key={report.id}
              name={report.itemName}
              img={resolveImageUrl(report.imageUrl)}
              onClick={() => navigate(`/details/${report.id}`)}
            />
          ))
        ) : (
          <div className="not-found-container">
            <p>No Reports were found.</p>
            <Link to="/report-submission" className="lost-report">
              Submit a report
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default View;