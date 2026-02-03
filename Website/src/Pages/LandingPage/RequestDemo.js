import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Images from '../../assets/Images'
import Icons from '../../assets/Icons'

import ReverseProxy from '../../config/reverseProxy'
import RequestDemoHandler from '../../Handlers/RequestDemo/RequestDemo';

import SystemToastPopup from '../../components/SystemToastPopup'
import Loading from '../../components/Loading'

const RequestDemo = () => {


    const navigate = useNavigate()
    const requestDemoHandler = new RequestDemoHandler()

    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('warning')
    const [apiFailedMessage, setApiFailedMessage] = useState('Error in Requesting Demo')

    const [Name, setName] = useState('')
    const [CompanyName, setCompanyName] = useState('')
    const [Email, setEmail] = useState('')
    const [Phone, setPhone] = useState('')
    const [CompanyType, setCompanyType] = useState('')
    const [CompanyAnnualTurnovers, setCompanyAnnualTurnovers] = useState('')
    const [Designation, setDesignation] = useState('')
    const [State, setState] = useState('')


    const [CompanyTypeList, setCompanyTypeList] = useState([
        {
            id: 'company_type',
            label: 'Company Type *',
            value: ''
        },
        {
            id: 'Sub-Contractor',
            label: 'Sub-Contractor',
            value: 'Sub-Contractor'
        },
        {
            id: 'General-Contractor',
            label: 'General Contractor',
            value: 'General Contractor'
        },
        {
            id: 'Developer/Builder',
            label: 'Developer/Builder',
            value: 'Developer/Builder'
        },
        {
            id: 'Project-Management-Consultancy',
            label: 'Project Management Consultancy',
            value: 'Project Management Consultancy'
        },
        {
            id: 'Others',
            label: 'Others',
            value: 'Others'
        }

    ])

    const [CompanyAnnualTurnoversList, setCompanyAnnualTurnoversList] = useState([
        {
            id: 'company_annual_turnover',
            label: 'Company Annual Turnover *',
            value: ''
        },
        {
            id: 'Less-than-1-Crore',
            label: 'Less than 1 Crore',
            value: 'Less than 1 Crore'
        },
        {
            id: '1-Crore-to-5-Crore',
            label: '1 Crore to 5 Crore',
            value: '1 Crore to 5 Crore'
        },
        {
            id: '5-Crore-to-10-Crore',
            label: '5 Crore to 10 Crore',
            value: '5 Crore to 10 Crore'
        },
        {
            id: '10-Crore-to-50-Crore',
            label: '10 Crore to 50 Crore',
            value: '10 Crore to 50 Crore'

        },
        {
            id: '50-Crore-to-100-Crore',
            label: '50 Crore to 100 Crore',
            value: '50 Crore to 100 Crore'
        },
        {
            id: 'More-than-100-Crore',
            label: 'More than 100 Crore',
            value: 'More than 100 Crore'
        }
    ])

    const [DesignationList, setDesignationList] = useState([
        {
            id: 'designation',
            label: 'Designation *',
            value: ''
        },
        {
            id: 'Student',
            label: 'Student',
            value: 'Student'
        },
        {
            id: 'Founder/CXO',
            label: 'Founder/CXO',
            value: 'Founder/CXO'
        },
        {
            id: 'Project-Manager',
            label: 'Project Manager',
            value: 'Project Manager'
        },
        {
            id: 'Planning-Manager',
            label: 'Planning Manager',
            value: 'Planning Manager'
        },
        {
            id: 'Site-Engineer',
            label: 'Site Engineer',
            value: 'Site Engineer'
        },
        {
            id: 'Site-Supervisor',
            label: 'Site Supervisor',
            value: 'Site Supervisor'
        },
        {
            id: 'Others',
            label: 'Others',
            value: 'Others'
        }
    ])

    const [StateList, setStateList] = useState([
        {
            id: 'state',
            label: 'State *',
            value: ''
        },
        {
            id: 'Andhra-Pradesh',
            label: 'Andhra Pradesh',
            value: 'Andhra Pradesh'
        },
        {
            id: 'Arunachal-Pradesh',
            label: 'Arunachal Pradesh',
            value: 'Arunachal Pradesh'
        },

        // list all states in india in alphabetical order
        {
            id: 'Assam',
            label: 'Assam',
            value: 'Assam'
        },
        {
            id: 'Bihar',
            label: 'Bihar',
            value: 'Bihar'
        },
        {
            id: 'Chhattisgarh',
            label: 'Chhattisgarh',
            value: 'Chhattisgarh'
        },
        {
            id: 'Goa',
            label: 'Goa',
            value: 'Goa'
        },
        {
            id: 'Gujarat',
            label: 'Gujarat',
            value: 'Gujarat'
        },
        {
            id: 'Haryana',
            label: 'Haryana',
            value: 'Haryana'
        },
        {
            id: 'Himachal-Pradesh',
            label: 'Himachal Pradesh',
            value: 'Himachal Pradesh'
        },
        {
            id: 'Jharkhand',
            label: 'Jharkhand',
            value: 'Jharkhand'
        },
        {
            id: 'Karnataka',
            label: 'Karnataka',
            value: 'Karnataka'
        },
        {
            id: 'Kerala',
            label: 'Kerala',
            value: 'Kerala'
        },
        {
            id: 'Madhya-Pradesh',
            label: 'Madhya Pradesh',
            value: 'Madhya Pradesh'
        },
        {
            id: 'Maharashtra',
            label: 'Maharashtra',
            value: 'Maharashtra'
        },
        {
            id: 'Manipur',
            label: 'Manipur',
            value: 'Manipur'
        },
        {
            id: 'Meghalaya',
            label: 'Meghalaya',
            value: 'Meghalaya'
        },
        {
            id: 'Mizoram',
            label: 'Mizoram',
            value: 'Mizoram'
        },
        {
            id: 'Nagaland',
            label: 'Nagaland',
            value: 'Nagaland'
        },
        {
            id: 'Odisha',
            label: 'Odisha',
            value: 'Odisha'
        },
        {
            id: 'Punjab',
            label: 'Punjab',
            value: 'Punjab'
        },
        {
            id: 'Rajasthan',
            label: 'Rajasthan',
            value: 'Rajasthan'
        },
        {
            id: 'Sikkim',
            label: 'Sikkim',
            value: 'Sikkim'
        },
        {
            id: 'Tamil-Nadu',
            label: 'Tamil Nadu',
            value: 'Tamil Nadu'
        },
        {
            id: 'Telangana',
            label: 'Telangana',
            value: 'Telangana'
        },
        {
            id: 'Tripura',
            label: 'Tripura',
            value: 'Tripura'
        },
        {
            id: 'Uttar-Pradesh',
            label: 'Uttar Pradesh',
            value: 'Uttar Pradesh'
        },
        {
            id: 'Uttarakhand',
            label: 'Uttarakhand',
            value: 'Uttarakhand'
        },
        {
            id: 'West-Bengal',
            label: 'West Bengal',
            value: 'West Bengal'
        },
        {
            id: 'Andaman-and-Nicobar-Islands',
            label: 'Andaman and Nicobar Islands',
            value: 'Andaman and Nicobar Islands'
        },
        {
            id: 'Chandigarh',
            label: 'Chandigarh',
            value: 'Chandigarh'
        },
        {
            id: 'Dadra-and-Nagar-Haveli-and-Daman-and-Diu',
            label: 'Dadra and Nagar Haveli and Daman and Diu',
            value: 'Dadra and Nagar Haveli and Daman and Diu'
        },
        {
            id: 'Lakshadweep',
            label: 'Lakshadweep',
            value: 'Lakshadweep'
        },
        {
            id: 'Delhi',
            label: 'Delhi',
            value: 'Delhi'
        },
        {
            id: 'Puducherry',
            label: 'Puducherry',
            value: 'Puducherry'
        }
    ])


    const HandleClosePopup = () => {
        navigate(`/`)
    }

    const ValidateEmail = (email) => {
        let re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    const ValidatePhone = (phone) => {
        return phone.length === 10
    }

    const HandleSumbitForm = async (e) => {
        e.preventDefault()

        let is_email_valid = ValidateEmail(Email)
        let is_phone_valid = ValidatePhone(Phone)

        if (!is_email_valid) {
            setWarningAlert(true)
            setWarningAlertType('warning')
            setApiFailedMessage(`Enter a valid email address`)
            return
        }

        if (!is_phone_valid) {
            setWarningAlert(true)
            setWarningAlertType('warning')
            setApiFailedMessage(`Enter a valid phone number`)
            return
        }

        let request_demo_data = {
            name: Name,
            company_name: CompanyName,
            email: Email,
            phone: String(Phone),
            state: State,
            company_type: CompanyType,
            company_annual_turnover: CompanyAnnualTurnovers,
            designation: Designation
        }


        let response = await requestDemoHandler.createRequestDemoHandler(request_demo_data)

        if (response.success) {
            setIsLoading(false)
            navigate(`/`)
        }
        else {
            setIsLoading(false)
            setWarningAlert(true)
            setWarningAlertType('error')
            setApiFailedMessage(`Error in Request, Please try again!`)
        }

    }
    return (
        <>
            <div className="requestdemo-block-ui"></div>

            <div className="landing-requestdemo-main">


                <form className="requestdemo-section-right" onSubmit={HandleSumbitForm}>

                    <div
                        className="requestdemo-close-btn"
                        onClick={HandleClosePopup}
                    >
                        <div className="icon"
                            dangerouslySetInnerHTML={{ __html: Icons.general.close_small }}
                        ></div>
                    </div>


                    <div className="form-section-header">
                        <div className='title'>REQUEST DEMO</div>
                        <div className='description'>Fill out the form below and we will get back to you as soon as possible.</div>
                    </div>
                    <div className="form-section-inputs">
                        <div className="form-input">
                            <input
                                type="text"
                                className="input"
                                placeholder="Name *"
                                required={true}
                                name='name'
                                value={Name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="form-input">
                            <input
                                type="text"
                                className="input"
                                placeholder="Company Name *"
                                required={true}
                                name='company_name'
                                value={CompanyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </div>
                        <div className="form-input">
                            <input
                                type="text"
                                className="input"
                                placeholder="Work Email *"
                                required={true}
                                name='email'
                                value={Email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-input">
                            <input
                                type="number"
                                className="input"
                                placeholder="Phone No *"
                                required={true}
                                name='phone'
                                value={Phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div className="form-input">
                            <select
                                placeholder="State *"
                                required={true}
                                name='state'
                                value={State}
                                onChange={(e) => setState(e.target.value)}
                            >
                                {StateList.map((item) => (
                                    <option
                                        key={item.id}
                                        value={item.value}
                                    >{item.label}</option>
                                ))}

                            </select>
                        </div>

                        <div className="form-input">
                            <select
                                placeholder="Company Type *"
                                required={true}
                                value={CompanyType}
                                onChange={(e) => setCompanyType(e.target.value)}
                            >
                                {CompanyTypeList.map((item) => (
                                    <option
                                        key={item.id}
                                        value={item.value}
                                    >{item.label}</option>
                                ))}

                            </select>
                        </div>
                        <div className="form-input">
                            <select
                                placeholder="Company Annual Turnover *"
                                required={true}
                                value={CompanyAnnualTurnovers}
                                onChange={(e) => setCompanyAnnualTurnovers(e.target.value)}
                            >
                                {CompanyAnnualTurnoversList.map((item) => (
                                    <option
                                        key={item.id}
                                        value={item.value}
                                    >{item.label}</option>
                                ))}

                            </select>
                        </div>
                        <div className="form-input">
                            <select
                                placeholder="Designation *"
                                required={true}
                                name='designation'
                                value={Designation}
                                onChange={(e) => setDesignation(e.target.value)}
                            >
                                {DesignationList.map((item) => (
                                    <option
                                        key={item.id}
                                        value={item.value}
                                    >{item.label}</option>
                                ))}

                            </select>
                        </div>



                    </div>
                    <div className="form-section-buttons">
                        <button
                            type="submit"
                            className="form-submit-button"
                        >
                            Submit
                        </button>

                    </div>
                </form>
                <div className="requestdemo-section-left requestdemo-section-main">

                    <div className="requestdemo-header">
                        <div className="title">Avoid delays and save upto 10% on project costs</div>
                    </div>

                    <div className="requestdemo-detials-items">


                        <div className="requestdemo-detials-item">
                            <div className="icon"
                                dangerouslySetInnerHTML={{ __html: Icons.general.tick_mark }}
                            ></div>
                            <div className="value">Project Progress Visibility and Monitoring</div>
                        </div>

                        <div className="requestdemo-detials-item">
                            <div className="icon"
                                dangerouslySetInnerHTML={{ __html: Icons.general.tick_mark }}
                            ></div>
                            <div className="value">Material Tracking and Vendor Payable</div>
                        </div>

                        <div className="requestdemo-detials-item">
                            <div className="icon"
                                dangerouslySetInnerHTML={{ __html: Icons.general.tick_mark }}
                            ></div>
                            <div className="value">Inventory Management and much more</div>
                        </div>
                        <div className="requestdemo-detials-item">
                            <div className="icon"
                                dangerouslySetInnerHTML={{ __html: Icons.general.tick_mark }}
                            ></div>
                            <div className="value">Pricing and Engagement Plan</div>
                        </div>
                    </div>

                    <div className="requestdemo-banner-items">
                        <div className="requestdemo-banner-item">
                            <img
                                src={Images.Task_management}
                                alt=""
                            />

                        </div>
                    </div>

                </div>
            </div>

            {isLoading ?
                <Loading
                    props={{
                        isMainLogo: false,
                        isLabel: true
                    }} />
                : null}
            {warningAlert ?

                <SystemToastPopup
                    props={{
                        type: warningAlertType,
                        message: apiFailedMessage || "Error in Proposal",
                        callback: (confirmation) => setWarningAlert(false)
                    }} />

                : null}

        </>
    )
}

export default RequestDemo;