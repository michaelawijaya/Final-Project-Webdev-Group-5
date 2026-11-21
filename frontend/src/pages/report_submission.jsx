import { useState } from "react";
import categories from "../../../mock-data/categories.json";
import locations from "../../../mock-data/locations.json";
import "./report_submission.css";

function ReportSubmission() {

  const [reportType, setReportType] = useState("LOST");
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationDetail, setLocationDetail] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const today = new Date();
  const maxDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const [photo, setPhoto] = useState(null);
  const [reporterName, setReporterName] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [contactValue, setContactValue] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!itemName.trim()) {
      alert("Item name cannot be empty!");
      return;
    }

    if (!description.trim()) {
      alert("Description cannot be empty!");
      return;
    }

    if (!category) {
      alert("Please select a category!");
      return;
    }

    if (photo && photo.size > 5 * 1024 * 1024) {
      alert("Photo must not exceed 5 MB!");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (photo && !allowedTypes.includes(photo.type)) {
      alert("Only JPEG, PNG, or WebP files are allowed!");
      return;
    }

    if (!reporterName.trim()) {
      alert("Reporter name cannot be empty!");
      return;
    }

    if (!contactValue.trim()) {
      alert("Contact information cannot be empty!");
      return;
    }

    if (contactMethod === "PHONE" || contactMethod === "WHATSAPP") {
      const phoneNumber = contactValue.replace(/[ -]/g, "");
      const phoneRegex = /^\+?\d{8,15}$/;

      if (!phoneRegex.test(phoneNumber)) {
        alert("Please enter a valid phone number!");
        return;
      }
    }

    if (contactMethod === "LINE") {
      const lineRegex = /^[a-zA-Z0-9._-]{4,20}$/;

      if (!lineRegex.test(contactValue)) {
        alert("LINE ID must be 4-20 characters and only contain letters, numbers, dots, hyphens, or underscores!");
        return;
      }
    }

    if (contactMethod === "DISCORD") {
      const discordRegex = /^[a-zA-Z0-9._]{1,32}$/;

      if (!discordRegex.test(contactValue)) {
        alert("Please enter a valid Discord username!");
        return;
      }
    }

    const cleanItemName = itemName.trim();
    const cleanDescription = description.trim();
    const cleanLocationDetail = locationDetail.trim();
    const cleanReporterName = reporterName.trim();
    const cleanContactValue = contactValue.trim();

    console.log({
      reportType,
      cleanItemName,
      cleanDescription,
      category,
      location,
      cleanLocationDetail,
      incidentDate,
      photo,
      cleanReporterName,
      contactMethod,
      cleanContactValue
    });
  };

  return (
    <form className="report-form" onSubmit={handleSubmit}>
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
                className={category === categoryItem.id ? "active" : ""}
                key={categoryItem.id}
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
            value={location ?? ""}
            onChange={(e) => setLocation(Number(e.target.value))}
          >
            <option value="" disabled>Select where the item was lost/found</option>

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
          <input
            className="photo-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
          {photo && <p>Selected Photo: {photo.name}</p>}
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

      <button type="submit">Submit Report</button>
    </form>
  );

}

export default ReportSubmission;