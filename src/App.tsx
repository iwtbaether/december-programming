import React from 'react';
import Engine from './engine/Engine';
import Game from './UI/Game';
import { Datamap } from './engine/Datamap';


interface AppProps { engine: Engine }
export default class App extends React.Component<AppProps, { data: Datamap }> {

  constructor(props: AppProps) {
    super(props);
    this.state = {
      data: props.engine.datamap
    }
  }

  componentDidMount() {

    this.props.engine.setNotify(this.notify)
    this.props.engine.start();
  }

  notify = () => {
    this.setState({ data: this.props.engine.datamap })
  }

  render() {
    const engine = this.props.engine;
    const data = engine.datamap;

    return (
      <div>
        <Game data={data} />
        <div>
          <div>
            A game by IWTB-AETHER [Time: {data.last}]
          </div>
          <div>  
          Want to suggest something? <Reddit/> Want do do the CSS? <Discord/>
        </div>
        </div>
      </div>
    );


  }
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