import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Images from '../../assets/Images'
import Icons from '../../assets/Icons'

const AdvanceFeaturesExplain = () => {

    const [selectedHead, setSelectedHead] = useState('')
    const [selectedMenu, setSelectedMenu] = useState('')
    const [selectedMenuSource, setSelectedMenuSource] = useState(Images.Estimate_feature)
    const selectedMenuRef = useRef(null);

    const HeaderItems = [
        {
            id: 'project_management',
            icon: '',
            label: 'Project Management',
            detials: {
                title: "Project Management with Civilator",
                items: [
                    "Project Analytics Dashboard",
                    "Labour Attendance and Report",
                    "Site Reporting",
                    "Tasks and Issues",
                    "Manage Budgeting and BoQ",
                    "Material Requests and Purchases",
                    "Inventory management",
                    "Live Text & Video Chat",
                ]
            }
        },
        {
            id: 'financial_tools',
            icon: '',
            label: 'Financial Tools',
            detials: {
                title: "We take Care of All your Financial Requirements of Your Projects",
                items: [
                    "Change orders",
                    "Cost codes",
                    "Bills & Purchase orders",
                    "Schedule rate",
                    "Work rate analysis ",
                    "Invoices",
                    "Budget",
                    "Bid requests",
                ]
            }
        },
        {
            id: 'user_management',
            icon: '',
            label: 'User Management',
            detials: {
                title: "Project transparency and privacy through the right set of roles and permissions.",
                items: [
                    "Live Chat",
                    "Activity alerts",
                    "Custom Roles",
                    "Custom Permission",
                    "Smooth communication",
                    "Granular access",
                    "Automatic notifications",
                ]
            }
        },
    ]

    const HandleHeaderEvents = (item) => {

        let id = item.id
        setSelectedMenu(id)
        setSelectedHead(item)

        if (id == 'estimate') setSelectedMenuSource(Images.Estimate_feature)
        else if (id == 'takeoff') setSelectedMenuSource(Images.Takeoff_feature)
        else if (id == 'proposal') setSelectedMenuSource(Images.Proposal_feature)
    }

    useEffect(() => {

        if (selectedMenuRef.current) {
            const menu = selectedMenuRef.current.id;
            setSelectedMenu(menu);
        }
    }, [selectedMenu]);

    useEffect(() => {
        setTimeout(() => {
            setSelectedMenu(HeaderItems[0].id)
            setSelectedHead(HeaderItems[0])
        }, 0)
    }, [])

    return (
        <div className="project-advancefeatures-main">
            <div className="advancefeatures-content-main">
                <div className="advancefeatures-heading">
                    {HeaderItems.map((item, i) => (
                        <div
                            key={i}
                            id={item.id}
                            onClick={() => HandleHeaderEvents(item)}
                            className={`heading-item ${selectedMenu == item.id ? 'heading-item-active' : ''}`}
                            ref={selectedMenu == item.id ? selectedMenuRef : null}
                        >
                            <div className="icon"></div>
                            <div className="label">{item.label}</div>
                        </div>
                    ))}
                </div>
                <div className="advancefeatures-content" ref={selectedMenuRef}>

                    <div className="content-right">
                        <div className="content-right-title">
                            {selectedHead ? selectedHead.detials.title : 'Create and Share Accurate Estimates With Your Clients'}
                        </div>
                        <ul className="content-right-detials">
                            {selectedHead ?
                                selectedHead.detials.items.map((itm, i) => (
                                    <li className="detials-point" key={`featurehead-${i}`}>
                                        {itm}
                                    </li>
                                ))
                                : ''}

                        </ul>
                    </div>
                    <div className="content-left">
                        <div className="content-left-banner">
                            <div className="banner-bg">
                                <div className="banner-topbar"
                                    dangerouslySetInnerHTML={{ __html: Icons.general.banner_topbar }}
                                ></div>
                                <div className="banner-content">
                                    <video
                                        className="banner-content-video"
                                        poster={selectedMenuSource}
                                        muted={true}
                                        autoPlay={true}
                                        loop={true}
                                        playsInline={true}
                                        src={selectedMenuSource}
                                        preload="auto"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="advancefeatures-footer">
                    <div className="footer-buttons">
                        <Link to={'/requestdemo'} className="footer-button footer-button-active">
                            <div className="label">REQUEST DEMO</div>
                            <div
                                className="icon"
                                dangerouslySetInnerHTML={{ __html: Icons.general.arrow_right_up }}
                            ></div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdvanceFeaturesExplain;