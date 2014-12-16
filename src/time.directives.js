angular.module('mobi.ui.time.directives', [
        'mobi.ui.time.services'
    ])


    .directive('mobiTimeInput', function (TimeService) {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elm, attrs, ngModelCtrl) {

                function timeStringParser(value) {
                    var correctedInputValue;
                    correctedInputValue = TimeService.correctInput(value);
                    elm[0].value = correctedInputValue;
                    return TimeService.parse(correctedInputValue);
                }

                function timeFormatter(value) {
                    return TimeService.format(value);
                }

                function timeValidator(value) {
                    return value;
                }

                ngModelCtrl.$parsers.push(timeStringParser);
                ngModelCtrl.$formatters.push(timeFormatter);

                ngModelCtrl.$formatters.push(timeValidator);
                ngModelCtrl.$parsers.unshift(timeValidator);

                //what could this be good for???
//                attrs.$observe('mobiTimeInput', function() {
//                    timeValidator(ngModelCtrl.$viewValue);
//                });


                elm.bind('blur', function () {
                    timeValidator(ngModelCtrl.$modelValue);
                    //bring formatted model value back to ui
                    var modelValue = ngModelCtrl.$modelValue;
                    if (!ngModelCtrl.$isEmpty(modelValue)) {
                        elm[0].value = timeFormatter(modelValue);
                    }
                });
            }
        };
    })

    .directive('mobiTime', function () {
        return {
            template: '<input type="text" ng-model="themodel" class="form-control" placeholder="hh:mm" mobi-time-input maxlength="5" edit-mode/>',
            restrict: 'E',
            scope: { themodel: '=model', tabindex: '@', id: '@', name: '@', definition: '@', definitionScopeModel: '='},
            replace: true
        };
    })

;

