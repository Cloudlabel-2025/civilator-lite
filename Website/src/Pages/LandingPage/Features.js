import React, { useEffect, useState, useRef, useCallback, useMemo, StrictMode } from 'react'
import { Route, Routes, BrowserRouter, Link, useLocation, Navigate, Outlet, useNavigate, useParams } from 'react-router-dom';

import Images from '../../assets/Images'
import Icons from '../../assets/Icons'

const Features = () => {

    const [FeatureItems, setFeatureItems] = useState([
        {
            id: '1',
            image: Images.Task_management,
            label: 'Project Management',
            desc: 'From Survey to Designs, BOQs to Vendor allocation, office-to-site and planning to handover – all teams can now collaborate on a single platform & deliver projects faster, under budget, everytime!',
            link: ''
        },
        {
            id: '2',
            image: Images.Vendor_management,
            label: 'Vendor Management​',
            desc: 'Manage all your suppliers – contractors, Production workshops and Material suppliers at one place. Establish digital rate contracts with them on standard items. Seamlessly give orders, track them and rate vendor performance.',
            link: ''
        },
        {
            id: '3',
            image: Images.Material_management,
            label: 'Material Management​',
            desc: 'Get real-time visibility of material stock on site & fasten the procurement process. Procure and allocate materials faster, Avoid Material loss or theft & Generate instant POs and GRNs.',
            link: ''
        }
    ])


    return (
        <div className="project-features-main">
            <div className="features-main-content">
                <div className="features-header">
                    <div className="header-short">Smart Features</div>
                    <div className="header-title">All Your Planning and Execution in One App</div>
                    <div className="header-desc">A quick and easy-to-use construction & interior software that securely and seamlessly manages your data</div>
                </div>
                <div className="features-items">
                    {FeatureItems.map((item, index) => (
                        <div
                            className="features-item"
                            key={`feature-item-${index}`}
                        >
                            <div className="feature-item-image">
                                <img src={item.image} alt="" />
                            </div>
                            <div className="feature-item-details">
                                <div className="details-title">{item.label}</div>
                                <div className="details-desc">{item.desc}</div>
                                <Link to={item.link} className="details-button">
                                    <div className="label">Explore all features</div>
                                    <div className="icon" dangerouslySetInnerHTML={{ __html: Icons.general.arrow_right }}></div>
                                </Link>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    )
}

export default Features;