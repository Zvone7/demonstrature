//import {CellM, CourseDTO, MyUserDTO, MyUserM, TermM} from "../../content/utilities";
$(document).ready(function () {
    var _settingsVM = new SettingsVM();
    _settingsVM.getAllUsers();
    _settingsVM.getAllCourses();
});
var SettingsVM = (function () {
    function SettingsVM() {
        var _this = this;
        //-------------------------------------observables---------------------------------//
        this.UserData = ko.observable(new MyUserM());
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
                self.populateSelectStudy("#course_study_select");
                self.populateSelectStudy("#term_study_select");
            }
            function errorFunc() {
                alert('error');
            }
        };
        this.getAllUsers = function () {
            //console.log("gettingAllUsers");
            var self = _this;
            var serviceURL = '/Settings/UserData';
            $.ajax({
                type: "GET",
                url: serviceURL,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data, status) {
                self.Users = data;
                self.populateSelectUser();
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
            output.push('<option value="' + "Novi kolegij" + '">' + "Novi kolegij" + '</option>');
            for (var i = 0; i < names.length; i++) {
                if (_this.Courses[i].Name != "" && _this.Courses[i].Name != null) {
                    output.push('<option value="' + names[i] + '">' + names[i] + '</option>');
                }
            }
            $(selectId).html(output.join(''));
        };
        this.populateSelectUser = function () {
            var selectId = "#user_user_select";
            var users = _this.Users;
            var output = [];
            $(selectId).find('option').remove().end();
            for (var i = 0; i < users.length; i++) {
                output.push('<option value="' + users[i].Username + '">' + users[i].FullName + '</option>');
            }
            $(selectId).html(output.join(''));
        };
        this.updateUserData = function (username) {
            if (_this.Users != null) {
                for (var i = 0; i < _this.Users.length; i++) {
                    if (username == _this.Users[i].Username) {
                        _this.UserData().Id(_this.Users[i].Id);
                        _this.UserData().Username(_this.Users[i].Username);
                        _this.UserData().FullName(_this.Users[i].FullName);
                        _this.UserData().Role(_this.Users[i].Role);
                        console.log(_this.UserData());
                    }
                }
            }
        };
        var self = this;
        console.log("constructor: settings");
        $(document).ready(function () {
            var _this = this;
            $('#course_study_select').on("change", function () {
                var value = $(_this).val();
                self.populateSelectCourseName("#course_course_select", value);
            });
            $('#term_study_select').on("change", function () {
                var value = $(_this).val();
                self.populateSelectCourseName("#term_course_select", value);
            });
            $('#selectCourse').on("change", function () {
                //self.updateValuesAfterSelect();
            });
            $('#user_user_select').on("change", function () {
                var value = $('#user_user_select').val();
                self.updateUserData(value);
            });
        });
    }
    return SettingsVM;
}());
var MyUserM = (function () {
    function MyUserM(myUser) {
        this.Id = ko.observable(0);
        this.Username = ko.observable("");
        this.FullName = ko.observable("");
        this.Role = ko.observable("");
        if (myUser) {
            this.Id(myUser.Id);
            this.Username(myUser.Username);
            this.FullName(myUser.FullName);
            this.Role(myUser.Role);
        }
    }
    return MyUserM;
}());
var MyUserDTO = (function () {
    function MyUserDTO() {
    }
    return MyUserDTO;
}());
var TermM = (function () {
    function TermM(myTerm) {
        if (myTerm) {
            this.Id = myTerm.Id;
            this.IdCollegeCourse = myTerm.IdCollegeCourse;
            this.IdUser = myTerm.IdUser;
            this.UserPerson = myTerm.UserPerson;
            this.TermDate = myTerm.TermDate;
            this.Group = myTerm.Group;
        }
    }
    return TermM;
}());
var CellM = (function () {
    function CellM(c) {
        this.TakeState = ko.observable(false);
        this.SkipState = ko.observable(true);
        this.TermDate = ko.observable();
        this.Group = ko.observable();
        this.UserPerson = ko.observable();
        if (c) {
            this.x = c.x;
            this.y = c.y;
            this.TakeState(c.TakeState());
            this.SkipState(c.SkipState());
            this.TermDate(c.TermDate());
            this.Group(c.Group());
            this.UserPerson(c.UserPerson());
        }
        else {
            this.UserPerson(new MyUserM());
        }
    }
    return CellM;
}());
var CourseDTO = (function () {
    function CourseDTO() {
    }
    return CourseDTO;
}());
var CourseM = (function () {
    function CourseM() {
        this.Id = ko.observable();
        this.Name = ko.observable();
        this.Study = ko.observable();
        this.Leader = ko.observable();
        this.Asistant = ko.observable();
        this.TermT = ko.observable();
    }
    return CourseM;
}());
var GroupM = (function () {
    function GroupM() {
        this.Id = ko.observable();
        this.Name = ko.observable();
        this.UserPerson = ko.observable();
    }
    return GroupM;
}());
