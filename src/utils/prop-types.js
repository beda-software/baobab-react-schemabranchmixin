import Baobab from 'baobab';

const PropTypes = {};

function errorMessage(propName, what) {
  return 'prop type `' + propName + '` is invalid; it must be ' + what + '.';
}

function isRequired(props, propName) {
    if (props[propName] == null) {
      return new Error('prop type `' + propName + '` is a required.');
    }
}

PropTypes.baobab = function(props, propName) {
  if (!(propName in props))
    return;

  if (!(props[propName] instanceof Baobab))
    return new Error(errorMessage(propName, 'a Baobab tree'));
};

PropTypes.baobab.isRequired = isRequired;

PropTypes.cursor = function(props, propName) {
  if (!(propName in props))
    return;

  if (!(props[propName] instanceof Baobab.Cursor))
    return new Error(errorMessage(propName, 'a Baobab.Cursor'));
};

PropTypes.cursor.isRequired = isRequired;

export default PropTypes;
