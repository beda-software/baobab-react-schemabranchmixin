import React from 'react';
import { Link } from 'react-router';

export default React.createClass({
    displayName: 'BaseApp',

render: function() {
    return <div>
        <ul>
            <li><Link to='/greet'>Greet</Link></li>
            <li><Link to='/counter'>Counter</Link></li>
        </ul>
        <div>
            {this.props.children}
        </div>
    </div>
    },
});
