import { useState } from "react";
import { MessageContainer } from "./message.js";
import Modal from "./modal";



export default function App() {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <div className="position-relative d-inline-block">
            <div
                onMouseEnter={() => {
                    setShowPopup(true);
                }}
                onMouseLeave={() => {
                    setShowPopup(false);
                }}
            >
                HOVER OVER ME TO START REST DOWNLOAD, HOVER OFF TO END REST DOWNLOAD EARLY
            </div>
            {showPopup && <Modal />}
        </div>
    )

}


