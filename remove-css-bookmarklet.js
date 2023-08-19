javascript:(function() {
  var styleSheets = document.styleSheets;
  for (var i = 0; i < styleSheets.length; i++) {
    var styleSheet = styleSheets[i];
    styleSheet.disabled = true;
  }

  var elements = document.getElementsByTagName('*');
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    element.removeAttribute('style');
  }
})();
