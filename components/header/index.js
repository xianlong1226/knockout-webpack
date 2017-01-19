require('./style.scss')

function createViewModel (params) {
    var dataModel = require('./data.json');
    var viewModel = ko.mapping.fromJS(dataModel);

    

    return viewModel;
}

ko.components.register('components_header', {
  viewModel: {
    createViewModel: createViewModel
  },
  template: require('./template.html')
});