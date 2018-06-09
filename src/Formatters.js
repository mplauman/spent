
module.exports = {
  dateToString: function(d) {
    let year = ('' + d.getFullYear()).padStart(4, '0');
    let month = ('' + (d.getMonth() + 1)).padStart(2, '0');
    let day = ('' + d.getDate()).padStart(2, '0');

    return year + '-' + month + '-' + day;
  },

  dateFromString: function(d) {
    let parts = d.split('-');

    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
};
