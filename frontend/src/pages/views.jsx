import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import reports from "../../../mock-data/reports.json"

import Counter from '../components/view-page/counter.jsx'

import "./views.css"



function View() {

  return (
    <>
      <div class="counter-container">
        <Counter/>
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
