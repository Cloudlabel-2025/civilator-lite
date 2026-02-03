import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Images from '../../assets/Images'
import Icons from '../../assets/Icons'

import ReverseProxy from '../../config/reverseProxy'
import ContactUsHandler from '../../Handlers/ContactUs/ContactUs';

import SystemToastPopup from '../../components/SystemToastPopup'
import Loading from '../../components/Loading'

const ContactUs = () => {


    const navigate = useNavigate()
    const contactUsHandler = new ContactUsHandler()

    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('warning')
    const [apiFailedMessage, setApiFailedMessage] = useState('Error in Contacting')

    const [Name, setName] = useState('')
    const [Email, setEmail] = useState('')
    const [Phone, setPhone] = useState('')
    const [Message, setMessage] = useState('')


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
            email: Email,
            phone: String(Phone),
            message: Message
        }


        let response = await contactUsHandler.createContactUsHandler(request_demo_data)

        if (response.success) {
            setIsLoading(false)
            navigate(`/`)
        }
        else {
            setIsLoading(false)
            setWarningAlert(true)
            setWarningAlertType('error')
            setApiFailedMessage(`Error in Contacting, Please try again!`)
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
                        <div className='title'>Contact Us</div>
                        <div className='description'>We’ll get back to you as soon as we can. We’re here help you and answer your questions. </div>
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
                        <div className="form-input form-textarea">
                            <textarea
                                type="text"
                                className="textarea"
                                placeholder="Message *"
                                required={true}
                                name='message'
                                value={Message}
                                onChange={(e) => setMessage(e.target.value)}
                            ></textarea>
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
                <div className="requestdemo-section-left contactus-section-main">

                    <div className="contactus-header">
                        <div className="title">Contact Information</div>
                        <div className="description">ay something to hear back from us!</div>
                    </div>

                    <div className="contactus-detials-items">


                        <div className="contactus-detials-item">
                            <div className="icon"
                                dangerouslySetInnerHTML={{ __html: Icons.general.phone }}
                            ></div>
                            <div className="value">0979 171 4391</div>
                        </div>

                        <div className="contactus-detials-item">
                            <div className="icon"
                                dangerouslySetInnerHTML={{ __html: Icons.general.mail }}
                            ></div>
                            <div className="value">app.civilator@gmail.com</div>
                        </div>

                        <div className="contactus-detials-item">
                            <div className="icon"
                                dangerouslySetInnerHTML={{ __html: Icons.general.location }}
                            ></div>
                            <div className="value">1498, 19th Main Rd, Sector 4, HSR <br />Layout, Bengaluru, Karnataka 560102</div>
                        </div>
                    </div>

                    <div className="contactus-social-items">
                        <Link to={'https://www.linkedin.com/company/civilator'} target='_blank'>
                            <div className="contactus-social-item"
                                dangerouslySetInnerHTML={{ __html: Icons.social.facebook }}
                            ></div>
                        </Link>
                        <Link to={'https://www.linkedin.com/company/civilator'} target='_blank'>
                            <div className="contactus-social-item"
                                dangerouslySetInnerHTML={{ __html: Icons.social.instagram }}
                            ></div>
                        </Link>
                        <Link to={'https://www.linkedin.com/company/civilator'} target='_blank'>
                            <div className="contactus-social-item"
                                dangerouslySetInnerHTML={{ __html: Icons.social.linkedin }}
                            ></div>
                        </Link>
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

export default ContactUs;