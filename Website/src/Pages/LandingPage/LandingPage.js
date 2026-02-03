import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, Route, Routes, BrowserRouter } from 'react-router-dom'

import Header from './Header'
import LandingIntro from './LandingIntro'
import Achievements from './achievements'
import Sectorscovered from './sectorscovered'
import FeaturesExplain from './featuresExplain'
import Features from './Features'
import Results from './Results'
import FeaturesLeverage from './featuresLeverage'
import AnyDevicesAccess from './anyDevicesAccess'
import TrustBanner from './trustBanner'
import Workdemo from './workdemo'
import SolutionFor from './SolutionFor'
import Benefits from './Benefits'
import RequestDemo from './RequestDemo'
import CustomerSwipper from './CustomerSwipper'
import ContactUs from './ContactUs'

const LandingPage = () => {

    return (
        <div className="project-landingpage-main">

            <Routes>
                <Route exact path='/requestdemo/*' element={<RequestDemo />}></Route>
                <Route exact path='/contact/*' element={<ContactUs />}></Route>
            </Routes>


            <div className="landingpage-content-main">
                <LandingIntro />

                <SolutionFor />
                <Features />
                <Results />
                <Workdemo />
                {/* <FeaturesExplain /> */}
                {/* <Achievements /> */}
                <AnyDevicesAccess />
                <TrustBanner />

                <CustomerSwipper />
            </div>
        </div>
    )
}

export default LandingPage;