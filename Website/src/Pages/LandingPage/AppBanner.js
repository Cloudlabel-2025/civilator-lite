import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Images from '../../assets/Images'
import Icons from '../../assets/Icons'

const AppBanner = () => {

    return (
        <div className="project-appbanner-main">
            <div className="appbanner-content-main">
                <div className="appbanner-content" >
                    <Link to={'/requestdemo'} className='appbanner-content-img'><img src={Images.AppBanner} /></Link>
                </div>
            </div>
        </div>
    )
}

export default AppBanner;