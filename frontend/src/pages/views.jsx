import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import reports from "../../../mock-data/reports.json"

// components
import Card from '../components/view-page/card.jsx'
import Counter from '../components/view-page/counter.jsx'
import Searchbar from '../components/view-page/searchbar.jsx'
// styles
import "./views.css"



function View() {

  return (
    <>
      <div class="searchbar-container">
        <Searchbar />
      </div>
      <div class="counter-container">
        <Counter/>
      </div>

      <div class="card-container">
        {reports.map((report) => (
          <Card key={report.id} name={report.itemName} img={report.imagePath} />
        ))}
      </div>
    </>
  )
}

export default View
