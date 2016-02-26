import React from 'react';
import tree from './tree';
import {Router, browserHistory} from 'react-router'
import routes from './routes/route';
import {root as RootMixin} from 'baobab-react/mixins';

const App = React.createClass({
    displayName: 'App',

    mixins: [RootMixin],

    createTreeAwareComponent: function(Component, props) {
        const treeName = Component.displayName.toLowerCase();
        const treeNested = props.tree || tree.select(treeName);

        return <Component {...props} tree={treeNested}/>
    },

    render: function() {
        return (
            <Router onUpdate={() => window.scrollTo(0, 0)}
                    createElement={this.createTreeAwareComponent}
                    history={browserHistory}
                    routes={routes} />
        );
    },
});

export default React.createClass({
    displayName: 'AppWrapper',

    render: function() {
        return (
            <App tree={tree} />
        );
    },
});
