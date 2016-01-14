import Baobab from 'baobab';

const PropTypes = {};

function errorMessage(propName, what) {
  return 'prop type `' + propName + '` is invalid; it must be ' + what + '.';
}

PropTypes.baobab = function(props, propName) {
  if (!(propName in props))
    return;

  if (!(props[propName] instanceof Baobab))
    return new Error(errorMessage(propName, 'a Baobab tree'));
};

PropTypes.cursor = function(props, propName) {
  if (!(propName in props))
    return;

  if (!(props[propName] instanceof Baobab.Cursor))
    return new Error(errorMessage(propName, 'a Baobab.Cursor'));
};

export default PropTypes;
