"use strict";
$(document).ready(function () {
    var _settingsVM = new SettingsVM();
    _settingsVM.getAllCourses();
});
var SettingsVM = (function () {
    function SettingsVM() {
        var _this = this;
        //-------------------------------COURSES START-------------------------------------------//
        this.getAllCourses = function () {
            //console.log("gettingAllCourses");
            var self = _this;
            var serviceURL = '/Table/AllCollegeCourses';
            $.ajax({
                type: "GET",
                url: serviceURL,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data, status) {
                self.Courses = data;
                console.log(self.Courses);
                self.populateSelectStudy("#course_study_select");
                self.populateSelectStudy("#term_study_select");
            }
            function errorFunc() {
                alert('error');
            }
        };
        //-------------------------------COURSES END---------------------------------------------//
        //-------------------------------CHOOSE FORM DATA START--------------------------------------------//
        this.populateSelectStudy = function (selectId) {
            var studies = [];
            var output = [];
            for (var i = 0; i < _this.Courses.length; i++) {
                var x = _this.Courses[i].Study;
                var alreadyExists = false;
                if (studies.length > 0) {
                    for (var j = 0; j < studies.length; j++) {
                        if (studies[j] == x) {
                            alreadyExists = true;
                        }
                    }
                }
                if (!alreadyExists) {
                    studies.push(x);
                }
            }
            $(selectId).find('option').remove().end();
            for (var i = 0; i < studies.length; i++) {
                output.push('<option value="' + studies[i] + '">' + studies[i] + '</option>');
            }
            $(selectId).html(output.join(''));
            var selectStudyValue = $(selectId).val();
            _this.populateSelectCourseName("#course_course_select", selectStudyValue);
            _this.populateSelectCourseName("#term_course_select", selectStudyValue);
        };
        this.populateSelectCourseName = function (selectId, studyName) {
            var output = [];
            var names = [];
            for (var i = 0; i < _this.Courses.length; i++) {
                var study = _this.Courses[i].Study;
                var course = _this.Courses[i].Name;
                if (study != studyName) {
                    continue;
                }
                var alreadyExists = false;
                if (names.length > 0) {
                    for (var j = 0; j < names.length; j++) {
                        if (names[j] == course) {
                            alreadyExists = true;
                        }
                    }
                }
                if (!alreadyExists) {
                    names.push(course);
                }
            }
            $(selectId).find('option').remove().end();
            for (var i = 0; i < names.length; i++) {
                if (_this.Courses[i].Name != "" && _this.Courses[i].Name != null) {
                    output.push('<option value="' + names[i] + '">' + names[i] + '</option>');
                }
            }
            $(selectId).html(output.join(''));
        };
        var self = this;
        console.log("constructor: settings");
        $(document).ready(function () {
            $('#course_study_select').on("change", function () {
                var value = $(this).val();
                self.populateSelectCourseName("#course_course_select", value);
            });
            $('#term_study_select').on("change", function () {
                var value = $(this).val();
                self.populateSelectCourseName("#term_course_select", value);
            });
            $('#selectCourse').on("change", function () {
                //self.updateValuesAfterSelect();
            });
        });
    }
    return SettingsVM;
}());
