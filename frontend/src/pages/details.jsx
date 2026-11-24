import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Pic from "../components/details-page/picture";
import Info from "../components/details-page/info";

import "./details.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function resolveImageUrl(imageUrl) {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  return `${API_BASE_URL}${imageUrl}`;
}

function Details() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReportDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE_URL}/api/results/${encodeURIComponent(id)}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Report not found or has been recently removed.");
        }

        setReport(data);
      } catch (err) {
        setError(err.message || "Failed to load report details.");
      } finally {
        setLoading(false);
      }
    };

    fetchReportDetail();
  }, [id]);

  if (loading) return <p style={{ padding: "2rem" }}>Loading report details...</p>;
  if (error || !report) return <p style={{ padding: "2rem" }}>{error || "Report not found."}</p>;

  return (
    <main className="details-main">
      <div className="main-container">
        <Pic
          img={resolveImageUrl(report.imageUrl)}
          tapeText={report.type}
        />

        <Info report={report} />
      </div>
    </main>
  );
}

export default Details;