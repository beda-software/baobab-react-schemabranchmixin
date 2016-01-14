import _ from 'lodash';
import React from 'react';
import {branch as BranchMixin} from 'baobab-react/mixins';
import PropTypes from './utils/prop-types';

/**
 * SchemaCursorMixin is designed for use with baobab-react mixin `branch`.
 * General purpose of mixin is tree autogeneration with schema.
 *
 * This mixin add cursors from component `schema` for `tree` component prop or root tree.
 *
 * Example of usage:
 *
 * Our tree (auto-generated from schema):
 * {
 *  globalVal: 'global value (predefined)',
 *  form: {
 *    name: '',
 *    externalId: ''
 *  }
 * }
 *
 * const EditForm = React.createClass({
 *  mixins: [SchemaBranchMixin],
 *  schema: {
 *    name: '',
 *    externalId: ''
 *  },
 *  cursors: {
 *    globalVal: ['globalVal']
 *  },
 *  render: function () {
 *    We have this.cursors.globalVal (via baobab-react branch mixin)
 *    And we have `this.cursors.name`, `this.cursors.externalId` via
 *    SchemaBranchMixin.
 *    `this.state.name` and others state params contains value from
 *    appropriate cursor via baobab-react branch mixin
 *
 *    If `tree` props is not received from child component, global tree will
 *    be used
 *  }
 * });
 *
 * const Page = React.createClass({
 *   mixins: [SchemaBranchMixin],
 *
 *   schema: {
 *     form: {}
 *   },
 *
 *   render: function () {
 *     return (<EditForm tree={this.cursors.form} />);
 *   }
 * });
 */

const SchemaBranchMixin = {
  propTypes: {
    tree: React.PropTypes.oneOfType([PropTypes.baobab, PropTypes.cursor])
  },

  contextTypes: {
    tree: PropTypes.baobab
  },

  getTreeCursor: function (props) {
    return props.tree || this.context.tree.select();
  },

  getInitialState: function () {
    this.cursors = _.cloneDeep(this.cursors || {});
    this.schema = _.cloneDeep(this.schema || {});

    const tree = this.getTreeCursor(this.props);

    // Add initial cursors to first-level schema
    // Baobab-react branch mixin will add watchers for this cursors
    _.each(this.schema, (value, key) => this.cursors[key] = tree.select(key));
  },

  componentWillMount: function () {
    const tree = this.getTreeCursor(this.props);

    this.updateStateFromTree(tree);
  },

  componentWillReceiveProps: function (nextProps) {
    const oldTree = this.getTreeCursor(this.props);
    const newTree = this.getTreeCursor(nextProps);

    if (oldTree !== newTree) {
      // Change cursor mapping for new tree via accessing to private `__cursorsMapping`
      // Baobab-react branch mixin will refresh watcher in this step
      _.each(this.schema, (value, key) => this.__cursorsMapping[key] = newTree.select(key));

      this.updateStateFromTree(newTree);
    }
  },

  /**
   * Create state from tree and update current state with created state
   *
   * @param tree
   */
  updateStateFromTree: function (tree) {
    this.setState(this.createState(tree));
  },

  /**
   * Create state in tree corresponding to schema at first-level
   * Returns object which represent state
   *
   * @param tree Baobab Tree
   * @returns {Object}
   */
  createState: function (tree) {
    const state = _.mapValues(this.schema, (value, key) => {
      const cursor = tree.select(key);

      if (!cursor.exists() || this.schema._override === true) {
        return cursor.set(value);
      }

      const cursorValue = cursor.get();

      if (_.isPlainObject(value)) {
        return cursor.set(_.merge({}, value, cursorValue));
      }

      return cursorValue;
    });

    this.context.tree.commit();

    return state;
  }
};

export default {
  displayName: 'SchemaBranchMixin',

  mixins: [SchemaBranchMixin, BranchMixin]
};
