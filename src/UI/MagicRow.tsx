import React from "react";
import { gEngine } from "..";
import { Datamap } from "../engine/Datamap";
import { CEX } from "../engine/TheExchange";
import { ListedNumber } from "./ListedResourceClass";

const MagicRow = (props: { data: Datamap }) => {
    const currency = props.data.crafting.currency
    const exchange = gEngine.theExchange;
    return (
        <div style={{display:'flex',flexDirection:'column', marginLeft:'10px',gap:'10px'}}>
            <span style={{fontWeight:'bold'}}>
            Magic - coming soon to a reset (8) near you
            </span>
            <ul>
                TODO:
                <li>
                    add stats/info about resource generation everywhere relevant
                </li>
                <li>Mana, builds up over time</li>
                <li>Max Mana, upgraded through _____?</li>
                <li>
                    <ul>
                        Spells:
                        <li>
                            mana regen
                        </li>
                        <li>more energy</li>
                        <li>make seeds</li>
                        <li>make anti-energy</li>
                        <li>time skip gloom</li>
                        <li>time skip energy</li>
                        <li>time skip garden</li>
                        <li>make transmutes</li>
                        <li>+base max mana?</li>
                        <li></li>
                    </ul>
                </li>
                <li>
                    <ul>
                        Items and Mods:
                        <li>
                            Wizard Hat, Staff, Book
                        </li>
                        <li>
                            Base, Increased, More max Mana.
                        </li>
                        <li>
                            Base, Increased, More Mana regen.
                        </li>
                        <li>
                            Staff will have mods specific to powering up spells
                        </li>
                        <li>
                            Book will have mods specific to providing new spells
                        </li>
                        <li>
                            Cap will have mods specific to magic automation.
                        </li>
                        <li>
                            Items wont be unlocked until reset 4, and then the book and staff get added in later resets
                        </li>
                        <li>
                            Uses the same UI / Current / Rules as other crafting, but I'll put the crafting here.
                        </li>
                    </ul>
                </li>
                <li>
                    Use 1 Copper Orb to add a "hotbar" to the bottom
                </li>
                <li>
                    lmao rs xp formula. can use skill level to determine max mana / mana regen instead of spells increasing it. each level can give a point to assign to one or the other.
                </li>
                <li>
                    "spiritual juicer" to transform fruits into "traits" of _________ for eventual ________ (garden reset #2 lol) 
                </li>
                <li>
                    make some "end" to job #1 somewhere in reset 8/9+ (currently testing) that unlocks jobs #2, the _________.
                </li>
                <li>
                    Garden Managers
                    <ul>
                        <li>
                            "purchase" a new manager with 1 copper orb.
                        </li>
                        <li>
                            3 managers are show as options, red fairy, green fairy, white fairy 
                        </li>
                        <li>red fairy harvests fruit at half their gain, green fairy grabs seeds from your bag but takes a cut, white fairy plants seeds but can't find doom</li>
                    </ul>
                </li>
            </ul>
        </div>
    )
}

export default MagicRow;



const GERow: React.FC<{}> = (props) => (
    <div style={{display:'flex',flexDirection:'column'}}>
        {props.children}
    </div>
)

