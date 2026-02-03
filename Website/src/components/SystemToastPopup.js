
import Images from '../assets/Images'
import Icons from '../assets/Icons'
import { useEffect, useState } from 'react'

const AlertIcons = {
    "warning": Icons.general.warning,
    "success": Icons.general.tick_mark,
    "error": Icons.general.close_mark,
}

const SystemToastPopup = ({ props }) => {

    const { type, message, callback, delay } = props

    console.log('askhjdgasj');

    const [hidePopup, setHidePopup] = useState(false)


    useEffect(() => {

        setTimeout(() => {
            setHidePopup(true)
        }, delay ? delay : 3000)
        setTimeout(() => {
            callback(false)
        }, delay ? delay + 1000 : 4000)

    }, [])


    return (
        <div className={`alert-tost-popup-main alert-tost-${type} ${hidePopup ? 'hide-alert-tost-popup-main' : ''}`} >
            <div className="alert-tost-popup-content">
                <div
                    className="icon"
                    dangerouslySetInnerHTML={{ __html: AlertIcons[type] }}
                ></div>
                <div className="label">{message}</div>
            </div>
        </div>
    )

}

export default SystemToastPopup;