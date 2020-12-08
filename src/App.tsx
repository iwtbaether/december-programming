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
        
      </div>
    );


  }
}
