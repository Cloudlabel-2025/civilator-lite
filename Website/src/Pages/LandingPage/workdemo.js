import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Images from '../../assets/Images'
import Icons from '../../assets/Icons'

const Workdemo = () => {

    return (
        <div className="project-workdemo-main">
            <div className="workdemo-content-main">
                <div className="workdemo-content" >
                    <div className="heading">
                        <div className="title">
                            Civilator Work Flow
                        </div>
                        <div className="desc">
                            360° Vision for your project sites by civilator to track and alert you before losses and hazards
                        </div>
                    </div>
                    <div className="demo-section">
                        <video
                            className="banner-content-video"
                            poster={Images._Workdemo}
                            muted={true}
                            autoPlay={true}
                            loop={true}
                            playsInline={true}
                            src={Images._Workdemo}
                            preload="auto"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Workdemo;