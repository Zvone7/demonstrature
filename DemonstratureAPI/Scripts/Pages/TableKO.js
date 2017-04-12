$(document).ready(function () {
    var tableVM = new TableVM();
    tableVM.allocation();
    tableVM.getAllCourses();
    ko.applyBindings(tableVM);
});
var TableVM = (function () {
    //------------------------------------FUNCTIONS------------------------------------//
    function TableVM() {
        var _this = this;
        //---------------------------------OBSERVABLES------------------------------//
        this.Terms0 = ko.observableArray();
        this.Terms1 = ko.observableArray();
        this.Terms2 = ko.observableArray();
        this.Terms3 = ko.observableArray();
        //public allTerms = ko.observableArray<CellM_T[][]>();
        //public Users = ko.observableArray<UserM_T>();
        this.YO = ko.observable();
        this.CoursesAll = ko.observableArray([]);
        this.CoursesActive = ko.observableArray([]);
        this.Studies = ko.observableArray([]);
        this.Demonstrators = ko.observableArray([]);
        this.disableLeft = ko.observable(false);
        this.disableRight = ko.observable(true);
        this.disableUp = ko.observable(false);
        this.disableDown = ko.observable(true);
        //----------------------------------default values------------------------------//
        this.defaultTextButtonSkip = "Preskoči termin";
        this.defaultTextButtonTake = "Uzmi termin";
        this.defaultCourseName = "Kolegij";
        this.defaultDate = new Date().getDate() + "." + (new Date().getMonth() + 1) + "." + new Date().getFullYear() + ".";
        this.defaultGroupName = "Grupa";
        this.defaultId = 0;
        this.defaultStudyName = "Smjer";
        this.defaultUserLastName = "Prezime";
        this.defaultUserName = "Ime";
        this.defaultUserRole = "D";
        this.defaultUserUsername = "iprezime";
        //--------------------------------------primitive----------------------------------//
        this.moveX = 0;
        this.moveY = 0;
        this.numberOfGroups = 10;
        this.numberOfTerms = 7;
        this.bindingsApplied = false;
        this.link_main = "http://localhost:49977";
        this.link_settings = "/Settings/Settings";
        this.link_table = "/Table/Table";
        this.link_login = "/Login/Login";
        this.allocation = function () {
            var self = _this;
            //console.log("allocation");
            var study = ko.observable(new KoStudy());
            study().Name(self.defaultStudyName);
            study().Id(self.defaultId);
            self.Studies([]);
            self.Studies().push(study());
            var course = ko.observable(new KoCourse());
            course().Id(self.defaultId);
            course().Name(self.defaultCourseName);
            course().Study(self.defaultStudyName);
            self.CoursesActive([]);
            self.CoursesActive().push(course());
            var demonstrator = ko.observable(new KoDemonstrator(self.defaultUserName, self.defaultId));
            self.Demonstrators([]);
            self.Demonstrators().push(demonstrator());
            var user = ko.observable(new KoUser());
            user().Id(0);
            user().LastName(self.defaultUserLastName);
            user().Name(self.defaultUserName);
            user().Role(self.defaultUserRole);
            user().Username(self.defaultUserUsername);
            var group = ko.observable(new KoGroup());
            group().CourseId(self.defaultId);
            group().Id(self.defaultId);
            group().Name(self.defaultGroupName);
            group().OwnerId(self.defaultId);
            group().Owner = user;
            var term = ko.observable(new KoTerm());
            term().Course = course;
            term().CourseId = course().Id;
            term().User = user;
            term().UserId = user().Id;
            term().Group = group;
            term().GroupId = group().Id;
            term().Id(0);
            term().Date(self.defaultDate);
            //allocation for Terms arrays
            self.allocateTermsArrays(term);
        };
        this.allocateTermsArrays = function (term) {
            var self = _this;
            self.Terms0([]);
            self.Terms1([]);
            self.Terms2([]);
            self.Terms3([]);
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 5; j++) {
                    var cell = ko.observable(new KoCell());
                    cell().ButtonSkipState(true);
                    cell().ButtonTakeState(true);
                    cell().CellState(0);
                    cell().x(i);
                    cell().y(j);
                    cell().Term = term;
                    switch (i) {
                        case 0:
                            self.Terms0().push(cell());
                            break;
                        case 1:
                            self.Terms1().push(cell());
                            break;
                        case 2:
                            self.Terms2().push(cell());
                            break;
                        case 3:
                            self.Terms3().push(cell());
                            break;
                    }
                }
            }
        };
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
                //console.log(data);
                var study = ko.observable(new KoStudy());
                study().Name("ja ne zelim raditi");
                study().Id(1);
                self.Studies().push(study());
                //console.log("_Studies:",self.Studies());
                for (var i = 0; i < data.length; i++) {
                    var course = ko.observable(new KoCourse());
                    course().Id = data[i].Id;
                    course().Name = data[i].Name;
                    course().Study = data[i].Study;
                    self.CoursesAll().push(course());
                }
                //console.log("CoursesAll", self.CoursesAll());
                self.populateSelectStudy();
            }
            function errorFunc() {
                alert('error');
            }
        };
        this.populateSelectStudy = function () {
            //console.log("populating select study");
            var self = _this;
            //console.log("Studies:", self.Studies());
            self.Studies([]);
            var studyId = 1;
            for (var i = 0; i < self.CoursesAll().length; i++) {
                if (self.Studies().length == 0) {
                    var study = ko.observable(new KoStudy());
                    study().Name = self.CoursesAll()[i].Study;
                    study().Id(studyId);
                    self.Studies.push(study());
                    studyId++;
                }
                else {
                    var alreadyPushed = false;
                    for (var j = 0; j < self.Studies().length; j++) {
                        if (self.Studies()[j].Name == self.CoursesAll()[i].Study) {
                            alreadyPushed = true;
                        }
                    }
                    if (!alreadyPushed) {
                        var study = ko.observable(new KoStudy());
                        study().Name = self.CoursesAll()[i].Study;
                        study().Id(studyId);
                        self.Studies.push(study());
                        studyId++;
                    }
                }
            }
            self.populateSelectCourse(self.Studies()[0].Name);
        };
        this.populateSelectCourse = function (value) {
            var self = _this;
            //console.log("populating select course for ", value);
            self.CoursesActive().length = 0;
            for (var i = 0; i < self.CoursesAll().length; i++) {
                //console.log(i.toString(), "\n", self.CoursesAll()[i].Name, "\n", value);
                if (self.CoursesAll()[i].Study == value) {
                    var course = ko.observable(new KoCourse());
                    course().Id = self.CoursesAll()[i].Id;
                    course().Name = self.CoursesAll()[i].Name;
                    course().Study = self.CoursesAll()[i].Study;
                    self.CoursesActive.push(course());
                }
            }
            //console.log(self.CoursesActive(), self.bindingsApplied);
        };
        this.GetTerm = function () {
        };
        //-------------------------------NAVIGATION START-------------------------------------------//
        this.leftClicked = function () {
            _this.moveY++;
            if (_this.moveX >= 0 && _this.moveX + 4 <= _this.numberOfTerms
                && _this.moveY >= 0 && _this.moveY + 5 <= _this.numberOfGroups) {
                //this.updateTermArrays(this.moveX, this.moveY);
                _this.disableRight(false);
            }
            else {
                _this.handleWrongMove();
                _this.moveY--;
                _this.disableLeft(true);
            }
            console.log(_this.disableLeft());
        };
        this.rightClicked = function () {
            _this.moveY--;
            if (_this.moveX >= 0 && _this.moveX + 4 <= _this.numberOfTerms
                && _this.moveY >= 0 && _this.moveY + 5 <= _this.numberOfGroups) {
                //this.updateTermArrays(this.moveX, this.moveY);
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
            if (_this.moveX >= 0 && _this.moveX + 4 <= _this.numberOfTerms
                && _this.moveY >= 0 && _this.moveY + 5 <= _this.numberOfGroups) {
                //this.updateTermArrays(this.moveX, this.moveY);
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
            if (_this.moveX >= 0 && _this.moveX + 4 <= _this.numberOfTerms
                && _this.moveY >= 0 && _this.moveY + 5 <= _this.numberOfGroups) {
                //this.updateTermArrays(this.moveX, this.moveY);
                _this.disableUp(false);
            }
            else {
                _this.handleWrongMove();
                _this.moveX++;
                _this.disableDown(true);
            }
        };
        this.handleWrongMove = function () {
            console.log("Wrong move!");
        };
        //-------------------------------NAVIGATION END---------------------------------------------//
        //-------------------------------TERM START----------------------------------------------//
        this.getTermsByCourseId = function () {
            //console.log("getting term per course id");
            var courseId = $('#term_course_select').val();
            $("#term_name").val("");
            //console.log(courseId);
            var self = _this;
            var serviceURL = '/Settings/GetTermsByCourseId';
            $.ajax({
                type: "GET",
                url: serviceURL + "?courseId=" + courseId,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data, status) {
                //console.log(data);
                //self.Terms = data;
                //for (var i = 0; i < self.Terms.length; i++) {
                //    //console.log(self.Terms[i].TermDate);
                //}
                //self.populateSelectTerm();
            }
            function errorFunc(data) {
                console.log('error getting data about all terms for course with id', courseId, "\nreason:\n", data);
            }
        };
        this.getTermsByGroupId = function () {
            //console.log("getting term per course data");
            var groupId = $('#term_group_select').val();
            if (groupId == "-1") {
                _this.getTermsByCourseId();
                return;
            }
            $("#term_name").val("");
            //console.log(courseId);
            var self = _this;
            var serviceURL = '/Settings/GetTermsByGroupId';
            $.ajax({
                type: "GET",
                url: serviceURL + "?groupId=" + groupId,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data, status) {
                //self.Terms = data;
                //self.populateSelectTerm();
            }
            function errorFunc(data) {
                console.log('error getting data about all terms for course with id', groupId, "\nreason:\n", data);
            }
        };
        //-------------------------------TERM END------------------------------------------------//
        this.LogOut = function () {
            var self = _this;
            var serviceURL = '/Login/LogOff';
            $.ajax({
                type: "GET",
                url: serviceURL,
                contentType: "application/json; charset=utf-8",
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data) {
                console.log("Succesfull logoff");
                location.href = self.link_main + self.link_login;
            }
            function errorFunc() {
                console.log("Fail logoff");
            }
        };
        this.test = function () {
            var self = _this;
        };
        var self = this;
        $(document).ready(function () {
            $('#test').on("click", function () {
                self.test;
            });
            $('select').on("change", function () {
                if (this.id == "selectStudy") {
                    var value = $("#selectStudy option:selected").text();
                    self.populateSelectCourse(value);
                }
                else if (this.id == "selectCourse") {
                }
                //else if (this.id.lastIndexOf("search") != '-1') {
                //    var i = parseInt(this.id.substring(6, 7));
                //    var j = parseInt(this.id.substring(7, 8));
                //}
            });
            //navigation
            $('#logout').on("click", function () {
                self.LogOut();
            });
            $('#test').on("click", function () {
                self.test();
            });
            $('#arrowLeft').on("click", function () {
                //self.leftClicked();
            });
            $('#arrowRight').on("click", function () {
                //self.rightClicked();
            });
            $('#arrowUp').on("click", function () {
                //self.upClicked();
            });
            $('#arrowDown').on("click", function () {
                //self.downClicked();
            });
        });
        function progress() {
            /*
                    getAllCourses
                        populateSelectStudy
                            populateSelectCourse
            */
        }
    }
    return TableVM;
}());
var KoTerm = (function () {
    function KoTerm() {
        this.Id = ko.observable();
        this.CourseId = ko.observable();
        this.Course = ko.observable();
        this.UserId = ko.observable();
        this.User = ko.observable();
        this.GroupId = ko.observable();
        this.Group = ko.observable();
        this.Date = ko.observable();
    }
    return KoTerm;
}());
var KoCell = (function () {
    function KoCell() {
        this.x = ko.observable();
        this.y = ko.observable();
        this.CellState = ko.observable();
        this.ButtonTakeState = ko.observable();
        this.ButtonSkipState = ko.observable();
        this.Term = ko.observable();
    }
    return KoCell;
}());
var KoUser = (function () {
    function KoUser() {
        this.Id = ko.observable();
        this.Username = ko.observable();
        this.Name = ko.observable();
        this.LastName = ko.observable();
        this.Role = ko.observable();
    }
    return KoUser;
}());
var KoStudy = (function () {
    function KoStudy() {
        this.Id = ko.observable();
        this.Name = ko.observable();
    }
    return KoStudy;
}());
var KoCourse = (function () {
    function KoCourse() {
        this.Id = ko.observable();
        this.Name = ko.observable();
        this.Study = ko.observable();
    }
    return KoCourse;
}());
var KoGroup = (function () {
    function KoGroup() {
        this.CourseId = ko.observable();
        this.Id = ko.observable();
        this.Name = ko.observable();
        this.Owner = ko.observable();
        this.OwnerId = ko.observable();
    }
    return KoGroup;
}());
var KoDemonstrator = (function () {
    function KoDemonstrator(name, id) {
        this.Id = ko.observable();
        this.Name = ko.observable();
        if (name && id) {
            this.Id(id);
            this.Name(name);
        }
    }
    return KoDemonstrator;
}());
//# sourceMappingURL=TableKO.js.map