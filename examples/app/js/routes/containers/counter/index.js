import React from 'react';
import SchemaBranchMixin from 'baobab-react-schemabranchmixin';
import Counter from './components/counter';

export default React.createClass({
  displayName: 'CounterList',

  mixins: [SchemaBranchMixin],

  schema: {
    list: [],
  },

  add() {
    this.cursors.list.push({});
  },

  render() {
    return (
      <div>
        <h1>Counter</h1>
        <ul>
          {this.cursors.list.map((cursor, index) => (
            <li key={index}>
              <Counter tree={cursor}/>
            </li>
          ))}
        </ul>
        <button onClick={this.add}>Add counter</button>
      </div>
    );
  },
});
