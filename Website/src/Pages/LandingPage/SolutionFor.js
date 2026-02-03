import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Images from '../../assets/Images'
import Icons from '../../assets/Icons'

const SolutionFor = () => {


    const [SolutionRoles, setSolutionRoles] = useState([
        {
            id: 'solutionfor-developers',
            title: 'Developers',
            description: 'Effortlessly track and control residential, commercial, and retail projects with precision.',
            image: Images.Company_Owner,
            alt: 'Developers'
        },
        {
            id: 'solutionfor-db',
            title: 'Design & Build Firms',
            description: 'Manage leads, proposals, design workflows, and project tracking seamlessly with Design-Build Firms and Architect Studios.',
            image: Images.Project_Manager,
            alt: 'Project Manager'
        },
        {
            id: 'solutionfor-se',
            title: 'Site Engineers',
            description: 'Stay connected with office & admin team and enhance collaboration',
            image: Images.Site_Engineer,
            alt: 'Site Engineer'
        },
    ])

    return (
        <div className="project-solutionfor-main">
            <div className="solutionfor-content-main">
                <div className="solutionfor-content-header">
                    <div className="title">Civilator is an One-Stop Solution for</div>
                </div>
                <div className="solutionfor-cards">
                    {SolutionRoles.map((role, index) => (

                        <div
                            className="solutionfor-card"
                            key={role.id}
                        >

                            <div className="solutionfor-card-banner">
                                <img src={role.image} alt={role.alt} />
                            </div>

                            <div className="solutionfor-card-detials">
                                <div className="title">{role.title}</div>
                                <div className="description">{role.description}</div>
                            </div>

                        </div>

                    ))}

                </div>
            </div>
        </div>
    )
}

export default SolutionFor;