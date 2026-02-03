import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Images from '../../assets/Images'
import Icons from '../../assets/Icons'

const TrustBanner = () => {

    return (
        <div className="project-trustBanner-main">
            <div className="trustBanner-content-main">
                <div className="trustBanner-content" >
                    <div className="trustBanner-left">
                        <span className='title'>Take the first step today!</span>
                        <span className='desc'>See how Civilator can Cut-Off your losses</span>
                    </div>
                    <div className="trustBanner-right">
                        <Link to={'/requestdemo'} className="trustBanner-button">
                            REQUEST DEMO
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TrustBanner;