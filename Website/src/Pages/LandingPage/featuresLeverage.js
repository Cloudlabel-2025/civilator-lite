import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Images from '../../assets/Images'
import Icons from '../../assets/Icons'

const FeaturesLeverage = () => {

    return (
        <div className="project-featuresLeverage-main">
            <div className="featuresLeverage-content-main">
                <div className="featuresLeverage-content" >
                    <div className="content-left">
                        <div className="content-left-banner">
                            <div className="banner-bg">
                                <div className="banner-topbar"
                                    dangerouslySetInnerHTML={{ __html: Icons.general.banner_topbar }}
                                ></div>
                                <div className="banner-content">
                                    <video
                                        className="banner-content-video"
                                        poster={Images.Schedule_feature}
                                        muted={true}
                                        autoPlay={true}
                                        loop={true}
                                        playsInline={true}
                                        src={Images.Schedule_feature}
                                        preload="auto"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="content-right">
                        <div className="content-right-title">
                            Leverage scheduling for projects on Timeline
                        </div>
                        <ul className="content-right-detials">
                            <li className="detials-point">
                                Easily manage your project timeline
                            </li>
                            <li className="detials-point">
                                Set reminders, deadlines, and milestones
                            </li>
                            <li className="detials-point">
                                Keep team organized with real-time updates
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
                </div>

            </div>
        </div>
    )
}

export default FeaturesLeverage;