import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Images from '../../assets/Images'
import Icons from '../../assets/Icons'

const Sectorscovered = () => {


    const sectorCoverItems = [
        {
            id: "sector_takeoff",
            title: "Estimating",
            icon: Icons.general.estimate,
            description: `
            Accurately estimate project costs and manage budgets effectively to avoid cost overruns and maximize profitability.
            `
        },
        {
            id: "sector_takeoff",
            title: "Customized Proposals",
            icon: Icons.general.proposal,
            description: `
            Empower your proposals with Civilator's User-friendly Builder. Elevate client presentations with seamless streamlining and win contracts effortlessly.
            `
        },
        {
            id: "sector_takeoff",
            title: "Scheduling",
            icon: Icons.general.schedule,
            description: `
            Effortless scheduling, auto task assignment, real-time issue highlighting, and progress monitoring in perfect sync with your project timeline.
            `
        },
        {
            id: "sector_takeoff",
            title: "Task Management",
            icon: Icons.general.tasks,
            description: `
                Sync Schedules, Track tasks, and Monitor Progress of Team Member - All from a Unified Dashboard
            `
        },
        {
            id: "sector_takeoff",
            title: "Labour Management",
            icon: Icons.general.labour,
            description: `
                Track workers and manage your on-sites workforce needs better & effectively
            `
        },
        {
            id: "sector_takeoff",
            title: "Analytics Dashboard",
            icon: Icons.general.overview,
            description: `
                Transforming Project Data into Business Intelligence with Analytics tool – Uniting Information for a Comprehensive Insight
            `
        },

    ]


    return (
        <div className="project-sectorscovered-main">
            <div className="sectorscovered-content-main">
                <div className="heading">
                    <div>Why choose CivilATOR?</div>
                </div>
                <div className="sectorscovered-items">
                    {sectorCoverItems.map((item, i) => (
                        <div key={item.id} id={item.id} className="sectorscovered-item">
                            <div
                                className="icon"
                                dangerouslySetInnerHTML={{ __html: item.icon }}
                            ></div>
                            <div className="detials">
                                <div className="title">{item.title}</div>
                                <div className="desc"
                                    dangerouslySetInnerHTML={{ __html: item.description }}
                                ></div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    )
}

export default Sectorscovered;