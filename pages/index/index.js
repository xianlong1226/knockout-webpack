var util = require('components/util');
require('components/header');
require('components/left');
require('components/footer');
var pinyin = require('vendors/pinyin.js');

require('./style.scss');
require('./page.html');

var viewModel = ko.mapping.fromJS(require('./data.json'));



$(document).ready(function() {
  ko.applyBindings(viewModel);
});