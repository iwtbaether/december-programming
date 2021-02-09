import React from "react";
import { gEngine } from "../../..";
import { Datamap } from "../../../engine/Datamap";
import { canCheat } from "../../../engine/externalfns/util";
import ConfirmCommandButton from "../../comps/ConfirmCommandButton";
import FlexRow from "../../comps/FlexRow";
import { TipFC2 } from "../../comps/TipFC";

const Bruh = new Audio('https://www.myinstants.com/media/sounds/movie_1.mp3')

const OptionsRow = (props: { data: Datamap }) => {
  const data = props.data;
  return (<div>
    <div>
      About
    </div>
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
      Controls
    </div>
    <div>
      shift+click to buy max or bypass confirmation prompts. ctrl+click to buy 10, alt+click to buy 20.
    </div>
      {false && <div>
       <UnlockMagic unlockStateOne={data.unlocksStates.one}   /> are hotkeys. Hotkeys are new (watch out for bugs!) Hotkeys visuals got taken out for now because I don't like how they look.
      </div>}
    <br/>
    <div>
      Info on calculations
    </div>
    <div>
      All resource generation formulas follow the same calculations: base production * (total sum of increased) * (total product of  more)<br/>
      All increased modifiers are summed together. 10x increased from drive and 10x increased from anti-drive results in 20x / 2000% increased energy gain.<br/>
      All more modifiers are multiplicative. Changing any more modifier from 1x to 2x will result in double production. Five "2x more" modifiers results in a final total more of 32x.<br/>
      A multi is just a more modifier + 100%.
    </div>
    <FlexRow>
    <button onClick={gEngine.energyModule.showCalcs}>
        Energy</button>
    </FlexRow>
    <br/>
    <div>
      Advanced File Options 
    </div>
    <div>
      {canCheat && 
    <ConfirmCommandButton do={gEngine.load} label={'Load'} warning={'Are you sure you want to load?'} />}
      <button onClick={gEngine.export} >
        Export
          </button>
      {<button onClick={() => { (document.getElementById('file-input') as HTMLInputElement).click() }} >
        Import <TipFC2>
          WARNING: "Items" cannot survive the import process
        </TipFC2>
                                </button>}
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

const UnlockMagic = (props: {unlockStateOne: number}) => {
  if (props.unlockStateOne >= 8) return <span style={{color:'magenta'}}>
    [L]etters in Brackets "[ ]"
  </span>
  else return <span>
    Letters in Brackets "[ ]"
  </span>
}

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


