[![Build Status](https://travis-ci.org/beda-software/baobab-react-schemabranchmixin.svg)](https://travis-ci.org/beda-software/baobab-react-schemabranchmixin)
[![Coverage Status](https://coveralls.io/repos/beda-software/baobab-react-schemabranchmixin/badge.svg?branch=master&service=github)](https://coveralls.io/github/beda-software/baobab-react-schemabranchmixin?branch=master)
[![npm version](https://badge.fury.io/js/baobab-react-schemabranchmixin.svg)](https://badge.fury.io/js/baobab-react-schemabranchmixin)

baobab-react-schemabranchmixin
=========

SchemaBranchMixin based on baobab-react

## Installation

  npm install baobab --save
  
  npm install baobab-react --save
  
  npm install baobab-react-schemabranchmixin --save

## Usage

SchemaCursorMixin is designed for use with baobab-react mixin branch.
General purpose of mixin is tree autogeneration with schema.

This mixin add cursors from component `schema` for `tree` component prop or root tree.

Our tree (auto-generated from schema):
```javascript
{
 globalVal: 'global value (predefined)',
 form: {
   name: '',
   externalId: ''
 }
}
```

Example of usage:
```javascript
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

* 1.0.10 Fix #6
* 1.0.9 Fixed problem with cursors definition as function
* 1.0.8 Fixed problems with nested schema default values
* 1.0.7 Fixed problems with monkey
* 1.0.6 Added baobab-prop-types deps
* 1.0.4 Added PropTypes to export
* 1.0.3 Fixed deps
* 1.0.2 Initial release
