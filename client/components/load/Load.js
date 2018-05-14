import React, { Component } from 'react';
import Error from './Error';

const Load = OtherComponent =>
  class Loader extends Component {
    state = {
      loaded: false,
      error: false
    };
    componentDidMount() {
      const width = `${Math.floor(window.innerWidth * 0.65)}`;
      const height = `${Math.floor(window.innerHeight * 0.65)}`;
      this.props
        .load()
        .then(() => this.setState({ loaded: true }))
        .catch(() => this.setState({ error: true }));
      this.props.getDimensions(width, height);
    }

    render() {
      const { loaded, error } = this.state;
      return loaded ? (
        <OtherComponent {...this.props} />
      ) : error ? (
        <Error error={error.message} />
      ) : (
        <div>Loading...</div>
      );
    }
  };

export default Load;
