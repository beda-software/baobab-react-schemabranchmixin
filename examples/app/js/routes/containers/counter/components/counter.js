import React from 'react';
import SchemaBranchMixin from 'baobab-react-schemabranchmixin';

export default React.createClass({
  displayName: 'Counter',

  mixins: [SchemaBranchMixin],

  schema: {
    uuid: null,
    counter: 0,
  },

  inc() {
    this.cursors.counter.apply((x) => x + 1);
  },

  dec() {
    this.cursors.counter.apply((x) => x - 1);
  },

  del() {
    this.props.tree.unset();
  },

  render() {
    return (
      <p>
        <button onClick={this.inc}>+</button>
        <strong> {this.state.counter} </strong>
        <button onClick={this.dec}>-</button>
        <button onClick={this.del}>X</button>
      </p>
    );
  },
});
