
import Images from '../assets/Images'
import Icons from '../assets/Icons'

const Loading = ({ props }) => {

    const { isMainLogo, isLabel } = props

    return (
        <div className="popup-container-main popup-container-center">
            <div className="popup-block-ui"></div>
            <div className="loading-popup-container">
                {isMainLogo ?
                    <div className="loading-logo">
                        <img src={Images.logo} />
                    </div>
                    : ''}
                <div className="loading-spinner">
                    <svg class="loading-spinner-circle" height="70" width="70">
                        <circle cx="35" cy="35" r="25"></circle>
                    </svg>
                </div>
                {isLabel ? <div className="loading-label">Loading...</div> : null}
            </div>
        </div>
    )

}

export default Loading;