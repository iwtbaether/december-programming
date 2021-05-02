import { Datamap } from "../../../../engine/Datamap"

const TodoRow = (props: {data: Datamap}) => {
    return (
        <div>
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
                    can use skill level to determine max mana / mana regen instead of spells increasing it. each level can give a point to assign to one or the other.
                </li>
                <li>
                    "spiritual juicer" to transform fruits into "traits" of _________ for eventual ________ (garden reset #2 lol)
                </li>
            </ul>

        </div>
    )
}

export default TodoRow