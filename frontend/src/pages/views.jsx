import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import reports from "../../../mock-data/reports.json"

// components
import Card from '../components/view-page/card.jsx'
import Counter from '../components/view-page/counter.jsx'
// styles
import "./views.css"



function View() {

  return (
    <>
      <div class="counter-container">
        <Counter/>
      </div>

      <div class="card-container">
        {reports.map((report) => (
          <Card key={report.id} name={report.itemName}/>
        ))}
      </div>

      <ul>
        {reports.map((report) => (
          <li key={report.id}>
            <h2>{report.title}</h2>
            <p>{report.description}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

export default View
