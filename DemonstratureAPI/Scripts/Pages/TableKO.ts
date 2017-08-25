$(document).ready(() => {
    var tableVM: TableVM = new TableVM();
    tableVM.allocation();
    tableVM.getAllCourses();
    ko.applyBindings(tableVM);
});

class TableVM {
    //----------------------------------default values------------------------------//
    public defaultTextButtonSkip = "Preskoči termin";
    public defaultTextButtonTake = "Uzmi termin";
    public defaultCourseName = "Kolegij";
    public defaultDate = new Date().getDate() + "." + (new Date().getMonth() + 1) + "." + new Date().getFullYear() + ".";
    public defaultGroupName = "Grupa";
    public defaultId = 0;
    public defaultStudyName = "Smjer";
    public defaultUserLastName = "Prezime";
    public defaultUserName = "Ime";
    public defaultUserRole = "D";
    public defaultUserUsername = "iprezime";
    //---------------------------------OBSERVABLES------------------------------//
    public Terms0 = ko.observableArray<KoCell>();
    public Terms1 = ko.observableArray<KoCell>();
    public Terms2 = ko.observableArray<KoCell>();
    public Terms3 = ko.observableArray<KoCell>();
    public TermsUnsorted = ko.observableArray<KoTerm>();
    public TermsSorted = ko.observableArray<KoTerm[]>();
    public TermsSortedByDate = ko.observableArray<KoTerm[]>();
    public YO = ko.observable<string>();
    public ActiveCourse = ko.observable<KoCourse>();
    public CoursesAll = ko.observableArray<KoCourse>([]);
    public CoursesActive = ko.observableArray<KoCourse>([]);
    public Studies = ko.observableArray<KoStudy>([]);
    public Demonstrators = ko.observableArray<KoDemonstrator>([]);
    public disableLeft = ko.observable<boolean>(true);
    public disableRight = ko.observable<boolean>(false);
    public disableUp = ko.observable<boolean>(true);
    public disableDown = ko.observable<boolean>(false);
    public zeroValue = ko.observable<number>(0);

    //--------------------------------------my types----------------------------------//
    public RawTermPackage = new TermPackage();
    public RawTermData = new Array<KoTerm>();
    public RawGroupData = new Array<KoGroup>();
    public RawUserData = new Array<KoUser>();
    public AllDates = new Array<Date>();
    //--------------------------------------primitive----------------------------------//
    public posOnX: number = 0; // 'where' the table is on X coordinate
    public posOnY: number = 0; // 'where' the table is on Y coordinate
    public numCol: number = 5;
    public numRow: number = 4;
    public bindingsApplied = false;
    public link_main = "http://localhost:49977";
    public link_settings = "/Settings/Settings";
    public link_table = "/Table/Table";
    public link_login = "/Login/Login";


