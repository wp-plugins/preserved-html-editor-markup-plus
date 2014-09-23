define(function(require) {
  var formname               = require('text!templates/snippet/formname.html')
  , textinput                = require('text!templates/snippet/textinput.html')
  , multiplecheckboxes       = require('text!templates/snippet/multiplecheckboxes.html')
  , multipleradios           = require('text!templates/snippet/multipleradios.html')
  , selectbasic              = require('text!templates/snippet/selectbasic.html')
  , textarea                 = require('text!templates/snippet/textarea.html')
  , textinput                = require('text!templates/snippet/textinput.html');

  return {
    formname                   : formname
    , textinput                : textinput
    , multiplecheckboxes       : multiplecheckboxes
    , multipleradios           : multipleradios
    , selectbasic              : selectbasic
    , textarea                 : textarea
    , textinput                : textinput
  }
});
