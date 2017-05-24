import React from 'react';
import Base from './index';
import counterRoute from './containers/counter/route';
import greetRoute from './containers/greet/route';

export default {
  component: Base,

  childRoutes: [
    greetRoute,
    counterRoute,
  ],
};
