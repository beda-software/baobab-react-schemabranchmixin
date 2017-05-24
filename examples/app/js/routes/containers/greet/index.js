import React from 'react';
import SchemaBranchMixin from 'baobab-react-schemabranchmixin';

function Input({ cursor }) {
  return (
    <input value={cursor.get()}
      onChange={(e) => cursor.set(e.target.value)}/>
  );
}

export default React.createClass({
  displayName: 'Greet',

  mixins: [SchemaBranchMixin],
  schema: {
    input: '',
  },

  render() {
    return (
      <div>
        <h1>Input</h1>
        <p>Hello {this.state.input} !</p>
        <Input cursor={this.cursors.input}/>
      </div>
    );
  },
});
