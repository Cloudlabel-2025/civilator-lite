import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Images from '../../assets/Images'
import Icons from '../../assets/Icons'

const FeaturesExplain = () => {

    const [selectedHead, setSelectedHead] = useState('')
    const [selectedMenu, setSelectedMenu] = useState('')
    const [selectedMenuSource, setSelectedMenuSource] = useState(Images.Estimate_feature)
    const selectedMenuRef = useRef(null);

    const HeaderItems = [

        {
            id: 'estimate',
            icon: '',
            label: 'Estimate',
            detials: {
                title: "Accurate Estimation with predefined templates.",
                items: [
                    "Accurately estimate your projects with auto Estimating tool",
                    "Create faster estimation with predefined auto updating cost and work databases",
                    "Generate itemized material lists and accurate labor cost estimations, providing a comprehensive overview.",
                ]
            }
        },
        {
            id: 'takeoff',
            icon: '',
            label: 'Takeoff',
            detials: {
                title: "Faster & Accurate material takeoff using Civilator",
                items: [
                    "Direct CAD file upload for TakeoFF in clicks",
                    "Auto 3D TakeoFF for complex designs",
                    "Easy User-Friendly tools with more accuracy",
                ]
            }
        },
        {
            id: 'proposal',
            icon: '',
            label: 'Proposal',
            detials: {
                title: "Your Company customized Proposals",
                items: [
                    "Create proposal in a click directly from estimation",
                    "More customizable options for your company uniqueness",
                    "Include a proposed payment timeline to keep your cash flow stable",
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
        <div className="project-featuresexplain-main">
            <div className="featuresexplain-content-main">
                <div className="featuresexplain-heading">
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
                <div className="featuresexplain-content" ref={selectedMenuRef}>

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
                <div className="featuresexplain-footer">
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

export default FeaturesExplain;