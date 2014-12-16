/* mobi.ui.time - v0.0.4 - 2014-12-16 */

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


angular.module('mobi.ui.time', [
    'mobi.ui.time.services',
    'mobi.ui.time.directives'
])

;


angular.module('mobi.ui.time.services', [
    ])

    .factory('TimeService', function () {

        function checkAndCorrectFirst(value) {
            var number = parseInt(value.charAt(0), 10);
            if (isNaN(number)) {
                value = '';
            } else {
                if (number > 2) {
                    value = '0' + value + ':';
                }
            }
            return value;
        }

        function checkAndCorrectSecond(value) {
            var number = parseInt(value.charAt(1), 10), hours, before, after;
            if (isNaN(number)) {
                value = value.slice(0, 1);
            } else {
                hours = parseInt(value.slice(0, 2), 10);
                if (hours > 23) {
                    value = value.slice(0, 1);
                } else {
                    before = value.slice(0, 2);
                    after = value.slice(3);
                    value = before + ':' + after;
                }
            }
            return value;
        }

        function checkAndCorrectThird(value) {
            var character = value.charAt(2), before, after;
            if (character !== ':') {
                before = value.slice(0, 2);
                after = value.slice(3);
                value = before + ':' + after;
            }
            return value;
        }

        function checkAndCorrectFourth(value) {
            var number = parseInt(value.charAt(3), 10);
            if (isNaN(number)) {
                value = value.slice(0, 3);
            } else if (number > 5) {
                value = value.slice(0, 3) + '0' + number;
            }
            return value;
        }

        function checkAndCorrectFifth(value) {
            var number = parseInt(value.charAt(4), 10), minutes;
            if (isNaN(number)) {
                value = value.slice(0, 4);
            } else {
                minutes = parseInt(value.slice(3, 5), 10);
                if (minutes > 59) {
                    value = value.slice(0, 4);
                }
            }
            return value;
        }

        function checkAndCorrectOthers(value) {
            var length = value.length;
            if (length > 5) {
                value = value.slice(0, 5);
            }
            return value;
        }

        function correctInput(value) {
            var i, lengthBefore, lengthAfter;
            if (angular.isDefined(value) && value !== null) {
                for (i = 1; i <= value.length; i++) {
                    lengthBefore = value.length;
                    switch (i) {
                        case 1:
                            value = checkAndCorrectFirst(value);
                            break;
                        case 2:
                            value = checkAndCorrectSecond(value);
                            break;
                        case 3:
                            value = checkAndCorrectThird(value);
                            break;
                        case 4:
                            value = checkAndCorrectFourth(value);
                            break;
                        case 5:
                            value = checkAndCorrectFifth(value);
                            break;
                        default :
                            value = checkAndCorrectOthers(value);
                    }
                    lengthAfter = value.length;
                    i = i - (lengthBefore - lengthAfter);
                }
            }
            return value;
        }

        function parse(inputValue) {
            var hours, minutes;
            if (inputValue === null || !angular.isDefined(inputValue) || inputValue.trim() === '') {
                return undefined;
            }
            if (angular.isDefined(inputValue) && inputValue !== null) {
                hours = inputValue.slice(0, 2);
                if (hours.length === 0) {
                    hours = '00';
                } else if (hours.length === 1) {
                    hours = '0' + hours;
                }
                minutes = inputValue.slice(3, 5);
                if (minutes.length === 0) {
                    minutes = '00';
                } else if (minutes.length === 1) {
                    minutes = '0' + minutes;
                }
                return hours + ':' + minutes + ':00.000';
            }
        }

        function format(value) {
            if (value && value.length > 5) {
                value = value.slice(0, 5);
            }
            return value;
        }

        function validate(value) {
            var hours, minutes;
            //var timeRegex = new RegExp('([0-9]{2}:[0-9]{2}:[0]{2}.[0]{3}$)');
            if (!value) { //allow potentially empty input
                return true;
            }
            if (value) {
                hours = parseInt(value.slice(0, 2), 10);
                minutes = parseInt(value.slice(3, 5), 10);
                if (angular.isNumber(hours) && angular.isNumber(minutes) && hours < 24 && minutes < 60) {
                    return true;
                }

            } else {
                return false;
            }
        }

        return {
            correctInput: correctInput,
            parse: parse,
            format: format,
            validate: validate
        };
    })

;

