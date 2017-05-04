$(document).ready(() => {
    var tableVM: TableVM = new TableVM();
    tableVM.allocation();
    tableVM.getAllCourses();
    ko.applyBindings(tableVM);
});

// stao na sortiranju i dohvaćanju podataka
// razmišljaš o tome da ipak ide preko backenda
// jer je dosta logike na frontu

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
    public CoursesAll = ko.observableArray<KoCourse>([]);
    public CoursesActive = ko.observableArray<KoCourse>([]);
    public Studies = ko.observableArray<KoStudy>([]);
    public Demonstrators = ko.observableArray<KoDemonstrator>([]);
    public disableLeft = ko.observable<boolean>(false);
    public disableRight = ko.observable<boolean>(true);
    public disableUp = ko.observable<boolean>(false);
    public disableDown = ko.observable<boolean>(true);

    //--------------------------------------my types----------------------------------//
    public RawTermDataWithDate = new Array<RawTerm>();
    public RawTermData = new Array<KoTerm>();
    public RawGroupData = new Array<KoGroup>();
    public RawUserData = new Array<KoUser>();
    public AllDates = new Array<Date>();
    //--------------------------------------primitive----------------------------------//
    public moveX: number = 0;
    public moveY: number = 0;
    public posHor: number = 0;
    public posVer: number = 0;
    public numberOfGroups: number = 10;
    public numberOfTerms: number = 7;
    public bindingsApplied = false;
    public link_main = "http://localhost:49977";
    public link_settings = "/Settings/Settings";
    public link_table = "/Table/Table";
    public link_login = "/Login/Login";


    //------------------------------------FUNCTIONS------------------------------------//
    constructor() {
        var self = this;
        $(document).ready(function () {
            $('#test').on("click", function () {
                self.test;
            })

            $('select').on("change", function () {
                if (this.id == "selectStudy") {
                    var value = $("#selectStudy option:selected").text();
                    self.populateSelectCourse(value);
                }
                else if (this.id == "selectCourse") {
                    var value = $("#selectCourse option:selected").text();
                    //console.log("selectCourse changed, ", value);
                    //self.allocateTermsArrays();
                    self.posHor = 0;
                    self.posVer = 0;
                    self.getRawData(value);
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

            $('#arrowLeft').on("click", () => {
                //self.leftClicked();
            });
            $('#arrowRight').on("click", () => {
                //self.rightClicked();
            });
            $('#arrowUp').on("click", () => {
                //self.upClicked();
            });
            $('#arrowDown').on("click", () => {
                //self.downClicked();
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
            getRawData
                getTermsByCourseId
                    getUsersByCourseId
                        getGroupsByCourseId
                            convertRawTermData
                                sortTerms
                                    createDateArray
                                        updateTermArrays(0,0)
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


    //-------------------------------NAVIGATION------------------------------------------------//
    public leftClicked = () => {
        this.moveY++;
        if (this.moveX >= 0 && this.moveX + 4 <= this.numberOfTerms
            && this.moveY >= 0 && this.moveY + 5 <= this.numberOfGroups
        ) {
            //this.updateTermArrays(this.moveX, this.moveY);
            this.disableRight(false);
        }
        else {
            this.handleWrongMove();
            this.moveY--;
            this.disableLeft(true);
        }
        console.log(this.disableLeft());
    }

    public rightClicked = () => {
        this.moveY--;
        if (this.moveX >= 0 && this.moveX + 4 <= this.numberOfTerms
            && this.moveY >= 0 && this.moveY + 5 <= this.numberOfGroups
        ) {
            //this.updateTermArrays(this.moveX, this.moveY);
            this.disableLeft(false);
        }
        else {
            this.handleWrongMove();
            this.moveY++;
            this.disableRight(true);
        }
    }

    public upClicked = () => {
        this.moveX++;
        if (this.moveX >= 0 && this.moveX + 4 <= this.numberOfTerms
            && this.moveY >= 0 && this.moveY + 5 <= this.numberOfGroups
        ) {
            //this.updateTermArrays(this.moveX, this.moveY);
            this.disableDown(false);
        }
        else {
            this.handleWrongMove();
            this.moveX--;
            this.disableUp(true);
        }
    }

    public downClicked = () => {
        this.moveX--;
        if (this.moveX >= 0 && this.moveX + 4 <= this.numberOfTerms
            && this.moveY >= 0 && this.moveY + 5 <= this.numberOfGroups
        ) {
            //this.updateTermArrays(this.moveX, this.moveY);
            this.disableUp(false);
        }
        else {
            this.handleWrongMove();
            this.moveX++;
            this.disableDown(true);
        }
    }

    public handleWrongMove = () => {
        console.log("Wrong move!");
    }

    //-------------------------------SITE FLOW--------------------------------------------------//
    public getRawData = (courseName: string) => {
        var self = this;
        //console.log("Getting raw term data");
        var courseId = self.GetCourseId(courseName);
        if (courseId == -1) {
            console.log("Error getting course by name!");
            return;
        }
        //console.log(courseId);
        self.getTermsByCourseId(courseId);
    }

    public convertRawTermData = () => {
        var self = this;
        //console.log("Converting raw term data", self.RawTermDataWithDate);
        if (self.RawTermDataWithDate.length == 0) {
            console.log("Error with raw term data with dates. - no Terms");
            return;
        }
        //convert raw term data with Date object to raw term data with string instead of date object
        for (var i = 0; i < self.RawTermDataWithDate.length; i++) {
            var t0 = new KoTerm();
            t0.CourseId(self.RawTermDataWithDate[i].CourseId);
            t0.GroupId(self.RawTermDataWithDate[i].GroupId);
            t0.Id(self.RawTermDataWithDate[i].Id);
            t0.UserId(self.RawTermDataWithDate[i].UserId);
            //var dateString = self.RawTermDataWithDate[i].TermDate.toString();
            //var date = dateString.split('.')[0];
            //var month = dateString.split('.')[1];
            //var fYear = dateString.split('.')[2];
            //t0.TermDate(date + "." + month + "." + fYear + ".");
            t0.TermDate(self.dateToString(self.RawTermDataWithDate[i].TermDate));
            self.RawTermData.push(t0);
        }
        //console.log("RawTermData", self.RawTermData);


        //create an observable array with all the complete data
        if (self.RawTermData.length == 0) {
            console.log("Error with raw term data. - no Terms");
            return;
        }
        if (self.RawGroupData.length == 0) {
            console.log("Error with raw group data. - no Groups");
            return;
        }
        if (self.RawUserData.length == 0) {
            console.log("Error with raw user data. - no Users");
            return;
        }
        self.TermsUnsorted([]);
        for (var j = 0; j < self.RawTermData.length; j++) {
            var t1 = ko.observable<KoTerm>(new KoTerm());
            t1().CourseId = self.RawTermData[j].CourseId;
            t1().TermDate = self.RawTermData[j].TermDate;
            t1().GroupId = self.RawTermData[j].GroupId;
            t1().Id = self.RawTermData[j].Id;
            t1().UserId = self.RawTermData[j].UserId;
            self.TermsUnsorted().push(t1());
        }
        if (self.TermsUnsorted().length == 0) {
            console.log("Error after converting RawTermData to TermsUnsorted. - no Terms");
        }
        for (var i = 0; i < self.TermsUnsorted().length; i++) {
            for (var j = 0; j < self.RawGroupData.length; j++) {
                if (self.TermsUnsorted()[i].GroupId == self.RawGroupData[j].Id) {
                    var g = ko.observable<KoGroup>(new KoGroup());
                    g().CourseId = self.RawGroupData[j].CourseId;
                    g().Id = self.RawGroupData[j].Id;
                    g().Name = self.RawGroupData[j].Name;
                    g().Owner = self.RawGroupData[j].Owner;
                    g().OwnerId = self.RawGroupData[j].OwnerId;
                    self.TermsUnsorted()[i].Group = g;
                }
            }
            for (var j = 0; j < self.RawUserData.length; j++) {
                if (self.TermsUnsorted()[i].UserId == self.RawUserData[j].Id) {
                    var u = ko.observable<KoUser>(new KoUser());
                    u().Id = self.RawUserData[j].Id;
                    u().LastName = self.RawUserData[j].LastName;
                    u().Username = self.RawUserData[j].Username;
                    u().Name = self.RawUserData[j].Name;
                    u().Role = self.RawUserData[j].Role;
                    self.TermsUnsorted()[i].User = u;
                }
            }
        }
        //console.log("TermsUnsorted:", self.TermsUnsorted());
        self.sortTerms();
    }

    public sortTerms = () => {
        var self = this;
        //console.log("sorting terms");
        var dates = [];
        for (var i = 0; i < self.TermsUnsorted().length; i++) {
            var d = self.TermsUnsorted()[i].TermDate();
            if (dates.length == 0) {
                dates.push(d);
            }
            else {
                var alreadyExists = false;
                for (var j = 0; j < dates.length; j++) {
                    if (dates[j] == d) {
                        alreadyExists = true;
                    }
                }
                if (!alreadyExists) {
                    dates.push(d);
                }
            }
        }
        if (dates.length == 0) {
            console.log("Error sorting terms - no dates");
            return;
        }
        for (var i = 0; i < dates.length; i++) {
            self.TermsSortedByDate()[i] = new Array<KoTerm>();
            self.TermsSorted()[i] = new Array<KoTerm>();
            for (var j = 0; j < self.TermsUnsorted().length; j++) {
                //console.log("dates ", dates[i], "\nTermsUnsorted ", self.TermsUnsorted()[j].TermDate());
                if (dates[i].trim() == self.TermsUnsorted()[j].TermDate().trim()) {
                    //console.log("la");
                    self.TermsSortedByDate()[i].push(self.TermsUnsorted()[j]);
                }
            }
        }
        //console.log("Terms sorted by date:", self.TermsSortedByDate());

        //sort sub-arrays by group name
        function compare(a: KoTerm, b: KoTerm) {
            if (a.Group().Name() < b.Group().Name())
                return -1;
            if (a.Group().Name() > b.Group().Name())
                return 1;
            return 0;
        }

        for (var i = 0; i < dates.length; i++) {
            //self.TermsSortedByDate()[i].sort(compare);
            self.TermsSorted()[i] = self.TermsSortedByDate()[i];
        }

        console.log("Terms sorted:", self.TermsSorted());


        self.createDateArray(dates);
    }

    public createDateArray = (dates: Array<string>) => {
        var self = this;
        //console.log("creating date array");
        if (dates.length == 0) {
            console.log("Error creating a date array - no dates.");
            return;
        }
        for (var i = 0; i < dates.length; i++) {
            self.AllDates.push(self.stringToDate(dates[i]));
            self.AllDates[i].setMilliseconds(0);
        }
        //console.log(self.AllDates);
        self.updateTermArrays(0, 0);
    }

    public updateTermArrays = (moveX: number, moveY: number) => {
        var self = this;
        console.log("Updating term arrays: ", moveX, ",", moveY);
        if (self.AllDates.length == 0) {
            console.log("Error updating term arrays - no dates");
            return;
        }
        if (moveY == 0 && moveX==0) {
            self.posHor = 0;
            var beginDate = "";
            var today = new Date();
            today.setHours(0);
            today.setMinutes(0);
            today.setSeconds(0);
            today.setMilliseconds(0);
            //find which date is the closest to today
            for (var i = 0; i < self.AllDates.length; i++) {
                //console.log(self.AllDates[i], today);
                if (self.AllDates[i].getTime() < today.getTime()) {
                    //console.log("manji");
                    continue;
                }
                else if (self.AllDates[i].getTime() == today.getTime()) {
                    //console.log("isti");
                    self.posHor = i;
                    break;
                }
                else {
                    //console.log("veci");
                    self.posHor = i;
                    break;
                }
            }
            if (self.posHor == 0 && self.AllDates[0] != today) {
                console.log("All the dates are before today - there are no newer dates.\n Leaving empty arrays");
                return;
            }
            else {
                //console.log("Begin date:\n", self.AllDates[self.posHor]);
                beginDate = self.dateObjToString(self.AllDates[self.posHor]);
                console.log("Begin date:\n", beginDate);

            }

            for (var i = 0; i < 5; i++) {
                //self.Terms0()[i] = self.TermsSorted[self.posHor][i];
                console.log(self.TermsSorted[0][i]);
            }
        }
    }

    //-------------------------------REQUESTS---------------------------------------------------//
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

    public getTermsByCourseId = (courseId) => {
        //console.log("getting term per course id ", courseId);
        //var courseId = $('#term_course_select').val();
        //$("#term_name").val("");
        //console.log(courseId);
        var self = this;
        var serviceURL = '/Term/ByCourseId';
        $.ajax({
            type: "GET",
            url: serviceURL + "?courseId=" + courseId,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data: Array<RawTerm>, status) {
            //console.log(data);
            self.RawTermDataWithDate = new Array<RawTerm>();
            self.RawTermDataWithDate = data;
            //console.log(self.RawTermDataWithDate);
            self.getGroupsByCourseId(courseId);
        }
        function errorFunc(data) {
            console.log('error getting data about all terms for course with id', courseId, "\nreason:\n", data);
        }

    }

    public getTermsByGroupId = () => {
        //console.log("getting term per course data");
        var groupId = $('#term_group_select').val();
        if (groupId == "-1") {
            //this.getTermsByCourseId();
            return;
        }
        $("#term_name").val("");
        //console.log(courseId);
        var self = this;
        var serviceURL = '/Term/ByGroupId';
        $.ajax({
            type: "GET",
            url: serviceURL + "?groupId=" + groupId,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data: TermDTO_S[], status) {
            //self.Terms = data;
            //self.populateSelectTerm();
        }
        function errorFunc(data) {
            console.log('error getting data about all terms for course with id', groupId, "\nreason:\n", data);
        }

    }

    public getGroupsByCourseId = (courseId: number) => {
        //console.log("getting groups for", courseId);
        var self = this;
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
            self.getUsersByCourseId(courseId);
        }
        function errorFunc(data) {
            console.log('error getting data about all groups for course with id', courseId, "\nreason:\n", data);
        }

    }

    public getUsersByCourseId = (courseId: number) => {
        //console.log("getting users by course Id");
        var self = this;
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