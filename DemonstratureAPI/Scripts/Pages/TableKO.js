//import { Requests } from "../helpers/CustomRequests"
//import { KoTestClass } from "../helpers/DemonstratureCustomClasses"
//import KoTestClass = require("../helpers/DemonstratureCustomClasses");
$(document).ready(() => {
    var tableVM = new TableVM();
    tableVM.allocation();
    tableVM.getAllCourses();
    ko.applyBindings(tableVM);
    //require(['jquery-notify'],
    //    function ($) {
    //        console.log("loaded app.ts");
    //        class TestVM {
    //            //public TestVariable: number = ko.observable<number>(0);
    //            constructor() {
    //                var self = this;
    //                $(document).ready(function () {
    //                    $("#test").click(function () {
    //                        console.log("test 1");
    //                        $.notify("Hello Box");
    //                        //self.TestVariable();
    //                    });
    //                });
    //            }
    //        }
    //        var testVM: TestVM = new TestVM();
    //        //ko.applyBindings(testVM);
    //    }
    //)
});
class TableVM {
    //------------------------------------FUNCTIONS------------------------------------//
    constructor() {
        this.cellState = ko.observable(0);
        //----------------------------------default values------------------------------//
        this.defaultTextButtonSkip = defaultTextButtonSkip;
        this.defaultTextButtonTake = defaultTextButtonTake;
        this.defaultCourseName = defaultCourseName;
        this.defaultDate = defaultDate;
        this.defaultGroupName = defaultGroupName;
        this.defaultId = defaultId;
        this.defaultStudyName = defaultStudyName;
        this.defaultUserLastName = defaultUserLastName;
        this.defaultUserName = defaultUserName;
        this.defaultUserRole = defaultUserRole;
        this.defaultUserUsername = defaultUserUsername;
        this.messageNoDataAvailable = "Nema dostupnih podataka";
        this.messageErrorFreeingTerm = "Pogreska pri oslobadjanju termina!";
        this.messageErrorReservingTerm = "Pogreska pri uzimanju termina!";
        this.messageErrorGeneral = "Pogreska!";
        this.messageSuccessFreeingTerm = "Termin uspjesno oslobodjen!";
        this.messageSuccessReservingTerm = "Termin uspjesno rezerviran za korisnika: ";
        this.messageSuccessGeneral = "Izvrseno!";
        //---------------------------------OBSERVABLES------------------------------//
        this.Terms0 = ko.observableArray();
        this.Terms1 = ko.observableArray();
        this.Terms2 = ko.observableArray();
        this.Terms3 = ko.observableArray();
        this.dummyTerm = ko.observable();
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
        //public Requests = new Requests();
        //--------------------------------------primitive----------------------------------//
        this.posOnX = 0; // 'where' the table is on X coordinate
        this.posOnY = 0; // 'where' the table is on Y coordinate
        this.numCol = 5;
        this.numRow = 4;
        this.numOfDates = 0;
        this.bindingsApplied = false;
        this.link_main = "http://localhost:49977";
        this.link_settings = "/Settings/Settings";
        this.link_table = "/Table/Table";
        this.link_login = "/Login/Login";
        this.stack = () => {
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
        this.allocation = () => {
            var self = this;
            //console.log("allocation");
            var study = ko.observable(new KoStudy());
            study().Name(self.defaultStudyName);
            study().Id = self.defaultId;
            self.Studies([]);
            self.Studies().push(study());
            var course = ko.observable(new KoCourse());
            course().Id = self.defaultId;
            course().Name(self.defaultCourseName);
            course().Study(self.defaultStudyName);
            self.CoursesActive([]);
            self.CoursesActive().push(course());
            var demonstrator = ko.observable(new KoDemonstrator(self.defaultUserName, self.defaultId));
            self.Demonstrators([]);
            self.Demonstrators().push(demonstrator());
            var user = ko.observable(new KoUser());
            user().Id = 0;
            user().LastName(self.defaultUserLastName);
            user().Name(self.defaultUserName);
            user().Role(self.defaultUserRole);
            user().Username(self.defaultUserUsername);
            var suggestedUser = ko.observable(new KoUser());
            suggestedUser().Id = 0;
            suggestedUser().LastName(self.defaultUserLastName);
            suggestedUser().Name(self.defaultUserName);
            suggestedUser().Role(self.defaultUserRole);
            suggestedUser().Username(self.defaultUserUsername);
            var group = ko.observable(new KoGroup());
            group().CourseId = self.defaultId;
            group().Id = self.defaultId;
            group().Name(self.defaultGroupName);
            group().OwnerId = self.defaultId;
            group().Owner = user;
            self.dummyTerm = ko.observable(new KoTerm());
            self.dummyTerm().Course = course;
            self.dummyTerm().CourseId = course().Id;
            self.dummyTerm().User = user;
            self.dummyTerm().UserId = user().Id;
            self.dummyTerm().Group = group;
            self.dummyTerm().GroupId = group().Id;
            self.dummyTerm().Id = 0;
            self.dummyTerm().TermDate(self.defaultDate);
            self.dummyTerm().SuggestedUser = suggestedUser;
            self.dummyTerm().SuggestedUserId(suggestedUser().Id);
            //allocation for Terms arrays
            self.allocateTermsArrays(self.dummyTerm);
        };
        this.allocateTermsArrays = (term) => {
            var self = this;
            self.Terms0([]);
            self.Terms1([]);
            self.Terms2([]);
            self.Terms3([]);
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 5; j++) {
                    var cell = ko.observable(new KoCell());
                    cell().ButtonSkipState(false);
                    cell().ButtonTakeState(false);
                    cell().CellState(0);
                    cell().DemoPickerState(false);
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
        this.populateSelectStudy = () => {
            //console.log("populating select study");
            var self = this;
            //console.log("Studies:", self.Studies());
            self.Studies([]);
            var studyId = 1;
            for (var i = 0; i < self.CoursesAll().length; i++) {
                if (self.Studies().length == 0) {
                    var study = ko.observable(new KoStudy());
                    study().Name = self.CoursesAll()[i].Study;
                    study().Id = studyId;
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
                        study().Id = studyId;
                        self.Studies.push(study());
                        studyId++;
                    }
                }
            }
            self.populateSelectCourse(self.Studies()[0].Name);
        };
        this.populateSelectCourse = (value) => {
            var self = this;
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
        this.GetCourseId = (name) => {
            var self = this;
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
        this.GetActiveCourse = (courseId) => {
            var self = this;
            for (var i = 0; i < self.CoursesActive().length; i++) {
                //console.log(self.CoursesActive()[i].Name());
                if (self.CoursesActive()[i].Id == courseId) {
                    return self.CoursesActive()[i];
                }
            }
            return null;
        };
        this.getUserNameById = (id) => {
            var self = this;
            for (var i = 0; i < self.RawUserData.length; i++) {
                if (self.RawUserData[i].Id == id) {
                    return self.RawUserData[i].Name + "" + self.RawUserData[i].LastName;
                }
            }
        };
        this.tryReserveTerm = (suggestedUserId_, i, j) => {
            //console.log("try reserve");
            var self = this;
            try {
                var suggestedUserId = 0;
                suggestedUserId = parseInt(suggestedUserId_);
                if (isNaN(suggestedUserId)) {
                    suggestedUserId = -1;
                }
                //console.log(suggestedUserId);
                //console.log(self.Demonstrators());
                if (suggestedUserId > 0) {
                    var name;
                    for (var k = 0; k < self.Demonstrators().length; k++) {
                        if (self.Demonstrators()[k].Id == suggestedUserId) {
                            name = self.Demonstrators()[k].Name();
                        }
                    }
                    confirm("Sigurno želite prepustiti vaš termin " + name + " ?");
                }
                var term = self.FindTermByPosition(i, j);
                if (term != null) {
                    self.reserveTerm(term.Id, suggestedUserId);
                }
                else {
                    // TO DO notification
                    self.notify(self.messageErrorReservingTerm, -1);
                }
            }
            catch (err) {
                //console.log("TO DO notification", err);
                self.notify(self.messageErrorReservingTerm + err, -1);
            }
        };
        this.tryFreeTerm = (i, j) => {
            //console.log("try free");
            var self = this;
            try {
                var term = self.FindTermByPosition(i, j);
                if (term != null) {
                    self.freeTerm(term.Id);
                }
                else {
                    // TO DO notification
                    self.notify(self.messageErrorFreeingTerm, -1);
                }
            }
            catch (err) {
                //console.log("TO DO notification", err);
                self.notify(self.messageErrorFreeingTerm + err, -1);
            }
        };
        this.FindTermByPosition = (i_, j_) => {
            //console.log("findtermbyposition", i_, j_);
            var self = this;
            var i = parseInt(i_);
            var j = parseInt(j_);
            if (i < 0 || i > 3 || j < 0 || j > 4) {
                return null;
            }
            var cells;
            switch (i) {
                case 0:
                    cells = self.Terms0;
                    break;
                case 1:
                    cells = self.Terms1;
                    break;
                case 2:
                    cells = self.Terms2;
                    break;
                case 3:
                    cells = self.Terms3;
                    break;
                default:
                    break;
            }
            var term = cells()[j].Term();
            return term;
        };
        //-------------------------------NAVIGATION------------------------------------------------//
        this.leftClicked = () => {
            var self = this;
            if (self.disableLeft()) {
                self.handleWrongMove();
            }
            else if (self.posOnX == 0) {
                self.handleWrongMove();
            }
            else {
                self.posOnX--;
                self.getTerms();
                //self.Requests.getTerms(self.ActiveCourse().Id, self.posOnX, self.posOnY);
            }
        };
        this.rightClicked = () => {
            var self = this;
            if (self.disableRight()) {
                self.handleWrongMove();
            }
            else if (self.posOnX == self.numCol) {
                self.handleWrongMove();
            }
            else {
                self.posOnX++;
                self.getTerms();
                //self.Requests.getTerms(self.ActiveCourse().Id, self.posOnX, self.posOnY);
            }
        };
        this.upClicked = () => {
            var self = this;
            if (self.disableUp()) {
                self.handleWrongMove();
            }
            else if (self.posOnY == 0) {
                self.handleWrongMove();
            }
            else {
                self.posOnY--;
                self.getTerms();
                //self.Requests.getTerms(self.ActiveCourse().Id, self.posOnX, self.posOnY);
            }
        };
        this.downClicked = () => {
            var self = this;
            //console.log("arrowDown:", self.disableDown());
            if (self.disableDown()) {
                self.handleWrongMove();
            }
            else if (self.posOnY == self.numRow + self.numOfDates) {
                self.handleWrongMove();
            }
            else {
                self.posOnY++;
                self.getTerms();
                //self.Requests.getTerms(self.ActiveCourse().Id, self.posOnX, self.posOnY);
            }
        };
        this.handleWrongMove = () => {
            console.log("Wrong move!");
        };
        //-------------------------------SITE FLOW--------------------------------------------------//
        this.convertRawTermData = () => {
            var self = this;
            //console.log("Converting raw term data", self.RawTermPackage);
            self.disableLeft(true);
            if (self.RawGroupData.length <= self.numCol) {
                self.disableRight(true);
            }
            //arrow up/down are being disabled in getNumberOfTermDates.succesFunction
            self.convertDemonstratorsData();
            self.Terms0(self.convertRowOfTerms(self.RawTermPackage.row0, self.Terms0(), self.RawTermPackage.row0Dt, 0));
            //console.log("0 finished", self.Terms0());
            self.Terms1(self.convertRowOfTerms(self.RawTermPackage.row1, self.Terms1(), self.RawTermPackage.row1Dt, 1));
            //console.log("1 finished");
            self.Terms2(self.convertRowOfTerms(self.RawTermPackage.row2, self.Terms2(), self.RawTermPackage.row2Dt, 2));
            //console.log("2 finished");
            self.Terms3(self.convertRowOfTerms(self.RawTermPackage.row3, self.Terms3(), self.RawTermPackage.row3Dt, 3));
            //console.log("3 finished");
            self.disableLeft(self.RawTermPackage.disableLeft);
            self.disableRight(self.RawTermPackage.disableRight);
            self.disableUp(self.RawTermPackage.disableUp);
            self.disableDown(self.RawTermPackage.disableDown);
        };
        this.convertRowOfTerms = (oldRow, newRow, termDate, order) => {
            //console.log("convertRowOfTerms_");
            var self = this;
            for (var i = 0; i < oldRow.length; i++) {
                var term = ko.observable(new KoTerm());
                var validTerm = false;
                // term ID
                validTerm = true;
                if (oldRow[i].Id == 0) {
                    validTerm = false;
                    term().Id = 0;
                }
                else {
                    term().Id = oldRow[i].Id;
                }
                // term date
                term().TermDate = oldRow[i].TermDate;
                // term COURSE
                term().CourseId = self.ActiveCourse().Id;
                term().Course = self.ActiveCourse;
                // term GROUP
                if (validTerm) {
                    term().Group(new KoGroup());
                    term().GroupId = oldRow[i].GroupId;
                    for (var j = 0; j < self.RawGroupData.length; j++) {
                        if (term().GroupId == self.RawGroupData[j].Id) {
                            term().Group().Id = self.RawGroupData[j].Id;
                            term().Group().Name = self.RawGroupData[j].Name;
                            term().Group().OwnerId = self.RawGroupData[j].OwnerId;
                            term().Group().CourseId = self.RawGroupData[j].CourseId;
                        }
                    }
                }
                else {
                    term().Group().Id = 0;
                    term().Group().Name(self.defaultGroupName);
                    term().Group().CourseId = 0;
                    term().Group().OwnerId = 0;
                }
                // term User
                // term Owner
                term().User(new KoUser());
                term().Group().Owner(new KoUser());
                if (validTerm) {
                    term().UserId = oldRow[i].UserId;
                    for (var j = 0; j < self.RawUserData.length; j++) {
                        // user
                        if (term().UserId == self.RawUserData[j].Id) {
                            term().User().Id = self.RawUserData[j].Id;
                            term().User().Username = self.RawUserData[j].Username;
                            term().User().Name = self.RawUserData[j].Name;
                            term().User().LastName = self.RawUserData[j].LastName;
                            term().User().Role = self.RawUserData[j].Role;
                        }
                        // owner
                        if (term().Group().OwnerId == self.RawUserData[j].Id) {
                            term().Group().Owner().Id = self.RawUserData[j].Id;
                            term().Group().Owner().Username = self.RawUserData[j].Username;
                            term().Group().Owner().Name = self.RawUserData[j].Name;
                            term().Group().Owner().LastName = self.RawUserData[j].LastName;
                            term().Group().Owner().Role = self.RawUserData[j].Role;
                        }
                    }
                }
                else {
                    term().User().Username(this.defaultUserUsername);
                    term().User().Name(this.defaultUserName);
                    term().User().LastName(this.defaultUserLastName);
                    term().User().Role(this.defaultUserRole);
                    term().Group().Owner().Username(this.defaultUserUsername);
                    term().Group().Owner().Name(this.defaultUserName);
                    term().Group().Owner().LastName(this.defaultUserLastName);
                    term().Group().Owner().Role(this.defaultUserRole);
                }
                newRow[i].Term = term;
                newRow[i].ButtonSkipState(oldRow[i].ButtonSkipState);
                newRow[i].ButtonTakeState(oldRow[i].ButtonTakeState);
                newRow[i].CellState(oldRow[i].CellState);
                newRow[i].DemoPickerState(oldRow[i].DemoPickerState);
                newRow[i].x(i);
                newRow[i].y(order);
                newRow[i].Term().TermDate = self.dateToString(newRow[i].Term().TermDate);
                //console.log("[", i, "] ", newRow[i]);
            }
            return newRow;
        };
        this.convertDemonstratorsData = () => {
            var self = this;
            //self.Demonstrators = ko.observableArray<KoDemonstrator>();
            //self.Demonstrators.removeAll();
            self.Demonstrators([]);
            try {
                if (self.RawUserData.length == 0) {
                    return;
                }
                for (var i = 0; i < self.RawUserData.length; i++) {
                    //var demo = new KoDemonstrator(self.RawUserData[i].LastName + " " + self.RawUserData[i].Name, self.RawUserData[i].Id());
                    var demo = new KoDemonstrator();
                    demo.Id = self.RawUserData[i].Id;
                    demo.Name(self.RawUserData[i].LastName + " " + self.RawUserData[i].Name);
                    self.Demonstrators.push(demo);
                }
                //console.log(self.Demonstrators());
            }
            catch (e) {
                console.log("convertDemonstratorsData exception:", e);
            }
        };
        //-------------------------------REQUESTS - GET----------------------------------------------//
        this.getTerms = () => {
            var self = this;
            var courseId = self.ActiveCourse().Id;
            //console.log("getting terms: ", courseId, "\nmoveX=", self.posOnX, "\nmoveY=", self.posOnY);
            var self = this;
            var serviceURL = '/Term/ByCourseIdNavigation';
            $.ajax({
                type: "GET",
                url: serviceURL + "?courseId=" + courseId + "&movedRight=" + self.posOnX + "&movedDown=" + self.posOnY,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data, status) {
                    //console.log(data);
                    self.RawTermPackage = data;
                    self.getGroupsByCourseId();
                },
                error: function (status) {
                    console.log('error getting Terms', status);
                }
            });
        };
        this.getAllCourses = () => {
            //console.log("getting All Courses");
            var self = this;
            var serviceURL = '/Course/Courses';
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
        this.getGroupsByCourseId = () => {
            //console.log("getting groups for", courseId);
            var self = this;
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
        this.getNumberOfTermDates = () => {
            //console.log("getting number of terms by course Id");
            var self = this;
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
            function successFunc(numOfDates, status) {
                self.disableUp(true);
                //console.log("numberOfDates", numOfDates);
                if (numOfDates <= self.numRow) {
                    self.disableDown(true);
                }
                self.numOfDates = numOfDates;
                self.getUsersByCourseId();
            }
            function errorFunc(data) {
                console.log('error getting data number of term dates course with id', courseId);
            }
        };
        this.getUsersByCourseId = () => {
            //console.log("getting users by course Id");
            var self = this;
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
        this.LogOut = () => {
            var self = this;
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
        this.reserveTerm = (termId, suggestedUserId) => {
            //console.log("freeing term");
            var self = this;
            //var userId
            var serviceURL = '/Term/ReserveTerm';
            $.ajax({
                type: "GET",
                url: serviceURL + "?termId=" + termId + "&suggestedUserId=" + suggestedUserId,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data, status) {
                if (data) {
                    self.getTerms();
                    //self.Requests.getTerms(self.ActiveCourse().Id, self.posOnX, self.posOnY);
                    self.notify(self.messageSuccessReservingTerm + self.getUserNameById(suggestedUserId), 1);
                }
            }
            function errorFunc(data) {
                //console.log('error reserving term with id', termId, "\nreason:\n", data);
                self.notify(self.messageErrorReservingTerm, -1);
            }
        };
        this.freeTerm = (termId) => {
            //console.log("freeing term");
            var self = this;
            //var userId
            var serviceURL = '/Term/FreeTerm';
            $.ajax({
                type: "GET",
                url: serviceURL + "?termId=" + termId,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data, status) {
                if (data) {
                    self.getTerms();
                    //self.Requests.getTerms(courseId, self.posOnX, self.posOnY);
                    self.notify(self.messageSuccessFreeingTerm, 1);
                }
            }
            function errorFunc(data) {
                //console.log('error freeing term with id', termId, "\nreason:\n", data);
                self.notify(self.messageErrorFreeingTerm, -1);
            }
        };
        //-------------------------------REQUESTS - POST ------------------------------------------//
        //-------------------------------HELPERS---------------------------------------------------//
        this.dateToString = (dateObj) => {
            var self = this;
            var dateStringToReturn = self.messageNoDataAvailable;
            try {
                if (dateObj == null) {
                    throw "null";
                }
                var dateString = dateObj.toString();
                if (dateString.indexOf('A') == -1) {
                    var date = dateString.split('.')[0];
                    var month = dateString.split('.')[1];
                    var fYear = dateString.split('.')[2];
                    dateStringToReturn = date + "." + month + "." + fYear + ".";
                }
                else {
                    var date = dateString.split('/')[1];
                    var month = dateString.split('/')[0];
                    var fYear = dateString.split('/')[2].substring(0, 4);
                    dateStringToReturn = date + "." + month + "." + fYear + ".";
                }
            }
            catch (err) {
                //console.log("Error date object to string - ", err);
            }
            return dateStringToReturn;
        };
        this.dateObjToString = (dateObj) => {
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
        this.stringToDate = (dateString) => {
            try {
                var date = new Date(parseInt(dateString.split('.')[2]), parseInt(dateString.split('.')[1]) - 1, parseInt(dateString.split('.')[0]));
                return date;
            }
            catch (err) {
                console.log("Error parsing string to Date - ", err);
                return null;
            }
        };
        //-------------------------------NOTIFICATION WINDOW ---------------------------------------//
        this.notify = (message, state, timeout = 3000) => {
            var notificationWindow = $("#notificationWindow");
            console.log(message, state);
            switch (state) {
                // error
                case -1:
                    notificationWindow.css("visibility", "visible");
                    notificationWindow.css("background-color", "red");
                    notificationWindow.css("color", "white");
                    notificationWindow.text(message);
                // message
                case 0:
                    notificationWindow.css("visibility", "visible");
                    notificationWindow.css("background-color", "yellow");
                    notificationWindow.css("color", "black");
                    notificationWindow.text(message);
                // succes
                case 1:
                    notificationWindow.css("visibility", "visible");
                    notificationWindow.css("background-color", "green");
                    notificationWindow.css("color", "white");
                    notificationWindow.text(message);
                default:
                    break;
            }
            setTimeout(function () {
                notificationWindow.css("visibility", "hidden");
            }, timeout);
        };
        this.test = () => {
            var self = this;
            console.log("testing" + ".");
            //var x = KoTestClass; console.log(x);
            //$.notify("helloworld");
            //self.notify("test", 0);
            //var a = KoTestClass;
            //console.log(a);
            //$("#datepicker").datepicker();
        };
        var self = this;
        $(document).ready(function () {
            $('select').on("change", function () {
                if (this.id == "selectStudy") {
                    var value = $("#selectStudy option:selected").text();
                    self.populateSelectCourse(value);
                }
                else if (this.id == "selectCourse") {
                    var courseId = this.value;
                    self.ActiveCourse(self.GetActiveCourse(courseId));
                    self.posOnX = 0;
                    self.posOnY = 0;
                    self.getTerms();
                    //self.Requests.getTerms(courseId, self.posOnX, self.posOnY);
                }
                else if (this.id.lastIndexOf("search") != '-1') {
                    var i = parseInt(this.id.substring(6, 7));
                    var j = parseInt(this.id.substring(7, 8));
                    var suggestedUserId = this.value;
                    if (suggestedUserId != "") {
                        self.tryReserveTerm(suggestedUserId, i, j);
                    }
                }
            });
            //$('select').on("click","change", function () {
            //});
            // terms
            $('button').on("click", function () {
                if (this.id.lastIndexOf("TakeTerm") != '-1') {
                    var i = parseInt(this.id.substring(14, 15));
                    var j = parseInt(this.id.substring(15, 16));
                    self.tryReserveTerm(0, i, j);
                }
                else if (this.id.lastIndexOf("SkipTerm") != '-1') {
                    var i = parseInt(this.id.substring(14, 15));
                    var j = parseInt(this.id.substring(15, 16));
                    self.tryFreeTerm(i, j);
                }
            });
            $('#logout').on("click", () => {
                self.LogOut();
            });
            $('#test').on("click", () => {
                self.test();
            });
        });
    }
}
//# sourceMappingURL=TableKO.js.map