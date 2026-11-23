import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link} from 'react-router-dom';

import heroImg from '../../assets/hero.png'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'

import View from "../../pages/views.jsx"

import './footer.css'

function Footer() {


  return (
    <>


      <section id="center">
        <h1>Footer</h1>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default Footer
