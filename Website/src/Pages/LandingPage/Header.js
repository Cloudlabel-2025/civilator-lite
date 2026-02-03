import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Images from '../../assets/Images'
import Icons from '../../assets/Icons'

import proxyConfig from '../../config/reverseProxy'

const Header = () => {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const APP_URL = proxyConfig['appBaseUrl']

    const [header, setHeader] = useState([
        {
            id: 'features',
            label: "Features",
            isDropdown: true,
            isActive: false,
            dropdownItems: [
                {
                    id: 'featureA',
                    label: 'Pre-Construction',
                    description: 'Pre-Construction',

                    isIcon: true,
                    icon: Icons.general.estimate,
                    path: '/featurea'
                },
                {
                    id: 'featureA',
                    label: 'Project Management',
                    description: 'Project Management',

                    isIcon: true,
                    icon: Icons.general.takeoff,
                    path: '/featurea'
                },
                {
                    id: 'featureA',
                    label: 'Material Management',
                    description: 'Material Management',

                    isIcon: true,
                    icon: Icons.general.material,
                    path: '/featurea'
                },
                {
                    id: 'featureA',
                    label: 'Labour Management',
                    description: 'Labour Management',

                    isIcon: true,
                    icon: Icons.general.labour,
                    path: '/featurea'
                },
                {
                    id: 'featureA',
                    label: 'Issues Management',
                    description: 'Issues Management',

                    isIcon: true,
                    icon: Icons.general.issues,
                    path: '/featurea'
                },

                {
                    id: 'featureA',
                    label: 'Reports & Smart Analytics',
                    description: 'Reports & Smart Analytics',

                    isIcon: true,
                    icon: Icons.general.report,
                    path: '/featurea'
                },
                {
                    id: 'featureA',
                    label: 'Labour Petty Cash',
                    description: 'Labour Petty Cash',

                    isIcon: true,
                    icon: Icons.general.cost_code,
                    path: '/featurea'
                },

            ]
        },
        {
            id: 'pricing',
            label: "Pricing",
            isDropdown: false,
            isActive: false,
            isPath: true,
            path: '/pricing'
        },
        {
            id: 'resources',
            label: "Resources",
            isDropdown: false,
            isActive: false,
            isPath: true,
            path: ''
        },
        {
            id: 'contact',
            label: "Contact Us",
            isDropdown: false,
            isActive: false,
            isPath: true,
            path: '/contact'
        },
        {
            id: 'login',
            label: "Login",
            isDropdown: false,
            isActive: false,
            isPath: true,
            path: `${APP_URL}/signin`
        },

    ])

    const HandleMobileMenu = (e) => {
        setMobileMenuOpen(!mobileMenuOpen)
    }
    return (
        <div className="project-landing-header-main">
            <div className="header-content-main">
                <Link to={'https://civilator.aiseowrite.in/'} className="header-logo">
                    <img src={Images.logo} />
                </Link>
                <div className={`header-right-section ${mobileMenuOpen ? 'header-right-section-active' : ''}`}>
                    <div className="right-section-menus">
                        {header.map((head, i) => (
                            <div id={head.id} className={`header-menu-item ${head.isActive ? 'header-menu-active' : ''}`} key={i}>

                                {head.isPath ?
                                    <a href={head.path} className="menu" onClick={(e) => HandleMobileMenu(e)}>
                                        <div className="label">
                                            {head.label}
                                        </div>
                                        {head.isDropdown ?
                                            <div
                                                className="icon"
                                                dangerouslySetInnerHTML={{ __html: Icons.general.dropdown_arrow }}
                                            ></div>
                                            : ''}
                                        <span className='active-bar'></span>
                                    </a>
                                    :
                                    <div className="menu">
                                        <div className="label">
                                            {head.label}
                                        </div>
                                        {head.isDropdown ?
                                            <div
                                                className="icon"
                                                dangerouslySetInnerHTML={{ __html: Icons.general.dropdown_arrow }}
                                            ></div>
                                            : ''}
                                        <span className='active-bar'></span>
                                    </div>
                                }
                                {head.isDropdown ?
                                    <div className={`dropdown ${head.isActive ? 'dropdown-active' : ''}`}>
                                        {head.dropdownItems.map((head, i) => (
                                            <Link to={head.path} className="dropdown-menu-item" onClick={(e) => HandleMobileMenu(e)}>
                                                {head.isIcon ?
                                                    <div
                                                        className="icon"
                                                        dangerouslySetInnerHTML={{ __html: head.icon }}
                                                    ></div>
                                                    : ''}
                                                <div className="detials">
                                                    <div className="label">
                                                        {head.label}
                                                    </div>
                                                    <div className="description">
                                                        {head.description}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    : ''}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="header-action-buttons">
                    <div
                        className="header-right-mobile-menu"
                        onClick={(e) => HandleMobileMenu(e)}
                    >
                        <div
                            className="icon"
                            dangerouslySetInnerHTML={{ __html: mobileMenuOpen ? Icons.general.close : Icons.general.mobile_menu }}
                        ></div>
                    </div>
                    <Link to={'/requestdemo'} className="header-action-btn">
                        <div className="label">
                            Book A Demo
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Header;