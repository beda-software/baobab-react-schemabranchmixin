'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mixins = require('baobab-react/mixins');

var _baobabPropTypes = require('baobab-prop-types');

var _baobabPropTypes2 = _interopRequireDefault(_baobabPropTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
 *  render() {
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
 *   render() {
 *     return (<EditForm tree={this.cursors.form} />);
 *   }
 * });
 */

var SchemaBranchMixin = {
  propTypes: {
    tree: _react2.default.PropTypes.oneOfType([_baobabPropTypes2.default.baobab, _baobabPropTypes2.default.cursor])
  },

  contextTypes: {
    tree: _baobabPropTypes2.default.baobab
  },

  getTreeCursor: function getTreeCursor(props) {
    return props.tree || this.context.tree.select();
  },
  getInitialState: function getInitialState() {
    var _this = this;

    if (_lodash2.default.isFunction(this.cursors)) {
      this.cursors = this.cursors(this.props, this.context);
    } else {
      this.cursors = _lodash2.default.cloneDeep(this.cursors) || {};
    }

    this.schema = _lodash2.default.cloneDeep(this.schema || {});

    var tree = this.getTreeCursor(this.props);

    // Add initial cursors to first-level schema
    // Baobab-react branch mixin will add watchers for this cursors
    _lodash2.default.each(this.schema, function (value, key) {
      return _this.cursors[key] = tree.select(key);
    });
  },
  componentWillMount: function componentWillMount() {
    var tree = this.getTreeCursor(this.props);

    this.updateStateFromTree(tree);
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var _this2 = this;

    var oldTree = this.getTreeCursor(this.props);
    var newTree = this.getTreeCursor(nextProps);

    if (oldTree !== newTree) {
      // Change cursor mapping for new tree via accessing to private `__cursorsMapping`
      // Baobab-react branch mixin will refresh watcher in this step
      _lodash2.default.each(this.schema, function (value, key) {
        return _this2.__cursorsMapping[key] = newTree.select(key);
      });

      this.updateStateFromTree(newTree);
    }
  },


  /**
   * Create state from tree and update current state with created state
   *
   * @param tree
   */
  updateStateFromTree: function updateStateFromTree(tree) {
    this.setState(this.createState(tree));
  },


  /**
   * Create state in tree corresponding to schema at first-level
   * Returns object which represent state
   *
   * @param tree Baobab Tree
   * @returns {Object}
   */
  createState: function createState(tree) {
    function iterate(curTree, curSchema) {
      return _lodash2.default.mapValues(curSchema, function (value, key) {
        var cursor = curTree.select(key);

        if (!cursor.exists() || curSchema._override === true) {
          cursor.set(value);
        } else if (_lodash2.default.isPlainObject(value) && _lodash2.default.isPlainObject(cursor.get())) {
          iterate(cursor, value);
        }

        return cursor.get();
      });
    }

    var state = iterate(tree, this.schema);
    this.context.tree.commit();

    return state;
  }
};

exports.default = {
  displayName: 'SchemaBranchMixin',

  mixins: [SchemaBranchMixin, _mixins.branch]
};