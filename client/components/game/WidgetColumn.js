import React from 'react';
import { connect } from 'react-redux';
import Widget from './Widget';

const WidgetColumn = props => {
  const { id, width, height, add, widgets } = props;
  const theseWidgets = widgets.slice(add, add + 3);
  const widgetStyle = {
    height: +height * 0.3,
    margin: +height * 0.025
  };
  return (
    <div id={id}>
      {theseWidgets.map((widget, index) => {
        let color = 'green'
        if (widget && !widget.ready) {
          color = 'red';
        }
        console.log(color);
        return (<Widget key={index + add} widget={widget} index={index+add} color={color} />)
      })}
     
    </div>
  );
};

const mapStateToProps = state => ({
  widgets: state.widgets,
  // width: state.motionDetection.dimensions.width,
  // height: state.motionDetection.dimensions.height
});

export default connect(mapStateToProps)(WidgetColumn);
