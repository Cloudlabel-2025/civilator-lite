import React, { useEffect, useState } from 'react'

/* Redux Setup*/
import { Route, Routes, BrowserRouter, Switch } from 'react-router-dom'
import { useSelector } from 'react-redux'

import './assets/css/index.css'

import LandingPageIndex from './Pages/LandingPage/LandingPageIndex'

import Utils from './utils'

const App = () => {



  return (

    <>
      <Routes >
        <Route exact path='/*' element={<LandingPageIndex />}></Route>
      </Routes>
    </>
  )
}

export default App;
