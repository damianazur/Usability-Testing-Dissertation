var o = {};

var Store = {
  saveCurrentState: function(state) {
    o['state'] = state;
  },
  getPreviousState: function() {
    return o['state'];
  }
};    

module.exports = Store;