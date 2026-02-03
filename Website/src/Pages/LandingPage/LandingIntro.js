import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Images from '../../assets/Images'
import Icons from '../../assets/Icons'

const LandingIntro = () => {


    return (
        <div className="project-landingintro-main">
            <div className="landingintro-content-main">
                <div className="landingintro-left-main">
                    <h1 className='heading'>
                        Revolutionize<br />
                        Your <span className='project-text-active'>Construction </span><br />
                        & <span className='project-text-active'>Interiors</span> Business
                    </h1>
                    <p className='description'>

                        Streamline your project efficiency, and maximize profitability with our cutting-edge Work, Material, and Labour Management software.
                    </p>
                    <div className="footer-detials">
                        <Link to={'/requestdemo'} className="button-active">
                            <div className="label">Take a free demo</div>
                            <div
                                style={{ display: 'none' }}
                                className="icon"
                                dangerouslySetInnerHTML={{ __html: Icons.general.arrow_right_up }}
                            ></div>
                        </Link>

                        <div className="button-play" style={{ display: 'none' }}>
                            <div
                                className="icon"
                                dangerouslySetInnerHTML={{ __html: Icons.general.play_button }}
                            ></div>
                            <div className="label">Watch for free</div>
                        </div>
                        <div className="button-made" style={{ display: 'none' }}>
                            <div
                                className="icon"
                                dangerouslySetInnerHTML={{ __html: Icons.general.made_in_india }}
                            ></div>
                            <div className="label">Made in India</div>
                        </div>
                    </div>
                </div>
                <div className="landingintro-right-main">
                    <div className="landingintro-left-banner">
                        <img src={Images.LandingTopBanner} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LandingIntro;