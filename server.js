const runGameOn = require('./runGameOn.js');
// runGameOn requires a reachable Mongodb and an unoccupied port.

runGameOn('SmallWildland', process.argv[2] || 2000);
