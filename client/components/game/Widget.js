import React from 'react';
import { connect } from 'react-redux';

const Widget = props => {
  const { index, widget, height } = props;
  const widgetStyle = {
    height: +height * 0.3,
    margin: +height * 0.025
  };
  return (
    <div id={`widget${index}`} className={`widget ${!widget && 'hide'}`} style={widgetStyle} >{widget && widget.name}</div>
  );
};


const mapStateToProps = state => ({
  width: state.motionDetection.dimensions.width,
  height: state.motionDetection.dimensions.height
});

export default connect(mapStateToProps)(Widget);