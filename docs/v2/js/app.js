var app = angular.module('app', []);
app.controller('AppController', function ($scope) {
  $scope.templates = [];
  $scope.currentTemplate = {};
  $scope.isBudgeting = false;
  $scope.isEditing = false;

  $scope.setTemplate = function (template) {
    $scope.currentTemplate = template;
  };

  $scope.getTemplate = function () {
    return $scope.currentTemplate;
  };

  $scope.edit = function (template) {
    template = template || {};
    $scope.isBudgeting = false;
    $scope.setTemplate(template);
    $scope.isEditing = true;
  };

  $scope.budget = function (template) {
    template = template || {};
    $scope.isEditing = false;
    $scope.setTemplate(template);
    $scope.isBudgeting = true;
  };
});

app.directive('navBar', ['$http', '$log', function ($http, $log) {
  return {
    restrict: 'E',
    templateUrl: 'templates/navbar.html',
    controller: function ($scope) {
      $http.get('budget-templates.json').success(function (data) {
        $scope.templates = data;
        if (data.length) {
          $scope.budget(data[0]);
        }
      }.bind(this));

      this.selectTemplate = function (template) {
        $scope.budget(template);
      },

      this.newTemplate = function () {
        $scope.edit({});
      }
    },
    controllerAs: 'navbar'
  };
}]);

app.directive('budgetCalculator', ['$log', function ($log) {
  return {
    restrict: 'E',
    templateUrl: 'templates/budgetor.html',
    controller: function ($scope) {
      $scope.$watch('currentTemplate', function () {
        this.budget = {};
        this.shortTotal = 0;
        this.longTotal = 0;
      }.bind(this));

      this.shortChange = function (category) {
        var multiplier = +$scope.getTemplate().timeframes.ratio;
        this.budget[category].long = this.budget[category].short * multiplier;
        this.calculateTotals();
      };

      this.longChange = function (category) {
        var multiplier = +$scope.getTemplate().timeframes.ratio;
        this.budget[category].short = this.budget[category].long / multiplier;
        this.calculateTotals();
      };

      this.calculateTotals = function () {
        var short = 0;
        var long = 0;
        Object.keys(this.budget).forEach(function (category) {
          short += +this.budget[category].short;
          long += +this.budget[category].long;
        }.bind(this));
        this.shortTotal = short;
        this.longTotal = long;
      };
    },
    controllerAs: 'calculator'
  }
}]);

app.directive('templateEditor', function () {
  return {
    restrict: 'E',
    templateUrl: 'templates/editor.html',
    controller: function ($scope) {
      this.template = {};

      $scope.$watch('currentTemplate', function () {
        this.template = $scope.getTemplate();
        if (!this.template.timeframes) this.template.timeframes = {
          short: '',
          long: '',
          ratio: ''
        };

        if (!this.template.categories) this.template.categories = [];
      }.bind(this));

      this.addCategory = function () {
        if (this.categoryInput) {
          this.template.categories.push(this.categoryInput);
          this.categoryInput = '';
        }
      };

      this.removeCategory = function (category) {
        var ind = this.template.categories.indexOf(category);
        this.template.categories.splice(ind, 1);
      };

      this.save = function (template) {
        $scope.templates.push(template);
        $scope.budget(template);
      }
    },
    controllerAs: 'editor'
  }
});
