import React from "react"
import TipFC from "./TipFC";

export interface BasicCommand {
    label: string;
    command: ()=>void;
    able?: ()=>boolean;
    description?: string;
    hidden?: ()=>boolean;
}


export function makeBasicCommand (label: string, command: VoidFunction, able?: ()=>boolean, description?: string, hidden?: ()=>boolean): BasicCommand{
    return {
        label, command, description, hidden, able
    }
}

export class BasicCommandButton extends React.Component<{cmd: BasicCommand},{}> {
    render () {
        const hidden = this.props.cmd.hidden?this.props.cmd.hidden():false;
        if (hidden) return null;
        const able = this.props.cmd.able?this.props.cmd.able():true;
        return (<span style={{position:'relative'}}>

                {this.props.children && <TipFC tip={this.props.children}/>}
            <button disabled={!able} onClick={this.props.cmd.command} style={{position:"relative"}}>
                {this.props.cmd.label}
            </button>
        </span>
        )
    }
}