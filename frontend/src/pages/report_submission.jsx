import { useState, useEffect } from "react";
import "./report_submission.css";

function ReportSubmission() {

  const [reportType, setReportType] = useState("LOST");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(null);
  const [location, setLocation] = useState(null);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState("");

  useEffect(() => {
    const fetchFormOptions = async () => {
      try {
        setLoadingOptions(true);
        setOptionsError("");

        const [categoriesResponse, locationsResponse] = await Promise.all([
          fetch("http://localhost:3000/api/categories"),
          fetch("http://localhost:3000/api/locations")
        ]);

        if (!categoriesResponse.ok || !locationsResponse.ok) {
          throw new Error("Failed to load categories and locations.");
        }

        const categoriesData = await categoriesResponse.json();
        const locationsData = await locationsResponse.json();

        setCategories(categoriesData);
        setLocations(locationsData);

      } catch (error) {
        setOptionsError(error.message || "Failed to load form options.");
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchFormOptions();
  }, []);

  const [locationDetail, setLocationDetail] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const today = new Date();
  const maxDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const [photo, setPhoto] = useState(null);

  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    if (!photo) {
      setPhotoPreview("");
      return;
    }

    const imageUrl = URL.createObjectURL(photo);
    setPhotoPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [photo]);

  const [reporterName, setReporterName] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [contactValue, setContactValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  const manageLink = success
    ? `${window.location.origin}/manage/${success.manageToken}`
    : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(manageLink);
      setCopied(true);
      setCopyError("");

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (error) {
      setCopyError("Failed to copy the manage link.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!itemName.trim()) {
      setError("Item name cannot be empty!");
      return;
    }

    if (!description.trim()) {
      setError("Description cannot be empty!");
      return;
    }

    if (!category) {
      setError("Please select a category!");
      return;
    }

    if (!incidentDate) {
      setError("Please select the incident date!");
      return;
    }

    if (!location) {
      setError("Please select a location!");
      return;
    }

    if (photo && photo.size > 5 * 1024 * 1024) {
      setError("Photo must not exceed 5 MB!");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (photo && !allowedTypes.includes(photo.type)) {
      setError("Only JPEG, PNG, or WebP files are allowed!");
      return;
    }

    if (!reporterName.trim()) {
      setError("Reporter name cannot be empty!");
      return;
    }

    if (!contactMethod) {
      setError("Please select a contact method!");
      return;
    }

    if (!contactValue.trim()) {
      setError("Contact information cannot be empty!");
      return;
    }

    if (contactMethod === "PHONE" || contactMethod === "WHATSAPP") {
      const phoneNumber = contactValue.replace(/[ -]/g, "");
      const phoneRegex = /^\+?\d{8,15}$/;

      if (!phoneRegex.test(phoneNumber)) {
        setError("Please enter a valid phone number!");
        return;
      }
    }

    if (contactMethod === "LINE") {
      const lineRegex = /^[a-zA-Z0-9._-]{4,20}$/;

      if (!lineRegex.test(contactValue)) {
        setError("LINE ID must be 4-20 characters and only contain letters, numbers, dots, hyphens, or underscores!");
        return;
      }
    }

    if (contactMethod === "DISCORD") {
      const discordRegex = /^[a-zA-Z0-9._]{1,32}$/;

      if (!discordRegex.test(contactValue)) {
        setError("Please enter a valid Discord username!");
        return;
      }
    }

    const cleanItemName = itemName.trim();
    const cleanDescription = description.trim();
    const cleanLocationDetail = locationDetail.trim();
    const cleanReporterName = reporterName.trim();
    const cleanContactValue = contactValue.trim();

    const formData = new FormData();

    formData.append("type", reportType);
    formData.append("itemName", cleanItemName);
    formData.append("description", cleanDescription);
    formData.append("categoryId", category);
    formData.append("locationId", location);
    if (cleanLocationDetail) {
      formData.append("locationDetail", cleanLocationDetail);
    }
    formData.append("incidentDate", incidentDate);
    formData.append("reporterName", cleanReporterName);
    formData.append("contactMethod", contactMethod);
    formData.append("contactValue", cleanContactValue);

    if (photo) {
      formData.append("photo", photo);
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:3000/api/results",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit report.");
      }

      setSuccess(data);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {success ? (
        <div className="submission-success">
          <div className="success-icon">✓</div>

          <h2>Report Submitted Successfully!</h2>

          <p>
            Your report has been successfully submitted.
            You can manage your report using the link below.
          </p>

          <div className="manage-link-container">
            <label>Your Manage Link</label>

            <div className="manage-link">
              <span>{manageLink}</span>
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
            >
              {copied ? "Copied!" : "Copy Manage Link"}
            </button>
            {copyError && (
              <p className="error-message">{copyError}</p>
            )}
          </div>

          <div className="save-link-warning">
            <strong>Important!</strong>
            <p>
              Save this link somewhere safe.
              Anyone with this link can edit or remove your report.
              This link cannot be recovered if lost.
            </p>
          </div>
        </div>
      ) : (
        <form className="report-form" onSubmit={handleSubmit}>
          {optionsError && (
            <p className="error-message">{optionsError}</p>
          )}
          <section className="form-section">

            <h2>Item Information</h2>

            <div className="form-group">
              <label>Report Type*</label>

              <div className="report-type-options">
                <button type="button" className={reportType === "LOST" ? "active" : ""} onClick={() => setReportType("LOST")}>LOST</button>
                <button type="button" className={reportType === "FOUND" ? "active" : ""} onClick={() => setReportType("FOUND")}>FOUND</button>
              </div>
            </div>

            <div className="form-group">
              <label>Item Name*</label>
              <input
                type="text"
                required
                maxLength={100}
                placeholder="Enter item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Description*</label>
              <textarea
                required
                maxLength={1000}
                placeholder="Describe the item..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Category*</label>

              <div className="category-options">
                {categories.map((categoryItem) => (
                  <button
                    type="button"
                    key={categoryItem.id}
                    disabled={loadingOptions}
                    className={category === categoryItem.id ? "active" : ""}
                    onClick={() => setCategory(categoryItem.id)}
                  >
                    {categoryItem.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Location*</label>

              <select
                required
                disabled={loadingOptions}
                value={location ?? ""}
                onChange={(e) => setLocation(Number(e.target.value))}
              >
                <option value="" disabled>
                  {loadingOptions ? "Loading locations..." : "Select where the item was lost/found"}
                </option>

                {locations.map((locationItem) => (
                  <option key={locationItem.id} value={locationItem.id}>
                    {locationItem.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Location Detail (Optional)</label>
              <input
                type="text"
                maxLength={255}
                placeholder="Add a more specific location (e.g. Room A2.06)"
                value={locationDetail}
                onChange={(e) => setLocationDetail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Incident Date*</label>
              <input
                type="date"
                required
                max={maxDate}
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Photo (Optional)</label>

              {photoPreview && (
                <div className="photo-preview">
                  <img src={photoPreview} alt="Selected item preview" />
                </div>
              )}

              {photo && (
                <button
                  type="button"
                  className="remove-photo-button"
                  onClick={() => {
                    setPhoto(null);
                    document.getElementById("photo-upload").value = "";
                  }}
                >
                  Remove Photo
                </button>
              )}

              <label htmlFor="photo-upload" className="upload-box">
                <span>📷</span>
                <span>{photo ? photo.name : "Click to upload photo"}</span>
                <small>JPEG, PNG, or WebP (Max. 5 MB)</small>
              </label>

              <input
                id="photo-upload"
                className="photo-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setPhoto(e.target.files[0])}
              />
            </div>
          </section>

          <section className="form-section">
            <h2>Reporter Information</h2>

            <div className="form-group">
              <label>Reporter Name*</label>
              <input
                type="text"
                required
                maxLength={100}
                placeholder="Enter your name"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Contact Method*</label>
              <select
                required
                value={contactMethod}
                onChange={(e) => setContactMethod(e.target.value)}
              >
                <option value="" disabled>Select your preferred contact method</option>
                <option value="LINE">LINE</option>
                <option value="PHONE">Phone</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="EMAIL">Email</option>
                <option value="DISCORD">Discord</option>
              </select>
            </div>

            <div className="form-group">
              <label>Contact Information*</label>
              <input
                type={contactMethod === "EMAIL" ? "email" : "text"}
                required
                maxLength={100}
                placeholder="Enter your contact information"
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
              />
            </div>
          </section>

          {error && (
            <p className="error-message">{error}</p>
          )}
          <button type="submit" disabled={loading || loadingOptions || !!optionsError}>
            {loading
              ? "Submitting..."
              : loadingOptions
                ? "Loading Form..."
                : "Submit Report"}
          </button>
        </form>
      )}
    </>
  );

}

export default ReportSubmission;