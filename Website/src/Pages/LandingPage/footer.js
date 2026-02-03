import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Images from '../../assets/Images'
import Icons from '../../assets/Icons'

const Footer = () => {

    const socialItems = [
        {
            id: 'social_facebook',
            label: "Facebook",
            icon: Icons.social.facebook,
            link: 'https://civilator.onrender.com/'
        },
        {
            id: 'social_twitter',
            label: "Twitter",
            icon: Icons.social.twitter,
            link: 'https://civilator.onrender.com/'
        },
        {
            id: 'social_instagram',
            label: "Instagram",
            icon: Icons.social.instagram,
            link: 'https://civilator.onrender.com/'
        },
        {
            id: 'social_linkedin',
            label: "LinkedIn",
            icon: Icons.social.linkedin,
            link: 'https://civilator.onrender.com/'
        },
    ]

    const footerRightItems = [
        {
            id: 'quick_links',
            label: "QUICK LINKS",
            items: [

                {
                    id: 'features',
                    label: "Features",
                    link: '#features',
                },
                {
                    id: 'pricing',
                    label: "Pricing",
                    link: '/pricing',
                },
                {
                    id: 'resources',
                    label: "Resources",
                    link: '/resources',
                },

                {
                    id: 'contact',
                    label: "Contact Us",
                    link: '/contact',
                },
            ]
        },
        {
            id: 'quick_links',
            label: "FEATURES",
            items: [

                {
                    id: 'featureA',
                    label: 'Pre-Construction',
                    link: '/featurea'
                },
                {
                    id: 'featureA',
                    label: 'Project Management',
                    link: '/featurea'
                },
                {
                    id: 'featureA',
                    label: 'Material Management',
                    link: '/featurea'
                },
                {
                    id: 'featureA',
                    label: 'Labour Management',
                    link: '/featurea'
                },
                {
                    id: 'featureA',
                    label: 'Issues Management',
                    link: '/featurea'
                },

                {
                    id: 'featureA',
                    label: 'Reports & Smart Analytics',
                    link: '/featurea'
                },
                {
                    id: 'featureA',
                    label: 'Labour Petty Cash',
                    link: '/featurea'
                },

            ]
        },
        {
            id: 'quick_links',
            label: "LEGAL",
            items: [
                {
                    id: 'privacy',
                    label: "Privacy",
                    link: '/privacy-policy',
                },
                {
                    id: 'terms',
                    label: "Terms of Use",
                    link: '/terms-of-use',
                },

            ]
        },

    ]
    return (
        <div className="project-footer-main">
            <div className="footer-content-main">
                <div className="footer-content" >
                    <div className="footer-left">
                        <div className="logo">
                            <img src={Images.logo} />
                        </div>
                        <div className="description">
                            We’re here to improve and track losses of your Sites and streamline your team communication for better collaboration on your construction projects.
                        </div>
                        <div className="social-links">
                            {socialItems.map((social, i) => (
                                <Link key={social.id} id={social.id} target='_blank' to={social.link} className="social-link">
                                    <div
                                        className="icon"
                                        dangerouslySetInnerHTML={{ __html: social.icon }}
                                    ></div>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="footer-right">
                        <div className="right-items">
                            {footerRightItems.map((Item, indx) => (
                                <div key={Item.id} className="right-subitem">
                                    <div className="title">
                                        {Item.label}
                                    </div>
                                    <div className="items">
                                        {Item.items.map((itm, i) => (
                                            <a className='item' key={itm.id} href={itm.link}>
                                                {itm.label}
                                            </a>
                                        ))}

                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
                <div className="footer-copyrights">
                    <div className="copyrights">
                        Copyright ©2024 Civilator.in
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;