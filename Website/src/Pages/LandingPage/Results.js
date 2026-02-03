import React, { useEffect, useState, useRef, useCallback, useMemo, StrictMode } from 'react'
import { Route, Routes, BrowserRouter, Link, useLocation, Navigate, Outlet, useNavigate, useParams } from 'react-router-dom';

import Images from '../../assets/Images'
import Icons from '../../assets/Icons'

const Results = () => {


    const [ResultItems, setResultItems] = useState([
        {
            id: 1,
            icon: Icons.general.visibility,
            label: "100% Visibility",
            link: ""
        },
        {
            id: 2,
            icon: Icons.general.delays,
            label: "Avoid Delays",
            link: ""
        },
        {
            id: 3,
            icon: Icons.general.reduce_cost,
            label: "Reduce Project Cost",
            link: ""
        },
        {
            id: 4,
            icon: Icons.general.app_store,
            label: "Self Branded App",
            link: ""
        },
        {
            id: 4,
            icon: Icons.general.progress,
            label: "Improve 40% Productivity",
            link: ""
        },
        {
            id: 4,
            icon: Icons.general.quality_control,
            label: "Quality Control",
            link: ""
        },
        {
            id: 4,
            icon: Icons.general.report,
            label: "Real-time Reports",
            link: ""
        },
        {
            id: 4,
            icon: Icons.general.team,
            label: "Track Team",
            link: ""
        },
        {
            id: 4,
            icon: Icons.general.version_handling,
            label: "Design Version Control",
            link: ""
        },

        {
            id: 4,
            icon: Icons.general.issues,
            label: "Issues & Blocker Tracking",
            link: ""
        },
    ])


    return (
        <div className="project-results-main">
            <div className="results-main-content">
                <div className="results-header">
                    <div className="header-short">Power of Civilator</div>
                    <div className="header-title">How Civilator Can Benefit You?</div>
                    <div className="header-desc">The all-in-one Operating System for all types of Construction & Interior firms</div>
                </div>
                <div className="results-items">
                    {ResultItems.map((item, index) => (
                        <Link
                            className="results-item"
                            key={`results-item-${index}`}
                            to={item.link}
                        >
                            <div className="results-item-icon" dangerouslySetInnerHTML={{ __html: item.icon }}></div>
                            <div className="results-item-label">{item.label}</div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Results;