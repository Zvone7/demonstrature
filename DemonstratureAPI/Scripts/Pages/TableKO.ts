$(document).ready(() => {
    var tableVM: TableVM = new TableVM();
    tableVM.allocation();
    tableVM.getAllCourses();
    ko.applyBindings(tableVM);
});


class TableVM {
    //---------------------------------OBSERVABLES------------------------------//
    public Terms0 = ko.observableArray<KoCell>();
    public Terms1 = ko.observableArray<KoCell>();
    public Terms2 = ko.observableArray<KoCell>();
    public Terms3 = ko.observableArray<KoCell>();
    //public allTerms = ko.observableArray<CellM_T[][]>();
    //public Users = ko.observableArray<UserM_T>();
    public YO = ko.observable<string>();
    public CoursesAll = ko.observableArray<KoCourse>([]);
    public CoursesActive = ko.observableArray<KoCourse>([]);
    public Studies = ko.observableArray<KoStudy>([]);
    public Demonstrators = ko.observableArray<KoDemonstrator>([]);

    public disableLeft = ko.observable<boolean>(false);
    public disableRight = ko.observable<boolean>(true);
    public disableUp = ko.observable<boolean>(false);
    public disableDown = ko.observable<boolean>(true);
    //----------------------------------default values------------------------------//
    public defaultTextButtonSkip = "Preskoči termin";
    public defaultTextButtonTake = "Uzmi termin";
    public defaultCourseName = "Kolegij";
    public defaultDate = new Date().getDate() + "." + (new Date().getMonth() + 1) + "." + new Date().getFullYear()+".";
    public defaultGroupName = "Grupa";
    public defaultId = 0;
    public defaultStudyName = "Smjer";
    public defaultUserLastName = "Prezime";
    public defaultUserName = "Ime";
    public defaultUserRole = "D";
    public defaultUserUsername = "iprezime";

    //--------------------------------------primitive----------------------------------//
    public moveX: number = 0;
    public moveY: number = 0;
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
                    //console.log("selectCourse changed");
                    //self.Terms0_no = new Array<CellM_T>();
                    //self.Terms1_no = new Array<CellM_T>();
                    //self.Terms2_no = new Array<CellM_T>();
                    //self.Terms3_no = new Array<CellM_T>();
                    //self.position_horiz = 0;
                    //self.position_verti = 0;
                    //self.updateTermValuesAfterSelect();
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

        function progress() {
            /*      
                    getAllCourses
                        populateSelectStudy
                            populateSelectCourse
            */
        }
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
        term().Date(self.defaultDate);

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
            for (var j = 0; j < 5; j++){
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

    }

    public getAllCourses = () => {
        //console.log("gettingAllCourses");
        var self = this;
        var serviceURL = '/Table/AllCollegeCourses';
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

    public GetTerm = () => {

    }


    //-------------------------------NAVIGATION START-------------------------------------------//
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
    //-------------------------------NAVIGATION END---------------------------------------------//




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
    public Date = ko.observable<string>();
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