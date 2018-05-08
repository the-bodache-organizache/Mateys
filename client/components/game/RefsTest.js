import React, { Component } from 'react';

class Ref extends Component {
  constructor () {
    super();
    this.myRef = React.createRef();
  }

  async getContext () {
    const context = await this.myRef.current.getContext('2d');
    return context;
  }

  render () {
    console.log(this.getContext());
    return (
      <canvas ref={this.myRef} id="canvas-source" width="100" height="100" />
    )
  }
}

export default Ref;