    //------------------------------------FUNCTIONS------------------------------------//
    constructor() {
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
            })
            //navigation

            $('#logout').on("click", () => {
                self.LogOut();
            });


            $('#test').on("click", () => {
                self.test();
            });

        });

    }
    public stack = () => {
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
    }

    public allocation = () => {
        var self = this;
        //console.log("allocation");

        var study = ko.observable<KoStudy>(new KoStudy());
        study().Name(self.defaultStudyName);
        study().Id(self.defaultId);
        self.Studies([]);
        self.Studies().push(study());

        var course = ko.observable<KoCourse>(new KoCourse());
        course().Id(self.defaultId);
        course().Name(self.defaultCourseName);
        course().Study(self.defaultStudyName);
        self.CoursesActive([]);
        self.CoursesActive().push(course());

        var demonstrator = ko.observable<KoDemonstrator>(new KoDemonstrator(self.defaultUserName, self.defaultId));
        self.Demonstrators([]);
        self.Demonstrators().push(demonstrator());

        var user = ko.observable<KoUser>(new KoUser());
        user().Id(0);
        user().LastName(self.defaultUserLastName);
        user().Name(self.defaultUserName);
        user().Role(self.defaultUserRole);
        user().Username(self.defaultUserUsername);

        var group = ko.observable<KoGroup>(new KoGroup());
        group().CourseId(self.defaultId);
        group().Id(self.defaultId);
        group().Name(self.defaultGroupName);
        group().OwnerId(self.defaultId);
        group().Owner = user;

        var term = ko.observable<KoTerm>(new KoTerm());
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

    }

    public allocateTermsArrays = (term: any) => {
        var self = this;
        self.Terms0([]);
        self.Terms1([]);
        self.Terms2([]);
        self.Terms3([]);
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 5; j++) {
                var cell = ko.observable<KoCell>(new KoCell());
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

    }

    public populateSelectStudy = () => {
        //console.log("populating select study");
        var self = this;
        //console.log("Studies:", self.Studies());
        self.Studies([]);
        var studyId = 1;
        for (var i = 0; i < self.CoursesAll().length; i++) {
            if (self.Studies().length == 0) {
                var study = ko.observable<KoStudy>(new KoStudy());
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
                    var study = ko.observable<KoStudy>(new KoStudy());
                    study().Name = self.CoursesAll()[i].Study;
                    study().Id(studyId);
                    self.Studies.push(study());
                    studyId++;
                }
            }
        }
        self.populateSelectCourse(self.Studies()[0].Name);
    }

    public populateSelectCourse = (value) => {
        var self = this;
        //console.log("populating select course for ", value);
        self.CoursesActive().length = 0;
        for (var i = 0; i < self.CoursesAll().length; i++) {
            //console.log(i.toString(), "\n", self.CoursesAll()[i].Name, "\n", value);
            if (self.CoursesAll()[i].Study == value) {
                var course = ko.observable<KoCourse>(new KoCourse());
                course().Id = self.CoursesAll()[i].Id;
                course().Name = self.CoursesAll()[i].Name;
                course().Study = self.CoursesAll()[i].Study;
                self.CoursesActive.push(course());
            }
        }
        //console.log(self.CoursesActive(), self.bindingsApplied);
    }

    public GetCourseId = (name) => {
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
    }

    public GetActiveCourse = (name) => {
        var self = this;
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
    }

    //-------------------------------NAVIGATION------------------------------------------------//
    public leftClicked = () => {
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
        }
    }

    public rightClicked = () => {
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
        }
    }

    public upClicked = () => {
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
        }
    }

    public downClicked = () => {
        var self = this;
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
    }

    public handleWrongMove = () => {
        console.log("Wrong move!");
    }

    //-------------------------------SITE FLOW--------------------------------------------------//

    public convertRawTermData = () => {
        var self = this;
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
    }

    public convertRowOfTerms = (oldRow: any, newRow: any, order: number) => {
        var self = this;
        //console.log("Converting row of terms, ", order, oldRow);
        //console.log("Converting row of terms, ", order);

        for (var i = 0; i < oldRow.length; i++) {
            var cell = new KoCell();
            var term = ko.observable<KoTerm>(new KoTerm());

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
    }

    //-------------------------------REQUESTS---------------------------------------------------//

    public getTerms = () => {
        var self = this;
        var courseId = self.ActiveCourse().Id;
        console.log("getting terms\nmoveX=", self.posOnX, "\nmoveY=", self.posOnY);
        var self = this;
        var serviceURL = '/Term/ByCourseId2';
        $.ajax({
            type: "GET",
            url: serviceURL + "?courseId=" + courseId + "&movedRight=" + self.posOnX + "&movedDown=" + self.posOnY,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data: TermPackage, status) {
            //console.log(data);
            self.RawTermPackage = data;
            //console.log("RawTermDataWithDate ", self.RawTermPackage);
            self.getGroupsByCourseId();
        }
        function errorFunc(status) {
            console.log('error', status);
        }
    }

    public getAllCourses = () => {
        //console.log("getting All Courses");
        var self = this;
        var serviceURL = '/Course/All';
        $.ajax({
            type: "GET",
            url: serviceURL,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data: KoCourse[], status) {
            //console.log(data);
            var study = ko.observable<KoStudy>(new KoStudy());
            study().Name("ja ne zelim raditi");
            study().Id(1);
            self.Studies().push(study());
            //console.log("_Studies:",self.Studies());
            for (var i = 0; i < data.length; i++) {
                var course = ko.observable<KoCourse>(new KoCourse());
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
    }

    public getGroupsByCourseId = () => {
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
        function successFunc(data: KoGroup[], status) {
            self.RawGroupData = data;
            //console.log("RawGroupData:", self.RawGroupData);
            self.getNumberOfTermDates();
        }
        function errorFunc(data) {
            console.log('error getting data about all groups for course with id', courseId, "\nreason:\n", data);
        }

    }

    public getNumberOfTermDates = () => {
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
    }

    public getUsersByCourseId = () => {
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
        function successFunc(data: KoUser[], status) {
            self.RawUserData = data;
            //console.log("Raw User Data", self.RawUserData);
            self.convertRawTermData();
        }
        function errorFunc(data) {
            console.log('error getting data about all groups for course with id', courseId, "\nreason:\n", data);
        }
    }

    public LogOut = () => {
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
    }

    //-------------------------------HELPERS---------------------------------------------------//

    public dateToString = (dateObj: Date) => {
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


    }

    public dateObjToString = (dateObj: Date) => {
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


    }

    public stringToDate = (dateString) => {
        try {
            var date = new Date(
                parseInt(dateString.split('.')[2]),
                parseInt(dateString.split('.')[1]) - 1,
                parseInt(dateString.split('.')[0])
            );
            return date;
        }
        catch (err) {
            console.log("Error parsing string to Date - ", err);
            return null;
        }
    }

    public test = () => {
        var self = this;
        var courseId = 2;
        var movedRight = 0;
        var movedDown = 0;
        console.log("getting Courses by courseId ", courseId);
        var self = this;
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
    }
}


class KoTerm {
    public Id = ko.observable<number>();
    public CourseId = ko.observable<number>();
    public Course = ko.observable<KoCourse>();
    public UserId = ko.observable<number>();
    public User = ko.observable<KoUser>();
    public GroupId = ko.observable<number>();
    public Group = ko.observable<KoGroup>();
    public TermDate = ko.observable<string>();
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
class RawTerm {
    public Id: number;
    public CourseId: number;
    public UserId: number;
    public GroupId: number;
    public TermDate: Date;
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
    constructor() {
        this.TermDate = new Date();
    }
}
class KoCell {
    public x = ko.observable<number>();
    public y = ko.observable<number>();
    public CellState = ko.observable<number>();
    public ButtonTakeState = ko.observable<boolean>();
    public ButtonSkipState = ko.observable<boolean>();
    public Term = ko.observable<KoTerm>();
}
class KoUser {
    public Id = ko.observable<number>();
    public Username = ko.observable<string>();
    public Name = ko.observable<string>();
    public LastName = ko.observable<string>();
    public Role = ko.observable<string>();
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
class KoStudy {
    public Id = ko.observable<number>();
    public Name = ko.observable<string>();
}
class KoCourse {
    public Id = ko.observable<number>();
    public Name = ko.observable<string>();
    public Study = ko.observable<string>();
}
class KoGroup {
    public CourseId = ko.observable<number>();
    public Id = ko.observable<number>();
    public Name = ko.observable<string>();
    public Owner = ko.observable<KoUser>();
    public OwnerId = ko.observable<number>();
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
class KoDemonstrator {
    public Id = ko.observable<number>();
    public Name = ko.observable<string>();
    constructor(name?: string, id?: number) {
        if (name && id) {
            this.Id(id);
            this.Name(name);
        }
    }
}
class TermPackage {
    public row0 = Array<KoTerm>();
    public row1 = Array<KoTerm>();
    public row2 = Array<KoTerm>();
    public row3 = Array<KoTerm>();
    public disableLeft;
    public disableRight;
    public disableUp;
    public disableDown;
    constructor() {
        this.row0 = [];
        this.row1 = [];
        this.row2 = [];
        this.row3 = [];
        this.disableLeft = false;
        this.disableRight = false;
        this.disableUp = false;
        this.disableDown = false;
    }
}