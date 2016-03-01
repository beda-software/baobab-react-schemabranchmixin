import React from 'react';
import { monkey, default as Baobab } from 'baobab';
import TestUtils from 'react-addons-test-utils';
import SchemaBranchMixin from '../src/index';
import BaobabPropTypes from 'baobab-prop-types';

const Root = React.createClass({
  childContextTypes: {
    tree: BaobabPropTypes.baobab,
  },

  getChildContext() {
    return {
      tree: this.props.tree,
    };
  },

  render() {
    const Component = this.props.component;

    return (
      <div>
        <Component ref="component" {...this.props.componentProps} />
      </div>
    );
  },
});

const tree = new Baobab(
  {
    componentKey: 'component1',
    component2: {
      firstLevel: {},
      fieldFirst: 'fromComponent2',
    },
    component1: {
      notDeclaredInStateAtFirstLevel: true,
      firstLevel: {
        secondLevel: {
          fieldThird: 'changedThird',
          notDeclaredInStateAtThirdLevel: {
            value: [1, 2, 3],
          },
        },
      },
    },
  },
  {
    immutable: false,
    asynchronous: false,
  }
);

const TestComponentInner = React.createClass({
  mixins: [SchemaBranchMixin],

  schema: {
    firstLevel: {
      secondLevel: {
        fieldThird: 'initialThird',
      },
      fieldSecond: 'initialSecond',
    },
    fieldFirst: 'initialFirst',
  },

  render() {
    return null;
  },
});

const TestComponentInnerOverride = React.createClass({
  mixins: [SchemaBranchMixin],

  schema: {
    _override: true,
    firstLevel: {
      secondLevel: {
        fieldThird: 'initialThird',
      },
      fieldSecond: 'initialSecond',
    },
    fieldFirst: 'initialFirst',
  },

  render() {
    return null;
  },
});

const TestComponentWithMonkey = React.createClass({
  mixins: [SchemaBranchMixin],

  schema: {
    a: 1,
    b: 2,
    sum: monkey(['.', 'a'], ['.', 'b'], (a, b) => a + b),
    innerMonkey: {
      a: 3,
      b: 4,
      sum: monkey(['.', 'a'], ['.', 'b'], (a, b) => a + b),
    },
  },

  render() {
    return null;
  },
});

const TestComponentWithNestedSchemaDefaultValues = React.createClass({
  mixins: [SchemaBranchMixin],

  schema: {
    nested: {
      default: {
        value: null,
      },
    },
  },

  render() {
    return null;
  },
});

const TestComponentWithCursorsAsFunction = React.createClass({
  mixins: [SchemaBranchMixin],

  schema: {
    fromSchema: null,
  },

  cursors() {
    return {
      fromCursors: ['fromCursor'],
    };
  },

  render() {
    return null;
  },
});

const TestComponent = React.createClass({
  mixins: [SchemaBranchMixin],

  schema: {
    componentKey: 'component1',
  },

  render() {
    const Component = this.props.innerComponent;
    return (
      <Component ref="component" tree={this.props.tree.select(this.state.componentKey)} />
    );
  },
});

describe('Check SchemaBranchMixin', () => {
  let component, treeState;

  function renderComponent(componentProps = {}) {
    const rootComponent = TestUtils.renderIntoDocument(
      <Root tree={tree}
            component={TestComponent}
            componentProps={_.defaults(componentProps, {
              tree: tree.select(),
              innerComponent: TestComponentInner,
            })} />
    );
    component = rootComponent.refs.component.refs.component;
  }

  before(() => {
    renderComponent();

    treeState = tree.get();
  });

  after(() => {
    tree.set(treeState);
  });

  it('should component has correct cursors mapping', () => {
    expect(_.keys(component.cursors)).to.have.members(['firstLevel', 'fieldFirst']);
  });

  it('should component has correct state with initial and changed data', () => {
    expect(component.state).to.be.deep.equal({
      firstLevel: {
        secondLevel: {
          fieldThird: 'changedThird',
          notDeclaredInStateAtThirdLevel: {
            value: [1, 2, 3],
          },
        },
        fieldSecond: 'initialSecond',
      },
      fieldFirst: 'initialFirst',
    });
  });

  it('should state changed correctly when tree prop changed', () => {
    tree.set('componentKey', 'component2');

    expect(component.state).to.be.deep.equal({
      firstLevel: {
        secondLevel: {
          fieldThird: 'initialThird',
        },
        fieldSecond: 'initialSecond',
      },
      fieldFirst: 'fromComponent2',
    });
  });

  it('should changes via cursor change state directly', () => {
    tree.set(['component2', 'fieldFirst'], 'newValue');
    expect(component.state.fieldFirst).to.be.equal('newValue');
  });

  it('should _override attribute at first-level schema overrides value in tree', () => {
    tree.set('componentKey', 'component1');

    tree.set('component1', {
      notDeclaredInStateAtFirstLevel: true,
      firstLevel: {
        secondLevel: {
          fieldThird: 'changedThird',
          notDeclaredInStateAtThirdLevel: {
            value: [1, 2, 3],
          },
        },
      },
      fieldFirst: 'changed',
    });
    renderComponent({ innerComponent: TestComponentInnerOverride });

    expect(component.state).to.be.deep.equal({
      _override: true,
      firstLevel: {
        secondLevel: {
          fieldThird: 'initialThird',
        },
        fieldSecond: 'initialSecond',
      },
      fieldFirst: 'initialFirst',
    });
  });

  it('should monkey in schema works correctly', () => {
    renderComponent({ innerComponent: TestComponentWithMonkey });
    expect(component.state.a).to.be.equal(1);
    expect(component.state.b).to.be.equal(2);
    expect(component.state.sum).to.be.equal(3);

    component.cursors.a.set(5);
    component.cursors.b.set(6);
    expect(component.state.sum).to.be.equal(11);
  });

  it('should inner monkey in schema works correctly', () => {
    expect(component.state.innerMonkey.a).to.be.equal(3);
    expect(component.state.innerMonkey.b).to.be.equal(4);
    expect(component.state.innerMonkey.sum).to.be.equal(7);

    component.cursors.innerMonkey.set('a', 5);
    component.cursors.innerMonkey.set('b', 6);
    expect(component.state.innerMonkey.sum).to.be.equal(11);
  });

  it('should monkey in schema works correctly after second initialization', () => {
    renderComponent({ innerComponent: TestComponentWithMonkey });
    expect(component.state.a).to.be.equal(5);
    expect(component.state.b).to.be.equal(6);
    expect(component.state.sum).to.be.equal(11);

    component.cursors.a.set(7);
    component.cursors.b.set(8);
    expect(component.state.sum).to.be.equal(15);
  });

  it('should inner monkey in schema works correctly after second initialization', () => {
    expect(component.state.innerMonkey.a).to.be.equal(5);
    expect(component.state.innerMonkey.b).to.be.equal(6);
    expect(component.state.innerMonkey.sum).to.be.equal(11);

    component.cursors.innerMonkey.set('a', 7);
    component.cursors.innerMonkey.set('b', 8);
    expect(component.state.innerMonkey.sum).to.be.equal(15);
  });

  it('should nested schema default values does not override existing tree', () => {
    tree.set(['component1', 'nested', 'default'], null);
    renderComponent({ innerComponent: TestComponentWithNestedSchemaDefaultValues });
    expect(tree.get('component1', 'nested', 'default')).to.be.equal(null);
  });

  it('should cursors as function work correctly', () => {
    renderComponent({ innerComponent: TestComponentWithCursorsAsFunction });
    expect(component.cursors).to.have.keys('fromSchema', 'fromCursors');
  });
});
