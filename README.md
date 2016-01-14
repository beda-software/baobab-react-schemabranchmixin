[![Build Status](https://travis-ci.org/Brogency/baobab-react-schemabranchmixin.svg)](https://travis-ci.org/Brogency/baobab-react-schemabranchmixin)

baobab-react-schemabranchmixin
=========

SchemaBranchMixin based on baobab-react

## Installation

  npm install baobab-react-schemabranchmixin --save

## Usage

SchemaCursorMixin is designed for use with baobab-react mixin branch.
General purpose of mixin is tree autogeneration with schema.

This mixin add cursors from component `schema` for `tree` component prop or root tree.

Our tree (auto-generated from schema):
```
{
 globalVal: 'global value (predefined)',
 form: {
   name: '',
   externalId: ''
 }
}
```

Example of usage:
```
const EditForm = React.createClass({
 mixins: [SchemaBranchMixin],
 schema: {
   name: '',
   externalId: ''
 },
 cursors: {
   globalVal: ['globalVal']
 },
 render: function () {
   We have this.cursors.globalVal (via baobab-react branch mixin)
   And we have `this.cursors.name`, `this.cursors.externalId` via
   SchemaBranchMixin.
   `this.state.name` and others state params contains value from
   appropriate cursor via baobab-react branch mixin

   If `tree` props is not received from child component, global tree will
   be used
 }
});

const Page = React.createClass({
  mixins: [SchemaBranchMixin],

  schema: {
    form: {}
  },

  render: function () {
    return (<EditForm tree={this.cursors.form} />);
  }
});
```

## Tests

  npm test

## Release History

* 1.0.0 Initial release
