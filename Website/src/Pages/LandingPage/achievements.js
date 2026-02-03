import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Images from '../../assets/Images'
import Icons from '../../assets/Icons'

const Achievements = () => {


    return (
        <div className="project-landingachievements-main">
            <div className="landingachievements-content-main">
                <div className="landingachievements-item">

                    <div
                        className="icon"
                        dangerouslySetInnerHTML={{ __html: Icons.general.landing_city }}
                    ></div>
                    <div className="detials">
                        <div className="title">100%</div>
                        <div className="desc">Accurate reports</div>
                    </div>
                </div>
                <div className="landingachievements-item">
                    <div
                        className="icon"
                        dangerouslySetInnerHTML={{ __html: Icons.general.landing_worth }}
                    ></div>
                    <div className="detials">
                        <div className="title">Save 10%</div>
                        <div className="desc">of your Project cost</div>
                    </div>
                </div>
                <div className="landingachievements-item">
                    <div
                        className="icon"
                        dangerouslySetInnerHTML={{ __html: Icons.general.landing_business }}
                    ></div>
                    <div className="detials">
                        <div className="title">40%</div>
                        <div className="desc">Improve productivity</div>
                    </div>
                </div>
                <div className="landingachievements-item">
                    <div
                        className="icon"
                        dangerouslySetInnerHTML={{ __html: Icons.general.landing_rating }}
                    ></div>
                    <div className="detials">
                        <div className="title">4.5/5</div>
                        <div className="desc">Customer satisfaction</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Achievements;