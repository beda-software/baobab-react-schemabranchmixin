import React from 'react';
import SchemaBranchMixin from 'baobab-react-schemabranchmixin';
import Counter from './components/counter';

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

export default React.createClass({
  displayName: 'CounterList',

  mixins: [SchemaBranchMixin],

  schema: {
    list: [],
  },

  add() {
    this.cursors.list.push({ uuid: guid() });
  },

  render() {
    return (
      <div>
        <h1>Counter</h1>
        <ul>
          {this.cursors.list.map(cursor => (
            <li key={cursor.get().uuid}>
              <Counter tree={cursor}/>
            </li>
          ))}
        </ul>
        <button onClick={this.add}>Add counter</button>
      </div>
    );
  },
});
