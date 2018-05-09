import React from 'react';
import { connect } from 'react-redux';

const WidgetColumn = props => {
  const { id, width, height, add, widgets } = props;
  const widgetStyle = {
    height: +height * 0.3,
    margin: +height * 0.025
  };
  console.log("widgets", widgets);
  return (
    <div id={id}>
      <div id={`widget${0 + add}`} className={`widget ${!widgets[0 + add] && 'hide'}`} style={widgetStyle} >{widgets[0 + add] && widgets[0 + add].name}</div>
      <div id={`widget${1 + add}`} className={`widget ${!widgets[1 + add] && 'hide'}`} style={widgetStyle} >{widgets[1 + add] && widgets[1 + add].name}</div>
      <div id={`widget${2 + add}`} className={`widget ${!widgets[2 + add] && 'hide'}`} style={widgetStyle} >{widgets[2 + add] && widgets[2 + add].name}</div>
    </div>
  );
};

const mapStateToProps = state => ({
  widgets: state.widgets,
  width: state.motionDetection.dimensions.width,
  height: state.motionDetection.dimensions.height
});

export default connect(mapStateToProps)(WidgetColumn);
