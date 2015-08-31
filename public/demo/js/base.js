$(function() {
  $('.tlt').textillate();

  function rp(cName, iconHTML) {
    var getClass = document.getElementsByTagName('*');
    for (var i in getClass) {
      if ((' ' + getClass[i].className).indexOf(cName) > -1) {
        var text = getClass[i].innerHTML;
        getClass[i].innerHTML = iconHTML + text;
      }
    }
  }

  rp('finish', '<i class="fa fa-check-square"></i>');
  rp('error', '<i class="fa fa-exclamation-circle"></i>');
  rp('waiting', '<i class="fa fa-tasks"></i>');
  rp('in-progress', '<i class="fa fa-spinner"></i>');

  var x = new Date(document.lastModified);
  var date = '修改日期\n ' + x.toLocaleDateString() + ' ' + x.toLocaleTimeString();
  document.getElementById('date').innerHTML = date;

});
