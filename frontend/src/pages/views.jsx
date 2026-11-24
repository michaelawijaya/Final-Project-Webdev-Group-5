import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import reports from "../../../mock-data/reports.json"

// components
import Card from '../components/view-page/card.jsx'
import Counter from '../components/view-page/counter.jsx'
import Searchbar from '../components/view-page/searchbar.jsx'
// styles
import "./views.css"



function View() {
  const[searchQuary, setSearchQuery] = useState("")

  const filteredReports = reports.filter((report) => 
    report.itemName.toLowerCase().includes(searchQuary.toLowerCase())
  );

  const navigate = useNavigate();

  return (
    <>
    
      <div class="searchbar-container">
        <Searchbar 
         value={searchQuary}
         onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div class="counter-container">
        <Counter/>
      </div>

      <div className="card-container">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <Card key={report.id} 
            name={report.itemName} 
            img={report.imagePath} 
            onClick={() => navigate(`/details/${report.id}`)}
            
            />
          ))
        ) : (
          <div class="not-found-container">
            <p>No Reports were found.</p>
            <Link to="/report-submission" className="lost-report">Submit a report</Link>
          </div>
        )}
      </div>
    </>
  )
}

export default View
