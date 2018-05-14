import React from 'react';
import { connect } from 'react-redux';
import Widget from './Widget';

const WidgetColumn = props => {
  const { id, add, widgets } = props;
  const theseWidgets = widgets.slice(add, add + 3);
  return (
    <div id={id}>
      {theseWidgets.map((widget, index) => {
        let color = 'green'
        if (widget && !widget.ready) {
          color = 'red';
        }
        return (<Widget key={index + add} widget={widget} index={index+add} color={color} />)
      })}

    </div>
  );
};

const mapStateToProps = state => ({
  widgets: state.widgets
});

export default connect(mapStateToProps)(WidgetColumn);
