const _ = require('lodash');

module.exports.assertEvent = (contract, filter) => new Promise((resolve, reject) => {
  const event = contract[filter.event]();
  event.watch();
  event.get((error, logs) => {
    const log = _.filter(logs, filter);
    if (log && log.length) {
      resolve(log[0]);
    } else {
      reject("Failed to find filtered event for " + filter.event);
    }
  });
  event.stopWatching();
});
