import React from "react";
import { gEngine } from "..";
import { Datamap } from "../engine/Datamap";
import ConfirmCommandButton from "./comps/ConfirmCommandButton";

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
    <br/>
    <div>
      Advanced File Options
    </div>
    <div>
    <ConfirmCommandButton do={gEngine.load} label={'Load'} warning={'Are you sure you want to load?'} />
      <button onClick={gEngine.export} >
        Export
          </button>
      <button onClick={() => { (document.getElementById('file-input') as HTMLInputElement).click() }} >
        Import
                                </button>
      <input id="file-input" type="file" name="name" style={{ display: "none" }}
        onChange={(e) => {
          let list = e.target.files;
          if (list) {
            let file = list[0];
            var reader = new FileReader();

            //reader.readAsArrayBuffer(file)
            reader.readAsText(file, 'UTF-8');

            // here we tell the reader what to do when it's done reading...
            reader.onload = readerEvent => {
              let target = readerEvent.target;
              if (target) {
                let content = target.result;
                if (content) {
                  console.log(content);
                  gEngine.import(content.toString())

                }
              }
            }

          }

        }} />
          <ConfirmCommandButton do={gEngine.reset} label={'Reset All Data'} warning={'This does nothing good. It is just a data wipe.'} />
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