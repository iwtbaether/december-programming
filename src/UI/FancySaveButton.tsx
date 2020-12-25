import Decimal from "break_infinity.js"
import React from "react"
import { gEngine } from "..";
import { formatNumber } from "../engine/externalfns/util";

class FancySaveButton extends React.Component<{},{}> {


    end = () => {
        let btn  = document.getElementById('save-button');
        if (btn) {
            btn.className = 'FancySaveButton'
        }
    }

    render() {
        return (
            <button className={'FancySaveButton'} id='save-button' onAnimationEnd={this.end} onClick={gEngine.save}>
                Save
            </button>
        )
    }
}

    export default FancySaveButton;