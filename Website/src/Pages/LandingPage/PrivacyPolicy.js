import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Images from '../../assets/Images'
import Icons from '../../assets/Icons'


const PrivacyPolicy = () => {


    const navigate = useNavigate()

    const [Content, setContent] = useState(
        `
        <p><p>This page is to inform app visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service, “Civilator”.</p><p><br></p><p>If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.</p><p><br></p><p><strong style="background-color: transparent;">Information Collection and Use</strong></p><p>For a better experience, while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to your name, phone number, and postal address. The information that we collect will be used to contact or identify you.</p><p><br></p><p><strong style="background-color: transparent;">Log Data</strong></p><p>We want to inform you that whenever you visit our Service, we collect information that your app sends to us which is called Log Data. This Log Data may include information such as your device details, photos that you share, and other statistics. We use the best security solutions offered in the market.</p><p><br></p><p><strong style="background-color: transparent;">Service Providers</strong></p><p>We may employ third-party companies and individuals due to the following reasons:</p><p>‍</p><p>We want to inform our Service users that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.SecurityWe value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.Links to Other SitesOur Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.​Changes to This Privacy PolicyWe may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately after they are posted on this page.Contact UsIf you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.</p><p><br></p><ol><li>To facilitate our Service</li><li>To facilitate our Service</li><li>To provide the Service on our behalf;</li><li>To assist us in analyzing how our Service is used.</li></ol><p><strong style="background-color: transparent;">Security</strong></p><p>We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.</p><p><br></p><p><strong style="background-color: transparent;">Links to Other Sites</strong></p><p>Our Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.​</p><p><br></p><p><strong style="background-color: transparent;">Changes to This Privacy Policy</strong></p><p>We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately after they are posted on this page.</p><p><br></p><p><strong style="background-color: transparent;">Contact Us</strong></p><p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.</p><p><br></p><p><br></p><p>Best,</p><p>Civilator Developers</p><p><br></p>
        `
    )



    return (
        <div className="landing-terms_conditions-main">

            <div className="landing-terms_conditions-content">

                <div className="landing-terms_conditions-header">
                    <div className="title">Privacy Policy</div>
                </div>

                <div className="terms_conditions-content"
                    dangerouslySetInnerHTML={{ __html: Content }}
                >

                </div>


            </div>
        </div>
    )
}

export default PrivacyPolicy;