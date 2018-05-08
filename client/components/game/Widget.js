import React from 'react';
import { connect } from 'react-redux';

const Widget = props => {
  const { id, width, height, add, widgets } = props;
  const widgetStyle = {
    height: +height * 0.3,
    margin: +height * 0.025
  };

  return (
    <div id={id}>
      <div id={`widget${0 + add}`} className="widget" style={widgetStyle} />
      <div id={`widget${1 + add}`} className="widget" style={widgetStyle} />
      <div id={`widget${2 + add}`} className="widget" style={widgetStyle} />
    </div>
  );
};

const mapStateToProps = state => ({
  widgets: state.widgets
});

export default connect(mapStateToProps)(Widget);
