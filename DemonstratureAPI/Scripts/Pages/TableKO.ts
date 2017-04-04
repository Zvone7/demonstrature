$(document).ready(() => {
    var tableVM: TableVM = new TableVM();
    tableVM.Allocation();
    tableVM.getAllCourses();
    ko.applyBindings(tableVM);
});


class TableVM {
    //---------------------------------OBSERVABLES------------------------------//
    //public Terms0 = ko.observableArray<CellM_T>();
    //public Terms1 = ko.observableArray<CellM_T>();
    //public Terms2 = ko.observableArray<CellM_T>();
    //public Terms3 = ko.observableArray<CellM_T>();
    //public allTerms = ko.observableArray<CellM_T[][]>();
    //public Users = ko.observableArray<UserM_T>();
    public YO = ko.observable<string>();
    public CoursesAll = ko.observableArray<KoCourse>([]);
    public CoursesActive = ko.observableArray<KoCourse>([]);
    public Studies = ko.observableArray<KoStudy>([]);
    public bindingsApplied = false;
    public link_main = "http://localhost:49977";
    public link_settings = "/Settings/Settings";
    public link_table = "/Table/Table";
    public link_login = "/Login/Login";

    public Options = ko.observableArray<MyOption>([]);

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

    public Allocation = () => {
        var self = this;

        var study = ko.observable<KoStudy>(new KoStudy());
        study().Name("dummy study");
        study().Id(1);
        self.Studies([]);
        self.Studies().push(study());

        var course = ko.observable<KoCourse>(new KoCourse());
        course().Id(1);
        course().Name("dummy course");
        course().Study("");
        self.CoursesActive([]);
        self.CoursesActive().push(course());
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
        var mo = ko.observable<MyOption>(new MyOption());
        mo().Name("opcijica");
        mo().Id(1);
        self.Options.push(mo());
        console.log("updating options", self.Options());
    }
}


class KoTermM {
    public Id = ko.observable<number>();
    public CourseId = ko.observable<number>();
    public Course = ko.observable<CourseM_T>();
    public UserId = ko.observable<number>();
    public UserPerson = ko.observable<UserM_T>();
    public GroupId = ko.observable<number>();
    public Group = ko.observable<GroupM_T>();
    public TermDate = ko.observable<string>();
    constructor(t: KoTermM) {
        this.Id = t.Id;
        this.CourseId = t.CourseId;
        this.Course = t.Course;
        this.UserId = t.Id;
        this.UserPerson = t.UserPerson;
        this.GroupId = t.GroupId;
        this.Group = t.Group;
        this.TermDate = t.TermDate;
    }
}
class KoCell {
    public x = ko.observable<number>();
    public y = ko.observable<number>();
    public CellState = ko.observable<number>();
    public ButtonTakeState = ko.observable<boolean>();
    public ButtonSkipState = ko.observable<boolean>();
    public Term = ko.observable<TermM_T>();
}
class KoUser {
    public Id: number;
    public Username: string;
    public Name: string;
    public LastName: string;
    public Role: string;
    constructor(myUser?: any) {
        if (myUser) {
            this.Id = myUser.Id;
            this.Username = myUser.Username;
            this.Name = myUser.Name;
            this.LastName = myUser.LastName;
            this.Role = myUser.Role;
        }
    }
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
    public Id: number;
    public Name: string;
    public OwnerId: number;
    public CourseId: number;
    public UserPerson: UserM_T;
    constructor(group?: any) {
        if (group) {
            this.Id = group.Id;
            this.Name = group.Name;
            this.OwnerId = group.OwnerId;
            this.CourseId = group.CourseId;
            this.UserPerson = group.UserPerson;
        }
    }
}

class MyOption {
    public Id = ko.observable<number>();
    public Name = ko.observable<string>();
}