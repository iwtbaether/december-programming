import React from "react";
import { Datamap } from "../engine/Datamap";
import DisplayDecimal from "./DisplayDecimal";

const OptionsRow = (props: { data: Datamap }) => {
  const data = props.data;
  return (<div>
    <div>
      A game by IWTB-AETHER [Time: {data.last}]
          </div>
    <div>
      Want to suggest something, or give detailed feedback? <Reddit /> Want to complain about the UI? Need Tips? Questions? <Discord />
    </div>
    <div>
      Want to support me and get access to more idle gaming? Patreon!
    </div>
    <div>
      Made with <a href='https://create-react-app.dev/docs/adding-typescript/'>react, typescript</a>, <a href='https://github.com/Patashu/break_infinity.js'>
        break_infinity.js
        </a>, 
        and <a href='https://github.com/antimatter-dimensions/notations'>
        @antimatter-dimensions/notations
        </a>
    </div>
    <div>
      lol no options
    </div>
  </div>)
}

export default OptionsRow;


const Discord = () => {
  return (
    <a target="_blank" href="https://discord.gg/F63vNBN">
      Discord
    </a>
  )
}

const Reddit = () => {
  return (
    <a target="_blank" href='https://old.reddit.com/r/IA_Games/'>
      Reddit
    </a>
  )
}