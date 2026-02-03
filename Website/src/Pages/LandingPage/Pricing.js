import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Images from '../../assets/Images'
import Icons from '../../assets/Icons'


// const [_Plans, setPlans] = useState([
//     {
//         id: "pre_construction",
//         title: "Pre-Construction",
//         price: "999",
//         monthly_price: "999",
//         yearly_reduce_percentage: 34,
//         yearly_price: "659",
//         duration: pricingType,
//         isGST: true,
//         description: "Super fast Estimation & Customized Proposals Builder",
//         included: [
//             "Estimating",
//             "Proposals",
//             "BOQ Reports",
//             "One-Time Schedule of rates",
//             "One-Time Analysis of work rates",
//             "Customized Proposal Builder",
//             "Advanced Roles & Permissions",
//             "Business Hours Support",
//             "Unlimited Projects",
//             "Includes 10 Users"
//         ],
//         button_label: "Contact Us",
//             link: "/contact"
//     },
//     {
//         id: "basic",
//         title: "Basic",
//         price: "3,999",
//         monthly_price: "3,999",
//         yearly_reduce_percentage: 34,
//         yearly_price: "2,639",
//         duration: pricingType,
//         isGST: true,
//         description: "Project Management & Labour Tracking",
//         included: [
//             "Pre-Construction",
//             "Labour & Vendor Tracking",
//             "Tasks bulk upload (Excel)",
//             "Tasks Updates with UOM & Photos",
//             "Task & Issue Management",
//             "Daily Progress reporting Issues Reporting: Open & Closed",
//             "Labour Petty cash tracking",
//             "Reports and Dashboards",
//             "Advanced Roles & Permissions",
//             "Business Hours Support",
//             "Unlimited Projects",
//             "Includes 15 Users"
//         ],
//         button_label: "Contact Us",
//             link: "/contact"
//     },
//     {
//         id: "pro",
//         title: "Pro",
//         price: "9,999",
//         monthly_price: "9,999",
//         yearly_reduce_percentage: 34,
//         yearly_price: "6,599",
//         duration: pricingType,
//         isGST: true,
//         description: "Advanced Project, Inventory & Financials Tracking ",
//         included: [
//             "All in Basic",
//             "Actual vs Estimated Tracking",
//             "Material: Indent, Inventory, GRN.",
//             "Purchase Orders & Bills",
//             "Labor Payables",
//             "Vendor Attendance and Payables",
//             "Change Orders",
//             "Client Payables",
//             "Budgets",
//             "Expense Tracking",
//             "Business Hours Support",
//             "3 months Setup Support & Training",
//             "Includes 20 Users"
//         ],
//         button_label: "Contact Us",
//             link: "/contact"
//     },
//     {
//         id: "advanced",
//         title: "Advanced",
//         price: "Custom",
//         monthly_price: "Custom",
//         yearly_price: "Custom",
//         duration: pricingType,
//         isGST: true,
//         description: "Customized Project Management & Financials Tracking",
//         included: [
//             "All in Pro",
//             "Auto-Scheduling",
//             "Gantt, Dependency, Critical Path",
//             "Custom reports",
//             "Custom dashboards",
//             "Custom requested features",
//             "Business Hours Support",
//             "Dedicated Key Account Manager",
//             "Includes Custom Users"
//         ],
//         button_label: "Contact Us",
//         link: "/contact"
//     },
// ])

