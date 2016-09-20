$(document).ready(function () {
    var _tableVM = new TableVM();
    _tableVM.getAllCourses();
});
var TableVM = (function () {
    function TableVM() {
        var _this = this;
        //------------------------------------observables----------------------------------//
        this.Terms0 = ko.observableArray();
        this.Terms1 = ko.observableArray();
        this.Terms2 = ko.observableArray();
        this.Terms3 = ko.observableArray();
        this.allTerms = ko.observableArray();
        this.Users = ko.observableArray();
        this.disableLeft = ko.observable(false);
        this.disableRight = ko.observable(true);
        this.disableUp = ko.observable(false);
        this.disableDown = ko.observable(true);
        this.moveX = 0;
        this.moveY = 0;
        this.numberOfGroups = 0;
        this.numberOfTerms = 0;
        //-------------------------------USERS START------------------------------------------------//
        this.getAllUsers = function () {
            var self = _this;
            var serviceURL = '/Table/AllUsers';
            $.ajax({
                type: "GET",
                url: serviceURL,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data, status) {
                //alert(data);
                self.Users(data);
                console.log(self.Users());
                console.log(status);
            }
            function errorFunc() {
                alert('error');
            }
        };
        //-------------------------------USERS END--------------------------------------------------//
        //-------------------------------COURSE START-----------------------------------------------//
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
                //console.log(self.Courses);
                self.populateSelectStudy();
            }
            function errorFunc() {
                alert('error');
            }
        };
        this.populateSelectStudy = function () {
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
            $('#selectStudy').find('option').remove().end();
            for (var i = 0; i < studies.length; i++) {
                output.push('<option value="' + studies[i] + '">' + studies[i] + '</option>');
            }
            $('#selectStudy').html(output.join(''));
            var selectStudyValue = $('#selectStudy').val();
            _this.populateSelectCourseName(selectStudyValue);
            _this.updateValuesAfterSelect();
        };
        this.populateSelectCourseName = function (studyName) {
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
            $('#selectCourse').find('option').remove().end();
            for (var i = 0; i < names.length; i++) {
                if (_this.Courses[i].Name != "" && _this.Courses[i].Name != null) {
                    output.push('<option value="' + names[i] + '">' + names[i] + '</option>');
                }
            }
            $('#selectCourse').html(output.join(''));
        };
        //-------------------------------COURSE END-------------------------------------------------//
        //-------------------------------TERMS START------------------------------------------------//
        this.fillAllTerms = function (data) {
            var stringResult = "";
            _this.numberOfTerms = data.length;
            _this.numberOfGroups = data[0].length;
            for (var i = 0; i < data.length; i++) {
                _this.allTerms[i] = new Array();
                for (var j = 0; j < data[0].length; j++) {
                    var cell = ko.observable(new CellM());
                    cell().x = i;
                    cell().y = j;
                    cell().UserPerson(data[i][j].UserPerson);
                    var jsonDate = data[i][j].TermDate.toString();
                    var date = new Date(parseInt(jsonDate.substr(6)));
                    cell().TermDate(date.getDate().toString() + "." +
                        (date.getMonth()).toString() + "." +
                        date.getFullYear().toString());
                    cell().Group(data[i][j].Group);
                    _this.allTerms[i][j] = cell;
                }
            }
            _this.createTermTable(data);
        };
        this.createTermTable = function (data) {
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[0].length; j++) {
                    var cell = new CellM();
                    cell.x = i;
                    cell.y = j;
                    cell.UserPerson(new MyUserM(data[i][j].UserPerson));
                    var jsonDate = data[i][j].TermDate.toString();
                    var date = new Date(parseInt(jsonDate.substr(6)));
                    cell.TermDate(date.getDate() + "." +
                        (date.getMonth()).toString() + "." +
                        date.getFullYear().toString());
                    cell.Group(data[i][j].Group);
                    if (i == 0)
                        _this.Terms0.push(cell);
                    else if (i == 1)
                        _this.Terms1.push(cell);
                    else if (i == 2)
                        _this.Terms2.push(cell);
                    else if (i == 3)
                        _this.Terms3.push(cell);
                }
            }
            ko.applyBindings(_this);
        };
        this.updateTermTable = function (data) {
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[0].length; j++) {
                    var cell = new CellM();
                    cell.x = i;
                    cell.y = j;
                    cell.UserPerson(data[i][j].UserPerson);
                    var jsonDate = data[i][j].TermDate.toString();
                    var date = new Date(parseInt(jsonDate.substr(6)));
                    cell.TermDate(date.getDate() + "." +
                        (date.getMonth()).toString() + "." +
                        date.getFullYear().toString());
                    cell.Group(data[i][j].Group);
                    if (i == 0)
                        _this.Terms0.push(cell);
                    else if (i == 1)
                        _this.Terms1.push(cell);
                    else if (i == 2)
                        _this.Terms2.push(cell);
                    else if (i == 3)
                        _this.Terms3.push(cell);
                }
            }
        };
        this.updateTermArrays = function (i_, j_) {
            //console.log("clicked stuff:", i_, "|", j_);
            //i_ = 0; j_ = 0;
            var helper = "";
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 5; j++) {
                    var cell = _this.allTerms[i_ + i][j_ + j];
                    cell().x = i;
                    cell().y = j;
                    if (i == 0) {
                        _this.Terms0()[j].UserPerson(cell().UserPerson());
                        _this.Terms0()[j].SkipState(cell().SkipState());
                        _this.Terms0()[j].TakeState(cell().SkipState());
                        _this.Terms0()[j].TermDate(cell().TermDate());
                        _this.Terms0()[j].x = cell().x;
                        _this.Terms0()[j].y = cell().y;
                        _this.Terms0()[j].Group(cell().Group());
                    }
                    else if (i == 1) {
                        _this.Terms1()[j].UserPerson(cell().UserPerson());
                        _this.Terms1()[j].SkipState(cell().SkipState());
                        _this.Terms1()[j].TakeState(cell().SkipState());
                        _this.Terms1()[j].TermDate(cell().TermDate());
                        _this.Terms1()[j].x = cell().x;
                        _this.Terms1()[j].y = cell().y;
                        _this.Terms1()[j].Group(cell().Group());
                    }
                    else if (i == 2) {
                        _this.Terms2()[j].UserPerson(cell().UserPerson());
                        _this.Terms2()[j].SkipState(cell().SkipState());
                        _this.Terms2()[j].TakeState(cell().SkipState());
                        _this.Terms2()[j].TermDate(cell().TermDate());
                        _this.Terms2()[j].x = cell().x;
                        _this.Terms2()[j].y = cell().y;
                        _this.Terms2()[j].Group(cell().Group());
                    }
                    else if (i == 3) {
                        _this.Terms3()[j].UserPerson(cell().UserPerson());
                        _this.Terms3()[j].SkipState(cell().SkipState());
                        _this.Terms3()[j].TakeState(cell().SkipState());
                        _this.Terms3()[j].TermDate(cell().TermDate());
                        _this.Terms3()[j].x = cell().x;
                        _this.Terms3()[j].y = cell().y;
                        _this.Terms3()[j].Group(cell().Group());
                    }
                }
            }
            console.log(_this.Terms0()[0].UserPerson());
        };
        this.updateValuesAfterSelect = function () {
            var selectStudy = $('#selectStudy').val();
            var selectCourse = $('#selectCourse').val();
            var self = _this;
            var course = new CourseDTO();
            for (var i = 0; i < self.Courses.length; i++) {
                var y = self.Courses[i];
                if (y.Study == selectStudy && y.Name == selectCourse) {
                    course = y;
                }
            }
            if (self.Terms0().length > 0) {
                self.updateTermTable(course.TermT);
            }
            else {
                self.fillAllTerms(course.TermT);
            }
        };
        //-------------------------------TERMS END--------------------------------------------------//
        //-------------------------------NAVIGATION START-------------------------------------------//
        this.leftClicked = function () {
            _this.moveY++;
            if (_this.checkValidMovement(_this.moveX, _this.moveY)) {
                _this.disableRight(false);
                _this.updateTermArrays(_this.moveX, _this.moveY);
            }
            else {
                _this.handleWrongMove();
                _this.moveY--;
                _this.disableLeft(true);
            }
        };
        this.rightClicked = function () {
            _this.moveY--;
            if (_this.checkValidMovement(_this.moveX, _this.moveY)) {
                _this.updateTermArrays(_this.moveX, _this.moveY);
                _this.disableLeft(false);
            }
            else {
                _this.handleWrongMove();
                _this.moveY++;
                _this.disableRight(true);
            }
        };
        this.upClicked = function () {
            _this.moveX++;
            if (_this.checkValidMovement(_this.moveX, _this.moveY)) {
                _this.updateTermArrays(_this.moveX, _this.moveY);
                _this.disableDown(false);
            }
            else {
                _this.handleWrongMove();
                _this.moveX--;
                _this.disableUp(true);
            }
        };
        this.downClicked = function () {
            _this.moveX--;
            if (_this.checkValidMovement(_this.moveX, _this.moveY)) {
                _this.updateTermArrays(_this.moveX, _this.moveY);
                _this.disableUp(false);
            }
            else {
                _this.handleWrongMove();
                _this.moveX++;
                _this.disableDown(true);
            }
        };
        this.handleWrongMove = function () {
            //console.log("Wrong move!");
        };
        this.checkValidMovement = function (moveX, moveY) {
            //console.log(this.moveX, this.moveY);
            if (moveX >= 0 && moveX + 4 <= _this.numberOfTerms
                && moveY >= 0 && moveY + 5 <= _this.numberOfGroups) {
                return true;
            }
            else {
                return false;
            }
        };
        //-------------------------------NAVIGATION END---------------------------------------------//
        this.test = function () {
            _this.Terms0()[0].UserPerson().Username("lalala");
        };
        this.test2 = function () {
            console.log(_this.Terms0()[0].UserPerson().Username());
            console.log(_this.Terms0()[0].Group().UserPerson); //.Username());
        };
        var self = this;
        $(document).ready(function () {
            $('#selectStudy').on("change", function () {
                var value = $(this).val();
                self.populateSelectCourseName(value);
            });
            $('#selectCourse').on("change", function () {
                self.updateValuesAfterSelect();
            });
        });
    }
    return TableVM;
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
