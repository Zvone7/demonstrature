$(document).ready(function () {
    var tableVM = new TableVM();
    tableVM.Allocation();
    tableVM.getAllCourses();
    ko.applyBindings(tableVM);
});
var TableVM = (function () {
    //------------------------------------FUNCTIONS------------------------------------//
    function TableVM() {
        var _this = this;
        //---------------------------------OBSERVABLES------------------------------//
        //public Terms0 = ko.observableArray<CellM_T>();
        //public Terms1 = ko.observableArray<CellM_T>();
        //public Terms2 = ko.observableArray<CellM_T>();
        //public Terms3 = ko.observableArray<CellM_T>();
        //public allTerms = ko.observableArray<CellM_T[][]>();
        //public Users = ko.observableArray<UserM_T>();
        this.YO = ko.observable();
        this.CoursesAll = ko.observableArray([]);
        this.CoursesActive = ko.observableArray([]);
        this.Studies = ko.observableArray([]);
        this.disableLeft = ko.observable(false);
        this.disableRight = ko.observable(true);
        this.disableUp = ko.observable(false);
        this.disableDown = ko.observable(true);
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
        this.Allocation = function () {
            var self = _this;
            var study = ko.observable(new KoStudy());
            study().Name("dummy study");
            study().Id(1);
            self.Studies([]);
            self.Studies().push(study());
            var course = ko.observable(new KoCourse());
            course().Id(1);
            course().Name("dummy course");
            course().Study("");
            self.CoursesActive([]);
            self.CoursesActive().push(course());
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
                loginCheck
                    getAllCourses
                        populateSelectStudy
                            populateSelectCourse
                                updateValuesAfterSelect
                                    getTermsByCourseId
                                        getGroupsByCourseId
                                            getUsersByCourseId
                                                updateSelectUser
                                                updateGroupData
                                                createFullTermData
                                                    fillAllTerms
                                                        createTermTable
                                                            updateGroupWebData
                                                            updateWebData
                                                            setInitialNavigation
                    setInitialTermValues
                        
            */
        }
    }
    return TableVM;
}());
var KoTermM = (function () {
    function KoTermM(t) {
        this.Id = ko.observable();
        this.CourseId = ko.observable();
        this.Course = ko.observable();
        this.UserId = ko.observable();
        this.UserPerson = ko.observable();
        this.GroupId = ko.observable();
        this.Group = ko.observable();
        this.TermDate = ko.observable();
        this.Id = t.Id;
        this.CourseId = t.CourseId;
        this.Course = t.Course;
        this.UserId = t.Id;
        this.UserPerson = t.UserPerson;
        this.GroupId = t.GroupId;
        this.Group = t.Group;
        this.TermDate = t.TermDate;
    }
    return KoTermM;
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
    function KoUser(myUser) {
        if (myUser) {
            this.Id = myUser.Id;
            this.Username = myUser.Username;
            this.Name = myUser.Name;
            this.LastName = myUser.LastName;
            this.Role = myUser.Role;
        }
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
    function KoGroup(group) {
        if (group) {
            this.Id = group.Id;
            this.Name = group.Name;
            this.OwnerId = group.OwnerId;
            this.CourseId = group.CourseId;
            this.UserPerson = group.UserPerson;
        }
    }
    return KoGroup;
}());
