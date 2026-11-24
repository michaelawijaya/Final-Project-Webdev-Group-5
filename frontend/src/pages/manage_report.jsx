import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import categories from "../../../mock-data/categories.json";
import locations from "../../../mock-data/locations.json";
import "./manage_report.css";

function ManageReport() {
    const { token } = useParams();

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

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `http://localhost:3000/api/manage/${encodeURIComponent(token)}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to load report.");
                }

                const report = data.report ?? data;
                console.log("Report data:", report);

                setReportType(report.type);
                setItemName(report.itemName);
                setDescription(report.description);
                setCategory(report.categoryId ?? report.category?.id);
                setLocation(report.locationId ?? report.location?.id);
                setLocationDetail(report.locationDetail ?? "");
                setIncidentDate(report.incidentDate?.slice(0, 10) ?? "");
                setReporterName(report.reporterName);
                setContactMethod(report.contactMethod);
                setContactValue(report.contactValue);
                setExistingPhoto(report.imageUrl ?? report.imagePath ?? "");

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [token]);

    const [reporterName, setReporterName] = useState("");
    const [contactMethod, setContactMethod] = useState("");
    const [contactValue, setContactValue] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [existingPhoto, setExistingPhoto] = useState("");
    const [removeExistingPhoto, setRemoveExistingPhoto] = useState(false);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState("");
    const [reportStatus, setReportStatus] = useState("OPEN");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    const handleUpdate = async (e) => {
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

        if (!incidentDate) {
            alert("Please select the incident date!");
            return;
        }

        if (!location) {
            alert("Please select a location!");
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

        if (!contactMethod) {
            alert("Please select a contact method!");
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

        const formData = new FormData();

        formData.append("type", reportType);
        formData.append("itemName", cleanItemName);
        formData.append("description", cleanDescription);
        formData.append("categoryId", category);
        formData.append("locationId", location);
        formData.append("locationDetail", cleanLocationDetail);
        formData.append("incidentDate", incidentDate);
        formData.append("reporterName", cleanReporterName);
        formData.append("contactMethod", contactMethod);
        formData.append("contactValue", cleanContactValue);

        if (photo) {
            formData.append("photo", photo);
        }
        formData.append("removePhoto", String(removeExistingPhoto));

        try {
            setSaving(true);
            setSuccess("");

            const response = await fetch(
                `http://localhost:3000/api/manage/${encodeURIComponent(token)}`,
                {
                    method: "PATCH",
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to update report.");
            }

            setSuccess("Report updated successfully!");
            alert("Report updated successfully!");

        } catch (err) {
            alert(err.message || "Something went wrong. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    const handleStatusChange = async (action) => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/manage/${encodeURIComponent(token)}/${action}`,
                {
                    method: "POST",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to update report status.");
            }

            setReportStatus(data.status);

        } catch (err) {
            alert(err.message || "Something went wrong. Please try again.");
        }
    };

    if (loading) {
        return <p>Loading report...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <form className="report-form" onSubmit={handleUpdate}>
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

                    {photoPreview ? (
                        <div className="photo-preview">
                            <img src={photoPreview} alt="New selected item preview" />
                        </div>
                    ) : existingPhoto && !removeExistingPhoto ? (
                        <div className="photo-preview">
                            <img
                                src={`http://localhost:3000${existingPhoto}`}
                                alt="Current item photo"
                            />
                        </div>
                    ) : null}

                    {(photo || (existingPhoto && !removeExistingPhoto)) && (
                        <button
                            type="button"
                            className="remove-photo-button"
                            onClick={() => {
                                if (photo) {
                                    setPhoto(null);
                                    document.getElementById("photo-upload").value = "";
                                } else {
                                    setRemoveExistingPhoto(true);
                                }
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

            {success && <p className="success-message">{success}</p>}

            <button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
            </button>

            {reportStatus === "OPEN" && (
                <div className="manage-actions">
                    <button
                        type="button"
                        onClick={() => {
                            setPendingAction("return");
                            setShowConfirmModal(true);
                        }}
                    >
                        {reportType === "LOST" ? "Mark as Returned" : "Mark as Claimed"}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setPendingAction("remove");
                            setShowConfirmModal(true);
                        }}
                    >
                        Remove Report
                    </button>
                </div>
            )}

            {reportStatus !== "OPEN" && (
                <p>
                    This report is {reportStatus.toLowerCase()}.
                </p>
            )}

            {showConfirmModal && (
                <div className="modal-overlay">
                    <div className="confirm-modal">
                        <h2>
                            {pendingAction === "return"
                                ? "Confirm Report Status"
                                : "Remove Report"}
                        </h2>

                        <p>
                            {pendingAction === "return"
                                ? "Are you sure you want to mark this report as returned/claimed?"
                                : "Are you sure you want to remove this report?"}
                        </p>

                        <div className="modal-actions">
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    setPendingAction(null);
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="confirm-button"
                                onClick={() => {
                                    const action = pendingAction;
                                    setShowConfirmModal(false);
                                    setPendingAction(null);
                                    handleStatusChange(action);
                                }}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );

}

export default ManageReport;