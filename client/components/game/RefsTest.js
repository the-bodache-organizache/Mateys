import React, { Component } from 'react';

class Ref extends Component {
  constructor () {
    super();
    this.myRef = React.createRef();
  }

  componentDidMount () {
    console.log(this.myRef);
  }

  render () {
    return (
      <canvas ref={this.myRef} id="canvas-source" width="100" height="100" />
    )
  }
}

export default Ref;
