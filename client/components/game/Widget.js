import React from 'react';

const Widget = (props) => {
  const { width, height } = props;
  const widgetStyle = {
    height: +height * 0.3,
    margin: +height * 0.025
  };

  return (
    <div id="widgets">
      <div id="widget" style={widgetStyle} />
      <div id="widget" style={widgetStyle} />
      <div id="widget" style={widgetStyle} />
    </div>
  );
}

export default Widget;
