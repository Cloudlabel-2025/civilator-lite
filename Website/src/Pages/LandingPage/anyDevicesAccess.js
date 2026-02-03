import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Images from '../../assets/Images'
import Icons from '../../assets/Icons'

const AnyDevicesAccess = () => {

    return (
        <div className="project-anyDevicesAccess-main">
            <div className="anyDevicesAccess-content-main">
                <div className="anyDevicesAccess-content" >
                    <div className="content-right">
                        <div className="content-right-title">
                            Access Civilator from any device
                        </div>
                        <div className="content-right-desc">
                            Don't delay reviewing your project until
                            you're back at the office. Stay informed
                            with instant project updates across all
                            devices—be it mobile, tablet, or desktop.
                            Seamlessly complete tasks from anywhere,
                            enjoying swift and protected connectivity.
                            Benefit from the freedom to retrieve data
                            from any spot, ensuring all essential
                            information is readily available.
                            Boost your productivity with effortless
                            access and responsive data retrieval.
                        </div>
                        <ul className="content-right-detials">
                            <li className="detials-point">
                                Manage your projects easier
                            </li>
                            <li className="detials-point">
                                Track & Report from anywhere
                            </li>
                            <li className="detials-point">
                                Accelerate Site activities & inspections
                            </li>
                            <li className="detials-point">
                                Access the schedule anytime
                            </li>

                        </ul>
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
                    <div className="content-left">
                        <div className="content-left-banner">
                            <div className="banner-bg">
                                <div className="banner-content">
                                    <img
                                        src={Images.AnyDevicesAccess}
                                        className="banner-content-img"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AnyDevicesAccess;