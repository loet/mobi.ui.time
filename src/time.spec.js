describe('time service', function () {
    var TimeService, $rootScope;

    beforeEach(module('mobi.ui.time'));
    //beforeEach(module('ngMock'));    //not needed?

    beforeEach(inject(function (_TimeService_, _$rootScope_) {
        TimeService = _TimeService_;
        $rootScope = _$rootScope_;
    }));

    describe('definitions', function () {

        it('functions should be defined', inject(function () {
            expect(angular.isFunction(TimeService.correctInput)).toBeTruthy();
            expect(angular.isFunction(TimeService.parse)).toBeTruthy();
            expect(angular.isFunction(TimeService.format)).toBeTruthy();
            expect(angular.isFunction(TimeService.validate)).toBeTruthy();
        }));

    });

    describe('to model conversion', function () {

        it('should with full input return joda string', inject(function () {
            var inputValue, modelValue;
            inputValue = '10:33';
            modelValue = TimeService.parse(inputValue);
            expect(modelValue).toBe('10:33:00.000');
        }));

        it('should complete hours', inject(function () {
            var inputValue, modelValue;
            inputValue = '5';
            modelValue = TimeService.parse(inputValue);
            expect(modelValue).toBe('05:00:00.000');
        }));

        it('should complete minutes', inject(function () {
            var inputValue, modelValue;
            inputValue = '10:3';
            modelValue = TimeService.parse(inputValue);
            expect(modelValue).toBe('10:03:00.000');
        }));

        it('should return undefined if empty', inject(function () {
            var inputValue, modelValue;
            inputValue = '';
            modelValue = TimeService.parse(inputValue);
            expect(modelValue).toBeUndefined();
            inputValue = ' ';
            modelValue = TimeService.parse(inputValue);
            expect(modelValue).toBeUndefined();
        }));

    });

    describe('input correction', function () {

        it('should accept only digits', inject(function () {
            var inputValue, correctedValue;
            inputValue = 'f';
            correctedValue = TimeService.correctInput(inputValue);
            expect(correctedValue).toBe('');
            inputValue = 'text';
            correctedValue = TimeService.correctInput(inputValue);
            expect(correctedValue).toBe('');
        }));

        it('should add 0 and : if first digit > 2', inject(function () {
            var inputValue, correctedValue;
            inputValue = '3';
            correctedValue = TimeService.correctInput(inputValue);
            expect(correctedValue).toBe('03:');
        }));

        it('should add : if 2 digit provided', inject(function () {
            var inputValue, correctedValue;
            inputValue = '18';
            correctedValue = TimeService.correctInput(inputValue);
            expect(correctedValue).toBe('18:');
        }));

        it('should add 0 if first minute digit > 5', inject(function () {
            var inputValue, correctedValue;
            inputValue = '10:6';
            correctedValue = TimeService.correctInput(inputValue);
            expect(correctedValue).toBe('10:06');
        }));


        it('should not accept 24 for hours', inject(function () {
            var inputValue, correctedValue;
            inputValue = '24';
            correctedValue = TimeService.correctInput(inputValue);
            expect(correctedValue).toBe('2');
        }));


    });

    describe('validation', function () {

        it('should set to invalid 24:00:00.000', inject(function () {
            var modelValue, valid;
            modelValue = '24:00:00.000';
            valid = TimeService.validate(modelValue);
            expect(valid).toBeFalsy();
        }));

        it('should set to invalid foo', inject(function () {
            var modelValue, valid;
            modelValue = 'foo';
            valid = TimeService.validate(modelValue);
            expect(valid).toBeFalsy();
        }));

        it('should set to valid correct time', inject(function () {
            var modelValue, valid;
            modelValue = '23:59:00.000';
            valid = TimeService.validate(modelValue);
            expect(valid).toBeTruthy();
        }));

        it('should set to invalid hours > 23', inject(function () {
            var modelValue, valid;
            modelValue = '25:00:00.000';
            valid = TimeService.validate(modelValue);
            expect(valid).toBeFalsy();
        }));

        it('should set to invalid minutes > 59', inject(function () {
            var modelValue, valid;
            modelValue = '05:60:00.000';
            valid = TimeService.validate(modelValue);
            expect(valid).toBeFalsy();
        }));

    });

    describe('time input directive', function () {

        var $scope, form;

        beforeEach(inject(function (_$compile_) {
            var $compile, element;
            $compile = _$compile_;
            $scope = $rootScope.$new();
            $scope.model = {time: ''};
            element = angular.element("<form name='myForm'><input name='time' type='text' mobi-time-input ng-model='model.time' /></form>");
            $compile(element)($scope);
            $scope.$digest();
            form = $scope.myForm;
        }));


        it('should convert parsed viewValue correctly to modelValue', inject(function () {
            var modelValue;
            form.time.$setViewValue('5');
            modelValue = $scope.model.time;
            expect(modelValue).toBe('05:00:00.000');


            form.time.$setViewValue('05:5');
            modelValue = $scope.model.time;
            expect(modelValue).toBe('05:05:00.000');

            form.time.$setViewValue('05:6');
            modelValue = $scope.model.time;
            expect(modelValue).toBe('05:06:00.000');

            form.time.$setViewValue('05:07');
            modelValue = $scope.model.time;
            expect(modelValue).toBe('05:07:00.000');

            form.time.$setViewValue('12:48');
            modelValue = $scope.model.time;
            expect(modelValue).toBe('12:48:00.000');

            form.time.$setViewValue('ffff');
            modelValue = $scope.model.time;
            expect(modelValue).toBeUndefined();

            form.time.$setViewValue('7:7');
            modelValue = $scope.model.time;
            expect(modelValue).toBe('07:07:00.000');
        }));

        it('should format modelValue correctly to viewValue', inject(function () {
            var viewValue;
            $scope.model.time = '05:05:00.000';
            $scope.$apply();
            viewValue = form.time.$viewValue;
            expect(viewValue).toBe('05:05');

            $scope.model.time = '10:42:11.111';
            $scope.$apply();
            viewValue = form.time.$viewValue;
            expect(viewValue).toBe('10:42');
        }));
    });

    describe('time directive', function () {

        var $scope, form, element;

        beforeEach(inject(function (_$compile_, _$rootScope_) {
            var $compile;
            $compile = _$compile_;
            $scope = _$rootScope_;
            $scope.model = {time: ''};
            element = angular.element("<form name='myForm'><mobi-time id='time' name='time' model='model.time' tabindex='1'/></form>");
            $compile(element)($scope);
            $scope.$digest();
            form = $scope.myForm;
        }));


        it('should convert parsed viewValue correctly to modelValue', inject(function () {
            var modelValue;
            form.time.$setViewValue('5');
            $scope.$apply();
            modelValue = $scope.model.time;
            expect(modelValue).toBe('05:00:00.000');

            form.time.$setViewValue('05:5');
            $scope.$apply();
            modelValue = $scope.model.time;
            expect(modelValue).toBe('05:05:00.000');

            form.time.$setViewValue('05:6');
            $scope.$apply();
            modelValue = $scope.model.time;
            expect(modelValue).toBe('05:06:00.000');

            form.time.$setViewValue('05:07');
            $scope.$apply();
            modelValue = $scope.model.time;
            expect(modelValue).toBe('05:07:00.000');

            form.time.$setViewValue('12:48');
            $scope.$apply();
            modelValue = $scope.model.time;
            expect(modelValue).toBe('12:48:00.000');

            form.time.$setViewValue('ffff');
            $scope.$apply();
            modelValue = $scope.model.time;
            expect(modelValue).toBeUndefined();

            form.time.$setViewValue('7:7');
            $scope.$apply();
            modelValue = $scope.model.time;
            expect(modelValue).toBe('07:07:00.000');
        }));

        it('should format modelValue correctly to viewValue', inject(function () {
            var viewValue;
            $scope.model.time = '05:05:00.000';
            $scope.$apply();
            viewValue = form.time.$viewValue;
            expect(viewValue).toBe('05:05');

            $scope.model.time = '10:42:11.111';
            $scope.$apply();
            viewValue = form.time.$viewValue;
            expect(viewValue).toBe('10:42');
        }));

        it('should pass attributes to mobi-time-input directive', inject(function () {
            var html;
            html = element.html();
            expect(html).toContain('id="time"');
            expect(html).toContain('name="time"');
            expect(html).toContain('tabindex="1"');
        }));
    });
});

