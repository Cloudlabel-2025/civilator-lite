import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Images from '../../assets/Images'
import Icons from '../../assets/Icons'

const Benefits = () => {



    return (
        <div className="project-benefits-main">
            <div className="benefits-content-main">

                <div className="benefits-content-left">
                    <div className="title">How Civilator Can Benefit You?</div>
                    <div className="benefits-checklist-items">
                        <div className="benefits-checklist-item">
                            <div className="icon"
                                dangerouslySetInnerHTML={{ __html: Icons.general.tick_mark }}
                            ></div>
                            <div className="value">Save up to 10% of your cost</div>
                        </div>
                        <div className="benefits-checklist-item">
                            <div className="icon"
                                dangerouslySetInnerHTML={{ __html: Icons.general.tick_mark }}
                            ></div>
                            <div className="value">Avoid Project Delays</div>
                        </div>
                        <div className="benefits-checklist-item">
                            <div className="icon"
                                dangerouslySetInnerHTML={{ __html: Icons.general.tick_mark }}
                            ></div>
                            <div className="value">Get 100% accurate reports</div>
                        </div>
                    </div>
                    <div className="benefits-action-buttons">
                        <Link to={'/requestdemo'}>

                            <div className="benefits-button">
                                REQUEST DEMO
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="benefits-content-right">
                    <img src={Images.Benefits} alt="Benefits" />
                </div>
            </div>
        </div>
    )
}

export default Benefits;