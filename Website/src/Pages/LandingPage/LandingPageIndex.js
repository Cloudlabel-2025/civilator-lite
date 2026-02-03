import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, Route, Routes, BrowserRouter } from 'react-router-dom'

import Header from './Header'
import LandingPage from './LandingPage'
import Pricing from './Pricing'
import AppBanner from './AppBanner'
import Footer from './footer'


import TermsConditions from './TermsConditions'
import PrivacyPolicy from './PrivacyPolicy'

const LandingPageIndex = () => {

    return (
        <div className="project-landingpage-main">
            <div className="landingpage-content-main">
                <Header />
                <Routes>
                    <Route exact path='/*' element={<LandingPage />}></Route>
                    <Route exact path='/pricing/*' element={<Pricing />}></Route>

                    <Route exact path='/terms-of-use/*' element={<TermsConditions />}></Route>
                    <Route exact path='/privacy-policy/*' element={<PrivacyPolicy />}></Route>
                </Routes>
                <AppBanner />
                <Footer />
            </div>
        </div>
    )
}

export default LandingPageIndex;