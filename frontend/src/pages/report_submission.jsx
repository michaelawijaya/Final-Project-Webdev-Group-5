import { useState } from "react";

function ReportSubmission() {

    const [reportType, setReportType] = useState("LOST");
    const [itemName, setItemName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const [locationDetail, setLocationDetail] = useState("");
    const [incidentDate, setIncidentDate] = useState("");
    const today = new Date();
    const maxDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const [photo, setPhoto] = useState(null);
  return (
    <div>
      <h2>Item Information</h2>

      <button type="button" onClick = {() => setReportType("LOST")}>LOST</button>
      <button type="button" onClick = {() => setReportType("FOUND")}>FOUND</button>
      <p>Selected: {reportType}</p>

      <label>Item Name</label>
      <input
        type="text"
        placeholder="Enter item name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
      />
      <p>Item Name: {itemName}</p>

      <label>Description</label>
      <textarea
        placeholder="Describe the item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <p>Description: {description}</p>    

      <label>Category</label>
      <div>
        <button type="button" onClick = {() => setCategory("Electronics")}>Electronics</button>
        <button type="button" onClick = {() => setCategory("Bags & Wallets")}>Bags & Wallets</button>
        <button type="button" onClick = {() => setCategory("Keys & Cards")}>Keys & Cards</button>
        <button type="button" onClick = {() => setCategory("Clothing & Accessories")}>Clothing & Accessories</button>
        <button type="button" onClick = {() => setCategory("Books & Stationery")}>Books & Stationery</button>
        <button type="button" onClick = {() => setCategory("Tumblers & Personal Items")}>Tumblers & Personal Items</button>
        <button type="button" onClick = {() => setCategory("Others")}>Others</button>
      </div>
      <p>Category: {category}</p>

      <label>Location</label>
      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      >
       <option value="">Select where the item was lost/found</option>
       <option value="Gedung Fasilkom">Gedung Fasilkom</option>
       <option value="Classroom">Classroom</option>
       <option value="Canteen">Canteen</option>
       <option value="Student Lounge">Student Lounge</option>
       <option value="Auditorium">Auditorium</option>
       <option value="Parking Lot">Parking Lot</option>
       <option value="Mosque">Mosque</option>
       <option value="Others">Others</option>
       </select>
      <p>Location: {location}</p>

      <label>Location Detail (Optional)</label>
      <input
        type="text"
        placeholder="Add a more specific location (e.g. Room A2.06)"
        value={locationDetail}
        onChange={(e) => setLocationDetail(e.target.value)}
      />
      <p>Location Detail: {locationDetail}</p>

      <label>Incident Date</label>
      <input
        type="date"
        max={maxDate}
        placeholder="Select date"
        value={incidentDate}
        onChange={(e) => setIncidentDate(e.target.value)}
      />
      <p>Incident Date: {incidentDate}</p>

      <label>Photo (Optional)</label>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => setPhoto(e.target.files[0])}
      />
      {photo && <p>Selected Photo: {photo.name}</p>}  
    </div>
  );

}

export default ReportSubmission;