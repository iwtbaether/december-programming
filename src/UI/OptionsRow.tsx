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
      Want to suggest something, or give detailed feedback? <Reddit /> Want to design the UI? Need Tips? Questions? <Discord />
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