const { applizeWatch } = require('@aspulse/applize');
const { resolve } = require('path');

applizeWatch(resolve(__dirname), resolve(__dirname, 'dist/index.js'), resolve(__dirname, 'build.js'));