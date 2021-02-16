import Decimal from "break_infinity.js";
import React from "react";
import { SingleResource } from "../engine/externalfns/decimalInterfaces/SingleResource";
import DisplayDecimal from "./DisplayDecimal";
import DisplayNumber from "./DisplayNumber";

const ListedResourceClass: React.FC<{ resource: SingleResource}> = (props) => {

    const dec = props.resource.info.get();
    const ps = props.resource.gainPS;
    const cap = props.resource.cap;

    if (cap.eq(0)) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '380px' }} className='ListedResourceClass'>
            <span style={{ marginRight: '5px' }} className='resourceColor'>
                {props.resource.info.name}
            </span>
            <span style={{flexGrow:1, textAlign:'right'}} className={dec.greaterThanOrEqualTo(cap)?"orange-text":""}>
                <span>
                 <DisplayDecimal decimal={dec} /> 
                </span>
                <span hidden={cap.equals(Infinity)}> /
                <DisplayDecimal decimal={cap} />
                </span>
            </span>
            <span style={{width:'100px', textAlign: 'right'}}>
                <span hidden={ps.equals(0)}>
                <DisplayDecimal decimal={ps}/> /s
                </span>
            </span>
        </div>
    )
}

export default ListedResourceClass;


export const ListedDecimal: React.FC<{ resource: Decimal, name: string, ps?: Decimal}> = (props) => {

    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '380px' }} className='ListedResourceClass'>
            <span style={{ marginRight: '5px' }} className='resourceColor'>
                {props.name}
            </span>
            <span style={{flexGrow:1, textAlign:'right'}}>
                <span>
                 <DisplayDecimal decimal={props.resource} /> 
                </span>
            </span>
            <span style={{width:'100px', textAlign: 'right'}}>
                {props.ps && <span>
                <DisplayDecimal decimal={props.ps}/> /s
                </span>}
            </span>
        </div>
    )
}

export const ListedNumber: React.FC<{ resource: number, name: string,middle?:boolean}> = (props) => {

    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '380px' }} className='ListedResourceClass'>
            <span style={{ marginRight: '5px' }} className='resourceColor'>
                {props.name}
            </span>
            <span style={{textAlign:'right',flexGrow:1}}>
                <span>
                 <DisplayNumber num={props.resource} /> 
                </span>
            </span>
            {props.middle && <span style={{width:'100px', textAlign: 'right'}}>
                
            </span>}
        </div>
    )
}