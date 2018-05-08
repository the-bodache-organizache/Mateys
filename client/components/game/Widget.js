import React from 'react';

const Widget = (props) => {
  const { id, width, height, add } = props;
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
}

export default Widget;
