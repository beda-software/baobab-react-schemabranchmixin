import React from 'react';
import SchemaBranchMixin from 'baobab-react-schemabranchmixin';

const Counter =  React.createClass({
    mixins: [SchemaBranchMixin],
    schema: {
        counter: 0,
    },

    inc(){
        this.cursors.counter.apply((x)=>x+1);
    },
    dec(){
        this.cursors.counter.apply((x)=>x-1);
    },
    del(){
        this.props.tree.unset();
    },


    render() {
        return <p>
            <button onClick={this.inc}>+</button>
            <strong> {this.state.counter} </strong>
            <button onClick={this.dec}>-</button>
            <button onClick={this.del}>X</button>
        </p>
    },
});

export default React.createClass({
    displayName: 'CounterList',

    mixins: [SchemaBranchMixin],
    schema: {
        list: [],
    },

    add() {
        this.cursors.list.push({})
    },

    render() {
        return <div>
            <h1>Counter</h1>
            <ul>
                {this.cursors.list.map((cursor, index)=>
                <li key={index}>
                    <Counter tree={cursor}/>
                </li>)}
            </ul>
            <button onClick={this.add}>Add counter</button>
        </div>
    },
});
