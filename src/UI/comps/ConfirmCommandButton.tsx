import React, { ReactNode } from 'react';
import { BasicCommand } from './BasicCommand';
import './CommandButtonFC.css'

export interface ConfirmButtonProps {
  disabled?: boolean;
  warning: ReactNode;
  hidden?: boolean;
  label: ReactNode;
  do: ()=>void;
}

export default class ConfirmCommandButton extends React.Component<ConfirmButtonProps, {open:boolean}>{ 

  constructor(props:ConfirmButtonProps) {
    super(props)

    this.state = {
      open: false
    }

  }

  //TODO AUTOFOCUS ENTER AND WATCH FOR ESCAPE
  fakeBuy = (ev: React.MouseEvent) => {
    if (ev.shiftKey) {
      this.props.do();
    } else this.setState({open:!this.state.open})
    
  }

  _handleKeyDown = (ev: KeyboardEvent)=> {
    switch (ev.key) {
      case 'Escape':
        this.setState({open:false})
        ev.preventDefault();
        break;

      case 'Enter':
        if (this.state.open) {
          this.props.do();
          ev.preventDefault();
        }
        break;
    
      default:
        console.log('nothing!', ev.key);
        break;
    }
  }

  componentDidMount () {
    //document.addEventListener("keydown", this._handleKeyDown);
  }
  
  componentWillUnmount () {
    //document.removeEventListener("keydown", this._handleKeyDown);
  }

  render () {
    const props = this.props;
    if (props.hidden) return null;

    return (<React.Fragment>
        <button disabled={props.disabled} onClick={this.fakeBuy}>
          {props.label}
        </button>
        <div className='WarningBox' hidden={!this.state.open}>
            <div className='WarningOverlay' onClick={this.fakeBuy}>
              <div className='WarningPopup'>
                {this.props.warning}
                <div style={{display:'flex',justifyContent:'space-between'}}>
                <button onClick={props.do} autoFocus={true}>
                  {props.label}
                </button>
                <button className='PlainD' onClick={this.fakeBuy}>
                  Cancel
                </button>
                </div>
              </div>
            </div>
        </div>
    </React.Fragment>)
  }
}



export  class ConfirmBasicCommandButton extends React.Component<BasicCommand, {open:boolean}>{ 

  constructor(props: any) {
    super(props)

    this.state = {
      open: false
    }

  }

  fakeBuy = (ev: React.MouseEvent) => {
    if (ev.shiftKey) {
      this.props.command();
    } else this.setState({open:!this.state.open})
    
  }

  render () {
    const props = this.props;
    const hidden = props.hidden?props.hidden():false
    if (hidden) return null;
    const disabled = props.able?props.able() === false:false

    return (<span>
        <span >
        <button disabled={disabled} onClick={this.fakeBuy}>
          {props.label}
        </button>
        </span>
        <div className='WarningBox' hidden={!this.state.open}>
            <div className='WarningOverlay' onClick={this.fakeBuy}>
              <div className='WarningPopup'>
                {this.props.children}
                <div style={{display:'flex',justifyContent:'space-between'}}>
                <button onClick={props.command}>
                  {props.label}
                </button>
                <button className='PlainD' onClick={this.fakeBuy}>
                  Cancel
                </button>
                </div>
              </div>
            </div>
        </div>
    </span>)
  }
}



