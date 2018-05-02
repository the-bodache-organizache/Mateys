import React, { Component } from 'react';
import Error from './Error';

const Load = OtherComponent =>
  class Loader extends Component {
    state = {
      loaded: false,
      error: false
    };
    componentDidMount() {
      this.props
        .load()
        .then(() => this.setState({ loaded: true }))
        .catch(() => this.setState({ error: true }));
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