const Pricing = () => {


    const [pricingType, setPricingType] = useState('yearly')
    const [mobileOpenedPlan, setMobileOpenedPlan] = useState('')


    const [Plans, setPlans] = useState([
        {
            id: "pro-paln",
            title: "Starter Plan",
            price: "2,999",
            monthly_price: "2,999",
            yearly_reduce_percentage: 34,
            yearly_price: "2,999",
            duration: pricingType,
            isGST: true,
            description: "Super fast Estimation & Customized Proposals Builder",
            included: [
                "Estimating",
                "Proposals",
                "BOQ Reports",
                "One-Time Schedule of rates",
                "One-Time Analysis of work rates",
                "Customized Proposal Builder",
                "Advanced Roles & Permissions",
                "Business Hours Support",
                "Unlimited Projects",
                "Includes 10 Users"
            ],
            button_label: "Contact Us",
            link: "/contact"
        },
        {
            id: "pro",
            title: "Growth Plan",
            price: "5,999",
            monthly_price: "5,999",
            yearly_reduce_percentage: 34,
            yearly_price: "5,999",
            duration: pricingType,
            is_popular: false,
            isGST: true,
            description: "Track your entire project from one App",
            included: [
                "Smart Analytics",
                "Pre-Construction",
                "Purchase Management",
                "Inventory Management",
                "Material Tracking",
                "Labour, Vendor Payables & Tracking",
                "Project Management",
                "Change Orders",
                "Client Payables",
                "Budgets",
                "Expense Tracking",
                "Reporting",
                "Support",
                "Includes 20 Users"
            ],
            button_label: "Contact Us",
            link: "/contact"
        },
        {
            id: "advanced",
            title: "Enterprise Plan",
            price: "Custom",
            is_comingsoon: true,
            monthly_price: "Custom",
            yearly_price: "Custom",
            duration: pricingType,
            isGST: true,
            is_popular: true,
            description: "Customized Project Management & Financials Tracking",
            included: [
                "All in Pro",
                "Auto-Scheduling",
                "Gantt, Dependency, Critical Path",
                "Custom reports",
                "Custom dashboards",
                "Custom requested features",
                "Business Hours Support",
                "Dedicated Key Account Manager",
                "Includes Custom Users"
            ],
            button_label: "Contact Us",
            link: "/contact"
        },
    ])

    const HandlePricingType = (type) => {

        setPricingType(type)

        let _Plans = Plans.map((plan, i) => {

            if (type == 'yearly') {
                plan.price = plan.monthly_price
                plan.duration = 'year'
            } else {
                plan.price = plan.monthly_price
                plan.duration = 'month'
            }
            return plan
        })

        setPlans(_Plans)


    }

    return (
        <div className="project-pricing-main">
            <div className="pricing-content-main" style={{ marginTop: '80px' }}>
                <div className="pricing-content" >
                    <div className="heading">
                        <div className="title">Civilator Pricing</div>
                        <div className="desc">
                            Choose the plan that works you best you can upgrade or
                            cancel your plan anytime, no questions asked.
                        </div>
                    </div>
                    <div className="pricing-type-toggles" style={{ display: 'none' }}>
                        <div className="type-toggles-content">
                            <div className={`type-toggles-item ${pricingType == 'monthly' ? 'type-toggles-active' : ''}`} onClick={(e) => HandlePricingType('monthly')} id='monthly'>Monthly</div>
                            <div className={`type-toggles-item ${pricingType == 'yearly' ? 'type-toggles-active' : ''}`} onClick={(e) => HandlePricingType('yearly')} id='yearly'>Yearly</div>
                        </div>
                        <div className="toggle-notes">(SAVE UP TO 34%)</div>
                    </div>

                    <div className="pricing-plans">
                        <div className="plans-content">
                            {Plans.map((plan, i) => (
                                <div
                                    key={plan.id}
                                    id={plan.id}
                                    className={`plan-item ${plan.is_popular ? 'plan-popular' : ''}`}
                                >
                                    {plan.is_popular ? <div className="plan-popular-label">MOST POPULAR</div> : ''}
                                    <div className='plan-item-content'>
                                        <div className="plan-header">
                                            <div className="plan-title">{plan.title}</div>
                                            <div className="plan-price" style={{ display: 'none' }}>
                                                <span className='price'>
                                                    <span className='price-currency'>₹</span>
                                                    <div className="price-value">{plan.price}</div>
                                                </span>
                                                <span className='gst'>{plan.duration ? `/month billed ${pricingType}` : ""}{plan.isGST ? " + GST" : ""}</span>
                                            </div>
                                            <div className="plan-explain">{plan.description}</div>
                                        </div>
                                        <div
                                            className="plan-mobileview-showdetials-btn"
                                            onClick={(e) => setMobileOpenedPlan(mobileOpenedPlan == plan.id ? '' : plan.id)}
                                        >
                                            <div
                                                className="icon"
                                                dangerouslySetInnerHTML={{ __html: Icons.general.dropdown_arrow }}
                                            ></div>
                                        </div>
                                        <div className={`plan-detials ${mobileOpenedPlan == plan.id ? '' : 'plan-mobileview-disabled'}`}>
                                            <div className="plan-detials-title">What's included</div>
                                            <div className="plan-detials-items">
                                                {plan.included.map((item, i) => (
                                                    <div className="plain-detials-item">
                                                        <div
                                                            className="icon"
                                                            dangerouslySetInnerHTML={{ __html: Icons.general.tick }}
                                                        >
                                                        </div>
                                                        <div className="label">{item}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <Link to={plan.link || "#"} className="plan-button">
                                        <div className="label">{plan.button_label}</div>
                                        <div className="icon"
                                            dangerouslySetInnerHTML={{ __html: Icons.general.arrow_right }}
                                        ></div>
                                    </Link>
                                </div>
                            ))}


                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pricing;