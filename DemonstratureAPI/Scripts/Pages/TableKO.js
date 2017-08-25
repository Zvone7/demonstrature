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
        //---------------------------------OBSERVABLES------------------------------//
        this.Terms0 = ko.observableArray();
        this.Terms1 = ko.observableArray();
        this.Terms2 = ko.observableArray();
        this.Terms3 = ko.observableArray();
        this.TermsUnsorted = ko.observableArray();
        this.TermsSorted = ko.observableArray();
        this.TermsSortedByDate = ko.observableArray();
        this.YO = ko.observable();
        this.ActiveCourse = ko.observable();
        this.CoursesAll = ko.observableArray([]);
        this.CoursesActive = ko.observableArray([]);
        this.Studies = ko.observableArray([]);
        this.Demonstrators = ko.observableArray([]);
        this.disableLeft = ko.observable(true);
        this.disableRight = ko.observable(false);
        this.disableUp = ko.observable(true);
        this.disableDown = ko.observable(false);
        this.zeroValue = ko.observable(0);
        //--------------------------------------my types----------------------------------//
        this.RawTermPackage = new TermPackage();
        this.RawTermData = new Array();
        this.RawGroupData = new Array();
        this.RawUserData = new Array();
        this.AllDates = new Array();
        //--------------------------------------primitive----------------------------------//
        this.posOnX = 0; // 'where' the table is on X coordinate
        this.posOnY = 0; // 'where' the table is on Y coordinate
        this.numCol = 5;
        this.numRow = 4;
        this.bindingsApplied = false;
        this.link_main = "http://localhost:49977";
        this.link_settings = "/Settings/Settings";
        this.link_table = "/Table/Table";
        this.link_login = "/Login/Login";
        this.stack = function () {
            /*
    
            allocation
                allocateTermArrays
            getAllCourses
                populateSelectStudy
                    populateSelectCourse
    
            *selectCourseChange
                getTerms
                    getGroupsByCourseId
                        getNumberOfTermDates
                            getUsersByCourseId
                                convertRawTermData
            */
        };
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
            term().TermDate(self.defaultDate);
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
            self.TermsUnsorted([]);
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
        this.GetCourseId = function (name) {
            var self = _this;
            //console.log("Getting course Id from course name");
            if (self.CoursesActive().length == 0) {
                return -1;
            }
            for (var i = 0; i < self.CoursesActive().length; i++) {
                //console.log(self.CoursesActive()[i].Name());
                if (self.CoursesActive()[i].Name == name) {
                    return self.CoursesActive()[i].Id;
                }
            }
            return -1;
        };
        this.GetActiveCourse = function (name) {
            var self = _this;
            //console.log("Getting course Id from course name");
            if (self.CoursesActive().length == 0) {
                return null;
            }
            for (var i = 0; i < self.CoursesActive().length; i++) {
                //console.log(self.CoursesActive()[i].Name());
                if (self.CoursesActive()[i].Name == name) {
                    return self.CoursesActive()[i];
                }
            }
            return null;
        };
        //-------------------------------NAVIGATION------------------------------------------------//
        this.leftClicked = function () {
            var self = _this;
            if (self.disableLeft()) {
                self.handleWrongMove();
            }
            else if (self.posOnX == 0) {
                self.handleWrongMove();
            }
            else {
                self.posOnX--;
                self.getTerms();
            }
        };
        this.rightClicked = function () {
            var self = _this;
            if (self.disableRight()) {
                self.handleWrongMove();
            }
            else if (self.posOnX == self.numCol) {
                self.handleWrongMove();
            }
            else {
                self.posOnX++;
                self.getTerms();
            }
        };
        this.upClicked = function () {
            var self = _this;
            if (self.disableUp()) {
                self.handleWrongMove();
            }
            else if (self.posOnY == 0) {
                self.handleWrongMove();
            }
            else {
                self.posOnY--;
                self.getTerms();
            }
        };
        this.downClicked = function () {
            var self = _this;
            if (self.disableDown()) {
                self.handleWrongMove();
            }
            else if (self.posOnY == self.numRow) {
                self.handleWrongMove();
            }
            else {
                self.posOnY++;
                self.getTerms();
            }
        };
        this.handleWrongMove = function () {
            console.log("Wrong move!");
        };
        //-------------------------------SITE FLOW--------------------------------------------------//
        this.convertRawTermData = function () {
            var self = _this;
            //console.log("Converting raw term data", self.RawTermPackage);
            self.disableLeft(true);
            if (self.RawGroupData.length <= self.numCol) {
                self.disableRight(true);
            }
            //self.disableUp(true);
            //self.disableDown(true);
            self.Terms0(self.convertRowOfTerms(self.RawTermPackage.row0, self.Terms0(), 0));
            self.Terms1(self.convertRowOfTerms(self.RawTermPackage.row1, self.Terms1(), 1));
            self.Terms2(self.convertRowOfTerms(self.RawTermPackage.row2, self.Terms2(), 2));
            self.Terms3(self.convertRowOfTerms(self.RawTermPackage.row3, self.Terms3(), 3));
            self.disableLeft(self.RawTermPackage.disableLeft);
            self.disableRight(self.RawTermPackage.disableRight);
            self.disableUp(self.RawTermPackage.disableUp);
            self.disableDown(self.RawTermPackage.disableDown);
        };
        this.convertRowOfTerms = function (oldRow, newRow, order) {
            var self = _this;
            //console.log("Converting row of terms, ", order, oldRow);
            //console.log("Converting row of terms, ", order);
            for (var i = 0; i < oldRow.length; i++) {
                var cell = new KoCell();
                var term = ko.observable(new KoTerm());
                //console.log("[", i, "]", oldRow[i]);
                //console.log("[", i, "] Id", oldRow[i].Id);
                term().Id = oldRow[i].Id;
                //console.log("[", i, "] TermDate", oldRow[i].TermDate);
                term().TermDate = oldRow[i].TermDate;
                //find course
                //console.log("[", i, "] CourseId", oldRow[i].CourseId);
                term().CourseId = oldRow[i].CourseId;
                term().Course = self.ActiveCourse;
                //find group
                //console.log("[", i, "]  GroupId", oldRow[i].GroupId);
                term().GroupId = oldRow[i].GroupId;
                for (var j = 0; j < self.RawGroupData.length; j++) {
                    if (self.RawGroupData[j].Id == term().GroupId) {
                        term().Group(new KoGroup());
                        term().Group().CourseId = self.RawGroupData[j].CourseId;
                        term().Group().Name = self.RawGroupData[j].Name;
                        term().Group().OwnerId == self.RawGroupData[j].OwnerId;
                        if (term().Group().OwnerId() == undefined) {
                            term().Group().OwnerId(0);
                        }
                        term().Group().Owner(new KoUser());
                        if (term().Group().OwnerId() == 0) {
                            //console.log("option one");
                            term().Group().Owner().Id(0);
                            term().Group().Owner().Name(self.defaultUserName);
                            term().Group().Owner().LastName(self.defaultUserLastName);
                            term().Group().Owner().Username(self.defaultUserUsername);
                            term().Group().Owner().Role(self.defaultUserRole);
                            continue;
                        }
                        else {
                            //console.log("option two");
                            for (var k = 0; k < self.RawUserData.length; k++) {
                                if (term().Group().OwnerId() == k) {
                                    term().Group().Owner().Id = self.RawUserData[k].Id;
                                    term().Group().Owner().Name = self.RawUserData[k].Name;
                                    term().Group().Owner().LastName = self.RawUserData[k].LastName;
                                    term().Group().Owner().Username = self.RawUserData[k].Username;
                                    term().Group().Owner().Role = self.RawUserData[k].Role;
                                }
                            }
                        }
                    }
                }
                //find user
                //console.log("[", i, "] UserId", oldRow[i].UserId);
                term().UserId = oldRow[i].UserId;
                if (oldRow[i].UserId == 0) {
                    //console.log("It's a blank, cowboy!");
                    term().User(new KoUser());
                    if (term().User().Id() == 0) {
                        term().User().Id(0);
                        term().User().Name(self.defaultUserName);
                        term().User().LastName(self.defaultUserLastName);
                        term().User().Username(self.defaultUserUsername);
                        term().User().Role(self.defaultUserRole);
                        continue;
                    }
                }
                else {
                    //console.log("It's not-a-blank, cowboy!");
                    for (var j = 0; j < self.RawUserData.length; j++) {
                        //if (self.RawUserData[i] == null) {
                        //    console.log("this be null");
                        //}
                        //else if (term() == null) {
                        //    console.log("that be null");
                        //}
                        //console.log("comparing user with userId ", oldRow[i].UserId, " with ", self.RawUserData[j]);
                        if (self.RawUserData[j].Id == term().UserId) {
                            term().User(new KoUser());
                            term().User().Username == self.RawUserData[j].Username;
                            term().User().Name = self.RawUserData[j].Name;
                            term().User().LastName = self.RawUserData[j].LastName;
                            term().User().Role = self.RawUserData[j].Role;
                        }
                    }
                }
                //console.log("[", i, "] ", newRow[i]);
                newRow[i].Term = term;
                newRow[i].ButtonSkipState(false);
                newRow[i].ButtonTakeState(false);
                newRow[i].CellState(0);
                newRow[i].x(i);
                newRow[i].y(order);
            }
            //console.log("converted:", newRow);
            return newRow;
        };
        //-------------------------------REQUESTS---------------------------------------------------//
        this.getTerms = function () {
            var self = _this;
            var courseId = self.ActiveCourse().Id;
            console.log("getting terms\nmoveX=", self.posOnX, "\nmoveY=", self.posOnY);
            var self = _this;
            var serviceURL = '/Term/ByCourseId2';
            $.ajax({
                type: "GET",
                url: serviceURL + "?courseId=" + courseId + "&movedRight=" + self.posOnX + "&movedDown=" + self.posOnY,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data, status) {
                //console.log(data);
                self.RawTermPackage = data;
                //console.log("RawTermDataWithDate ", self.RawTermPackage);
                self.getGroupsByCourseId();
            }
            function errorFunc(status) {
                console.log('error', status);
            }
        };
        this.getAllCourses = function () {
            //console.log("getting All Courses");
            var self = _this;
            var serviceURL = '/Course/All';
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
        this.getGroupsByCourseId = function () {
            //console.log("getting groups for", courseId);
            var self = _this;
            var courseId = self.ActiveCourse().Id;
            var serviceURL = '/Group/ByCourseId';
            $.ajax({
                type: "GET",
                url: serviceURL + "?courseId=" + courseId,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data, status) {
                self.RawGroupData = data;
                //console.log("RawGroupData:", self.RawGroupData);
                self.getNumberOfTermDates();
            }
            function errorFunc(data) {
                console.log('error getting data about all groups for course with id', courseId, "\nreason:\n", data);
            }
        };
        this.getNumberOfTermDates = function () {
            //console.log("getting number of terms by course Id");
            var self = _this;
            var courseId = self.ActiveCourse().Id;
            var serviceURL = '/Term/NumberOfTermDates';
            $.ajax({
                type: "GET",
                url: serviceURL + "?courseId=" + courseId,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: successFunc,
                error: errorFunc
            });
            function successFunc(numberOfDates, status) {
                self.disableUp(true);
                if (numberOfDates <= self.numRow) {
                    self.disableDown(true);
                }
                self.getUsersByCourseId();
            }
            function errorFunc(data) {
                console.log('error getting data number of term dates course with id', courseId);
            }
        };
        this.getUsersByCourseId = function () {
            //console.log("getting users by course Id");
            var self = _this;
            var courseId = self.ActiveCourse().Id;
            var serviceURL = '/User/ByCourseId';
            $.ajax({
                type: "GET",
                url: serviceURL + "?courseId=" + courseId,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data, status) {
                self.RawUserData = data;
                //console.log("Raw User Data", self.RawUserData);
                self.convertRawTermData();
            }
            function errorFunc(data) {
                console.log('error getting data about all groups for course with id', courseId, "\nreason:\n", data);
            }
        };
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
        //-------------------------------HELPERS---------------------------------------------------//
        this.dateToString = function (dateObj) {
            try {
                var dateString = dateObj.toString();
                var date = dateString.split('.')[0];
                var month = dateString.split('.')[1];
                var fYear = dateString.split('.')[2];
                var dateString2 = date + "." + month + "." + fYear + ".";
                return dateString2;
            }
            catch (err) {
                console.log("Error date object to string - ", err);
                return null;
            }
        };
        this.dateObjToString = function (dateObj) {
            try {
                var dateString = dateObj.toString();
                var date = dateObj.getDate();
                var month = dateObj.getMonth() + 1;
                var fYear = dateObj.getFullYear();
                var dateString2 = date + "." + month + "." + fYear + ".";
                return dateString2;
            }
            catch (err) {
                console.log("Error date object to string - ", err);
                return null;
            }
        };
        this.stringToDate = function (dateString) {
            try {
                var date = new Date(parseInt(dateString.split('.')[2]), parseInt(dateString.split('.')[1]) - 1, parseInt(dateString.split('.')[0]));
                return date;
            }
            catch (err) {
                console.log("Error parsing string to Date - ", err);
                return null;
            }
        };
        this.test = function () {
            var self = _this;
            var courseId = 2;
            var movedRight = 0;
            var movedDown = 0;
            console.log("getting Courses by courseId ", courseId);
            var self = _this;
            var serviceURL = '/Term/ByCourseId2';
            $.ajax({
                type: "GET",
                url: serviceURL + "?courseId=" + courseId + "&movedRight=" + movedRight + "&movedDown=" + movedDown,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data, status) {
                console.log(data);
            }
            function errorFunc() {
                alert('error');
            }
        };
        var self = this;
        $(document).ready(function () {
            $('select').on("change", function () {
                if (this.id == "selectStudy") {
                    var value = $("#selectStudy option:selected").text();
                    self.populateSelectCourse(value);
                }
                else if (this.id == "selectCourse") {
                    var value = $("#selectCourse option:selected").text();
                    var courseId = self.GetCourseId(value);
                    self.ActiveCourse(self.GetActiveCourse(value));
                    //console.log("selectCourse changed, ", self.ActiveCourse());
                    //self.allocateTermsArrays();
                    self.posOnX = 0;
                    self.posOnY = 0;
                    //self.getRawData(value);
                    self.getTerms();
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
        });
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
        this.TermDate = ko.observable();
        //constructor(term?: any) {
        //    if (term) {
        //        this.Id = term.Id;
        //        this.CourseId = term.CourseId;
        //        this.Course = term.Course;
        //        this.UserId = term.Id;
        //        this.User = term.User;
        //        this.GroupId = term.GroupId;
        //        this.Group = term.Group;
        //        this.TermDate = term.TermDate;
        //    }
        //}
    }
    return KoTerm;
}());
var RawTerm = (function () {
    //constructor(term?: any) {
    //    if (term) {
    //        this.Id = term.Id;
    //        this.CourseId = term.CourseId;
    //        this.Course = term.Course;
    //        this.UserId = term.Id;
    //        this.User = term.User;
    //        this.GroupId = term.GroupId;
    //        this.Group = term.Group;
    //        this.TermDate = term.TermDate;
    //    }
    //}
    function RawTerm() {
        this.TermDate = new Date();
    }
    return RawTerm;
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
        //constructor(myUser?: KoUser) {
        //    if (myUser) {
        //        this.Id = myUser.Id;
        //        this.Username = myUser.Username;
        //        this.Name = myUser.Name;
        //        this.LastName = myUser.LastName;
        //        this.Role = myUser.Role;
        //    }
        //}
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
        //constructor(group?: KoGroup) {
        //    if (group) {
        //        this.CourseId = group.CourseId;
        //        this.Id = group.Id;
        //        this.Name = group.Name;
        //        this.Owner = group.Owner;
        //        this.OwnerId = group.OwnerId;
        //    }
        //}
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
var TermPackage = (function () {
    function TermPackage() {
        this.row0 = Array();
        this.row1 = Array();
        this.row2 = Array();
        this.row3 = Array();
        this.row0 = [];
        this.row1 = [];
        this.row2 = [];
        this.row3 = [];
        this.disableLeft = false;
        this.disableRight = false;
        this.disableUp = false;
        this.disableDown = false;
    }
    return TermPackage;
}());
//# sourceMappingURL=TableKO.js.map