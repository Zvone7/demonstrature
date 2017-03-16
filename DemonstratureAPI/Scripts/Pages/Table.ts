$(document).ready(() => {
    var tableVM: TableVM = new TableVM();
    //tableVM.LoginCheck();
    tableVM.getAllCourses();
});

//patiš se sa micanjem gore dolje..zabavica

class TableVM{
    //------------------------------------TERM----------------------------------//
    public Terms0: CellM_T[] = new Array<CellM_T>();
    public Terms1: CellM_T[] = new Array<CellM_T>();
    public Terms2: CellM_T[] = new Array<CellM_T>();
    public Terms3: CellM_T[] = new Array<CellM_T>();
    public EmptyTerms: TermDTO_T[];
    public ActiveTerms: TermM_T[] = new Array<TermM_T>();
    public AllTerms: CellM_T[][];
    //------------------------------------USER----------------------------------//
    public ActiveUser: UserM_T;
    public ActiveUsers: UserM_T[];
    public AllUsers: UserDTO_T[] = new Array<UserDTO_T>();
    public Users: UserM_T[];
    public UserData: UserM_T;
    public BlankUser: UserM_T = new UserM_T({ Id: '0', Username: 'blank', Name: 'Prazan', LastName:'termin', Role: 'D' });
    public BlankGroupOwner: UserM_T = new UserM_T({ Id: '0', Username: 'blank', Name: 'Nema', LastName:'vlasnika', Role: 'D' });
    //------------------------------------COURSE--------------------------------//
    public AllCourses;
    public Courses: CourseDTO_T[];
    public Course: CourseDTO_T;
    //------------------------------------GROUP----------------------------------//
    public ActiveGroups: GroupM_T[];
    public AllGroups;
    public BlankGroup: GroupM_T = new GroupM_T({ Id: '0', Name: '-', OwnerId: '0', CourseId: '0', UserPerson: this.BlankUser });
    //------------------------------------PRIMITIVE------------------------------//
    public disableLeft: boolean = false;
    public disableRight: boolean = false;
    public disableUp: boolean = false;
    public disableDown: boolean = false;
    //-------------------------------------primitive-----------------------------------//
    public position_verti: number = 0;
    public position_horiz: number = 0;
    public numberOfGroups: number = 0;
    public numberOfTerms: number = 0;
    public numberOfTermsBeforeToday: number = 0;
    public notification_no_available_data: string = "Nema podataka";
    public notification_no_term_owner: string = "Prazan termin_2";
    public notification_no_group_owner: string = "Nema";
    public notification_no_group_name: string = "Ne postoji";
    public warning_password_match = "Provjerite lozinku!";
    public warning_not_logged_in = "Molim ulogirajte se!";
    public link_main = "http://localhost:49977";
    public link_settings = "/Settings/Settings";
    public link_table = "/Table/Table";
    public link_login = "/Login/Login";
    //------------------------------------FUNCTIONS------------------------------------//
    constructor() {
        var self = this;
        $(document).ready(function () {
            //console.log("constructing");
            //this.setTodayDate();
            $('select').on("change", function () {
                if (this.id == "selectStudy") {
                    var value = $(this).val();
                    self.populateSelectCourse(value);
                }
                else if (this.id == "selectCourse") {
                    //console.log("selectCourse changed");
                    self.Terms0 = new Array<CellM_T>();
                    self.Terms1 = new Array<CellM_T>();
                    self.Terms2 = new Array<CellM_T>();
                    self.Terms3 = new Array<CellM_T>();
                    self.position_horiz = 0;
                    self.position_verti = 0;
                    self.updateTermValuesAfterSelect();
                }
                else if (this.id.lastIndexOf("search") != '-1') {
                    var i = parseInt(this.id.substring(6, 7));
                    var j = parseInt(this.id.substring(7, 8));
                }
            })
            //navigation

            $('#logout').on("click", () => {
                self.LogOut();
            });
            $('#test').on("click", () => {
                self.test();
            });

            $('#arrowLeft').on("click", () => {
                self.leftClicked();
            });
            $('#arrowRight').on("click", () => {
                self.rightClicked();
            });
            $('#arrowUp').on("click", () => {
                self.upClicked();
            });
            $('#arrowDown').on("click", () => {
                self.downClicked();
            });
            //css
            //$('#myUl').css("visibility", "visible");
        });
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
    //-------------------------------USERS START------------------------------------------------//
    public getAllUsers = () => {
        //console.log("getting all users");
        var self = this;
        var serviceURL = '/Settings/GetUsers';
        $.ajax({
            type: "GET",
            url: serviceURL,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data: UserM_T[], status) {
            self.Users = data;
        }
        function errorFunc(data) {
            console.log('error getting data about all users', data);
        }
    }
    public getUsersByCourseId = (courseId:number) => {
        //console.log("getting users by course Id");
        var self = this;
        var serviceURL = '/Settings/GetUsersByCourseId';
        $.ajax({
            type: "GET",
            url: serviceURL + "?courseId=" + courseId,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data: UserM_T[], status) {
            self.ActiveUsers = new Array<UserM_T>();
            //console.log("users by course id:",data);
            self.ActiveUsers = data;
            self.updateSelectUser();
            self.updateGroupData();
            self.createFullTermData();
        }
        function errorFunc(data) {
            console.log('error getting data about all groups for course with id', courseId, "\nreason:\n", data);
        }
    }
    public getUser = (username: string) => {
        var self = this;
        var serviceURL = '/Settings/UserByUsername';
        $.ajax({
            type: "GET",
            url: serviceURL + "?username=" + username,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data: UserM_T, status) {
            if (data != null) {
                self.ActiveUser = new UserM_T();
                self.ActiveUser = data;
            }
            else {
                self.ActiveUser = null;
            }
        }
        function errorFunc(data) {
            console.log('error getting data about user courses');
        }
    }
    //-------------------------------USERS END--------------------------------------------------//
    //------------------------------------------------------------------------------------------//
    //------------------------------------------------------------------------------------------//
    //-------------------------------COURSE START-----------------------------------------------//
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
        function successFunc(data: CourseDTO_T[], status) {
            self.Courses = data;
            //console.log(self.Courses);
            self.populateSelectStudy();
        }
        function errorFunc() {
            alert('error');
        }
    }
    public populateSelectStudy = () => {
        //console.log("populating select study");
        var studies = [];
        var output = [];
        for (var i = 0; i < this.Courses.length; i++) {
            var x = this.Courses[i].Study;
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
        this.populateSelectCourse(selectStudyValue);
        //this.updateValuesAfterSelect(); // mislim da tu ne treba
    }
    public populateSelectCourse = (studyName: string) => {
        //console.log("populating select course");
        var output = [];
        var names = [];
        for (var i = 0; i < this.Courses.length; i++) {
            var study = this.Courses[i].Study;
            var course = this.Courses[i].Name;
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
            if (this.Courses[i].Name != "" && this.Courses[i].Name != null) {
                output.push('<option value="' + names[i] + '">' + names[i] + '</option>');
            }
        }       
        $('#selectCourse').html(output.join(''));
        this.updateTermValuesAfterSelect();
    }
    //-------------------------------COURSE END-------------------------------------------------//
    //------------------------------------------------------------------------------------------//
    //------------------------------------------------------------------------------------------//
    //-------------------------------TERM START-------------------------------------------------//
    public createFullTermData = () => {
        //console.log("creating full term data");
        //console.log("Empty terms", this.EmptyTerms);
        //console.log("Active Users", this.ActiveUsers);
        //console.log("Active Groups", this.ActiveGroups);
        this.ActiveTerms = new Array<TermM_T>();
        for (var i = 0; i < this.EmptyTerms.length; i++) {
            this.ActiveTerms[i] = new TermM_T();
            this.ActiveTerms[i].Id = this.EmptyTerms[i].Id;
            this.ActiveTerms[i].CourseId = this.EmptyTerms[i].CourseId;
            this.ActiveTerms[i].Course = this.Course;
            /*start date conversion*/
            var date = this.EmptyTerms[i].TermDate;
            /*date conversion end*/
            this.ActiveTerms[i].TermDate = date;
            this.ActiveTerms[i].UserId = this.EmptyTerms[i].UserId;
            this.ActiveTerms[i].GroupId = this.EmptyTerms[i].GroupId;
        }
        for (var i = 0; i < this.ActiveTerms.length; i++) {
            for (var j = 0; j < this.ActiveUsers.length; j++) {
                if (this.ActiveTerms[i].UserId == this.ActiveUsers[j].Id) {
                    this.ActiveTerms[i].UserPerson = this.ActiveUsers[j];
                    break;
                }
                else {
                    this.ActiveTerms[i].UserPerson = this.BlankUser;
                }
            }
            for (var j = 0; j < this.ActiveGroups.length; j++) {
                if (this.ActiveTerms[i].GroupId == this.ActiveGroups[j].Id) {
                    this.ActiveTerms[i].Group = this.ActiveGroups[j];
                    break;
                }
                else {
                    this.ActiveTerms[i].Group = this.BlankGroup;
                }
            }
        }
        //console.log("Active Terms", this.ActiveTerms);
        if (this.Terms0.length > 0) {
            console.log("self.Terms0.length>0, 303 red!!");
            //self.updateTermTable();
        }
        else {
            console.log("self.Terms0.length=0");
            this.fillAllTerms();
        }
    }
    public createTermTable = () => {
        //console.log("creating term table");
        //console.log("allTerms", this.AllTerms);
        //console.log("activeGroups", this.ActiveGroups);
        for (var i = this.position_verti; i < this.AllTerms.length; i++) {
            for (var j = 0; j < this.ActiveGroups.length; j++) {
                var cell = new CellM_T();
                //console.log(i, j);
                cell.x = i;
                cell.y = j;
                cell.UserId = this.AllTerms[i][j].UserId;
                cell.UserPerson = new UserM_T(this.AllTerms[i][j].UserPerson);
                var jsonDate = this.AllTerms[i][j].TermDate.toString();
                var date = jsonDate.split('.');
                cell.TermDate = date[0] + "." + date[1] + "." + date[2];
                //console.log("created cell ", cell);
                cell.Group = this.AllTerms[i][j].Group;
                if (i == 0 + this.position_verti) this.Terms0.push(cell);
                else if (i == 1 + this.position_verti) this.Terms1.push(cell);
                else if (i == 2 + this.position_verti) this.Terms2.push(cell);
                else if (i == 3 + this.position_verti) this.Terms3.push(cell);
            }
        }
        //console.log("Terms0", this.Terms0); console.log("Terms1", this.Terms1); console.log("Terms2", this.Terms2); console.log("Terms3", this.Terms3);

        this.setInitialNavigation();
        this.updateGroupWebData();
        this.updateTermWebData(this.Terms0, 0);
        this.updateTermWebData(this.Terms1, 1);
        this.updateTermWebData(this.Terms2, 2);
        this.updateTermWebData(this.Terms3, 3);
    }
    public fillAllTerms = () => {
        //console.log("filling all terms");
        var stringResult = "";
        var flags = [], TermDates = [], foundDate: boolean;
        //this part determines how many different dates there are
        for (var i = 0; i < this.ActiveTerms.length; i++) {
            foundDate = false;
            for (var j = 0; j < TermDates.length; j++) {
                if (TermDates[j] == this.ActiveTerms[i].TermDate) {
                    foundDate = true;
                }
            }
            if (!foundDate) {
                TermDates.push(this.ActiveTerms[i].TermDate);
            }
        }
        //end
        this.numberOfTerms = TermDates.length;
        this.numberOfGroups = this.ActiveGroups.length;
        //figure out how many terms are before todays date
        for (var i = 0; i < TermDates.length; i++) {
            var date = TermDates[i];
            var today = new Date();
            today.setHours(0);
            today.setMinutes(0);
            today.setSeconds(0);
            today.setMilliseconds(0);
            var day_ = date.split(".")[0];
            var month_ = date.split(".")[1];
            var year_ = date.split(".")[2];
            var dateFormated = new Date(parseInt(year_), parseInt(month_)-1, parseInt(day_)) ;
            //console.log(dateFormated, "\n\n", today);
            if (dateFormated < today) {
                this.position_verti++;
            }
        }
        //console.log("there are ", this.position_verti, " terms which are before today");
        this.numberOfTermsBeforeToday = this.position_verti;
        //console.log("There are ", this.numberOfGroups, "different groups and ", TermDates.length, "different dates")
        this.AllTerms = new Array<CellM_T[]>();
        //this makes a 2D array called AllTerms in which every row stands for date, and every column for group
        for (var i = 0; i < TermDates.length; i++) {
            this.AllTerms[i] = new Array<CellM_T>();
            for (var j = 0; j < this.ActiveGroups.length; j++) {
                var cell: CellM_T = new CellM_T();
                cell.x = i;
                cell.y = j;
                var person = new UserM_T();
                for (var k = 0; k < this.ActiveTerms.length; k++) {
                    var t = this.ActiveTerms[k];
                    if (t.TermDate == TermDates[i] && t.GroupId == this.ActiveGroups[j].Id) {
                        person = t.UserPerson;
                    }
                }
                cell.UserPerson = person;
                cell.UserId = person.Id;
                cell.TermDate = TermDates[i];
                cell.Group = this.ActiveGroups[j];
                this.AllTerms[i][j] = cell;
            }
        }

        //console.log("All Terms:", this.AllTerms);
        this.createTermTable();
    }
    public getTermsByCourseId = (courseId) => {
        //console.log("getting terms by course Id");
        var self = this;
        var serviceURL = '/Settings/GetTermsByCourseId';
        $.ajax({
            type: "GET",
            url: serviceURL + "?courseId=" + courseId,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data: TermDTO_T[], status) {
            self.EmptyTerms = data;
            self.getGroupsByCourseId(courseId);

        }
        function errorFunc(data) {
            console.log('error getting data about all terms for course with id', courseId, "\nreason:\n", data);
        }

    }
    public setInitialTermValues = () => {
        //console.log("setting inital term values");
        var IdButtonTakeDefault = "#buttonTakeTerm";
        var IdButtonSkipDefault = "#buttonSkipTerm";
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 5; j++) {
                var IdButtonTake = IdButtonTakeDefault + i.toString() + j.toString();
                var IdButtonSkip = IdButtonSkipDefault + i.toString() + j.toString();
                $(IdButtonTake).text("Rezerviraj termin");
                $(IdButtonSkip).text("Preskoči termin");




                var IdButtonTake = IdButtonTakeDefault;
                var IdButtonSkip = IdButtonSkipDefault;
            }
        }
    }
    public updateSelectUser = () => {
        //console.log("populating select user");
        //console.log("Active Users:\n",this.ActiveUsers);
        var output = [];
        output.push('<option value="' + "0" + '">' + "Odaberite demonstratora" + '</option>');
        if (this.ActiveUsers == null) {
            $(selectId).find('option').remove().end();
            $(selectId).html(output.join(''));
            return;
        }
        for (var i = 0; i < this.ActiveUsers.length; i++) {
            //console.log("filling search")
            var name = this.ActiveUsers[i].Name + " " + this.ActiveUsers[i].LastName;
            var id = this.ActiveUsers[i].Id;
            var outputMember = '<option value="' + id.toString() + '">' + name + '</option>';
            output.push(outputMember);
        }
        //console.log(output);
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 5; j++) {
                var selectId = "#search" + i.toString() + j.toString();
                $(selectId).find('option').remove().end();
                $(selectId).html(output.join(''));
            }
        }
    }
    public updateTermArrays = () => {
        var j_ = this.position_horiz;
        var i_ = this.position_verti;
        console.log("updating Term Arrays for:", i_, "|", j_);
        var helper = "";
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 5; j++) {
                var cell = this.AllTerms[i_ + i][j_ + j];
                cell.x = i;
                cell.y = j;
                if (i == 0 + this.position_verti) {
                    this.Terms0[j].UserPerson=cell.UserPerson;
                    this.Terms0[j].SkipState=cell.SkipState;
                    this.Terms0[j].TakeState = cell.SkipState;
                    this.Terms0[j].TermDate = cell.TermDate.substring(0,9);
                    this.Terms0[j].x = cell.x;
                    this.Terms0[j].y = cell.y;
                    this.Terms0[j].Group=cell.Group;
                }
                else if (i == 1) {
                    this.Terms1[j].UserPerson=cell.UserPerson;
                    this.Terms1[j].SkipState=cell.SkipState;
                    this.Terms1[j].TakeState=cell.SkipState;
                    this.Terms1[j].TermDate = cell.TermDate.substring(0, 9);
                    this.Terms1[j].x = cell.x;
                    this.Terms1[j].y = cell.y;
                    this.Terms1[j].Group=cell.Group;
                }
                else if (i == 2) {
                    this.Terms2[j].UserPerson=cell.UserPerson;
                    this.Terms2[j].SkipState=cell.SkipState;
                    this.Terms2[j].TakeState=cell.SkipState;
                    this.Terms2[j].TermDate = cell.TermDate.substring(0, 9);
                    this.Terms2[j].x = cell.x;
                    this.Terms2[j].y = cell.y;
                    this.Terms2[j].Group=cell.Group;
                }
                else if (i == 3) {
                    this.Terms3[j].UserPerson=cell.UserPerson;
                    this.Terms3[j].SkipState=cell.SkipState;
                    this.Terms3[j].TakeState=cell.SkipState;
                    this.Terms3[j].TermDate = cell.TermDate.substring(0, 9);
                    this.Terms3[j].x = cell.x;
                    this.Terms3[j].y = cell.y;
                    this.Terms3[j].Group=cell.Group;
                }
            }
        }
        this.updateTermWebData(this.Terms0, 0);
        this.updateTermWebData(this.Terms1, 1);
        this.updateTermWebData(this.Terms2, 2);
        this.updateTermWebData(this.Terms3, 3);
        this.updateGroupWebData();
        //console.log("terms0 userperson:", this.Terms0[0].UserPerson);
    }
    public updateTermTable = (data: TermM_T[][]) => {
        //console.log("updating Term Table");
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                var cell = new CellM_T();
                cell.x = i;
                cell.y = j;
                cell.UserPerson=data[i][j].UserPerson;
                var jsonDate = data[i][j].TermDate.toString();
                var date = new Date(parseInt(jsonDate.substr(6)));
                cell.TermDate=date.getDate() + "." +
                    (date.getMonth()).toString() + "." +
                    date.getFullYear().toString();
                cell.Group=data[i][j].Group;
                if (i == 0) this.Terms0.push(cell);
                else if (i == 1) this.Terms1.push(cell);
                else if (i == 2) this.Terms2.push(cell);
                else if (i == 3) this.Terms3.push(cell);
            }
        }
    }
    public updateTermValuesAfterSelect = () => {
        //console.log("------------\nupdating term values after select");
        var selectStudy = $('#selectStudy').val();
        var selectCourse = $('#selectCourse').val()
        var self = this;
        var course = new CourseDTO_T();
        for (var i = 0; i < self.Courses.length; i++) {
            var y = self.Courses[i];
            if (y.Study == selectStudy && y.Name == selectCourse) {
                course = y;
            }
        }
        //console.log(course);
        self.Course = course;
        self.getTermsByCourseId(course.Id);
    }
    public updateTermWebData = (termsX: CellM_T[], x: number) => {
        var i = x;
        //console.log("updating web data for row ", i.toString(), " with this data ", termsX);

        var dateLabelId = "#date" + i.toString();
        var termOwnerLabelId = "#termOwner";

        if (termsX.length != 0) {
            var date = termsX[0].TermDate;
            $(dateLabelId).text(date);
            for (var j = 0; j < 5; j++) {
                termOwnerLabelId += i.toString() + j.toString();
                var termOwner = "";
                if (termsX.length <= j) {
                    termOwner = this.notification_no_term_owner;
                }
                else {
                    termOwner = termsX[j].UserPerson.Name + " " + termsX[j].UserPerson.LastName;
                }
                $(termOwnerLabelId).text(termOwner);
                //console.log("[", i, "],[", j, "]","\nTerm Owner:", termOwner,"\nGroup Owner:", groupOwner,"\nGroup Name:", groupName);
                //console.log("[", i, "],[", j, "]", "\nTerm Owner Id:", termOwnerLabelId, "\nGroup Owner Id:", groupOwnerLabelId, "\nGroup Name Id:", groupNameLabelId);
                termOwnerLabelId = "#termOwner";
            }
        }
        else {
            $(dateLabelId).text(this.notification_no_available_data);
            for (var j = 0; j < 5; j++) {
                termOwnerLabelId += i.toString() + j.toString();
                var termOwner = this.notification_no_term_owner;

                $(termOwnerLabelId).text(termOwner);
                //console.log("[", i, "],[", j, "]","\nTerm Owner:", termOwner,"\nGroup Owner:", groupOwner,"\nGroup Name:", groupName);
                termOwnerLabelId = "#termOwner";
            }
        }
    }
    //-------------------------------TERM END---------------------------------------------------//
    //------------------------------------------------------------------------------------------//
    //------------------------------------------------------------------------------------------//
    //-------------------------------GROUP START------------------------------------------------//
    public getGroupsByCourseId = (courseId:number) => {
        //console.log("getting groups for", courseId);
        var self = this;
        var serviceURL = '/Settings/GetGroupsByCourseId';
        $.ajax({
            type: "GET",
            url: serviceURL + "?courseId=" + courseId,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data: GroupM_T[], status) {
            self.ActiveGroups = new Array<GroupM_T>();
            self.ActiveGroups = data;
            //console.log("active groups", self.ActiveGroups);
            self.getUsersByCourseId(courseId);
        }
        function errorFunc(data) {
            console.log('error getting data about all groups for course with id', courseId, "\nreason:\n", data);
        }

    }
    public updateGroupData = () => {
        //console.log("Updating group data");
        var self = this;
        for (var i = 0; i < self.ActiveUsers.length; i++) {
            for (var j = 0; j < self.ActiveGroups.length; j++) {
                if (self.ActiveGroups[j].OwnerId == self.ActiveUsers[i].Id) {
                    self.ActiveGroups[j].UserPerson = self.ActiveUsers[i];
                    break;
                }
                else {
                    self.ActiveGroups[j].UserPerson = self.BlankGroupOwner;
                }
            }
        }
    }
    public updateGroupWebData = () => {
        this.checkValidMovement();
        //console.log("Updating group web data, this.position_horiz", this.position_horiz);
        var self = this;
        if (self.ActiveGroups.length == 0) {
            console.log("Nema pronadjenih grupa");
            return;
        }
        for (var i = 0; i < self.ActiveGroups.length-1; i++){
            //console.log(self.ActiveGroups[i]);
            var groupNameId = "#groupName" + i.toString();
            var groupOwnerId = "#groupOwner" + i.toString();
            var groupNameValue = self.ActiveGroups[i + this.position_horiz].Name;
            var groupOwnerValue = self.ActiveGroups[i + this.position_horiz].UserPerson.Name + " " + self.ActiveGroups[i + this.position_horiz].UserPerson.LastName;
            //console.log("filling ", groupOwnerId, " with ", groupOwnerValue);
            //console.log(i, ":", groupNameValue, groupOwnerValue);
            $(groupNameId).text(groupNameValue);
            $(groupOwnerId).text(groupOwnerValue);            
        }
        if (self.ActiveGroups.length<5) {
            for (var i = self.ActiveGroups.length-1; i < 5; i++) {
                var groupNameId = "#groupName" + i.toString();
                var groupOwnerId = "#groupOwner" + i.toString();
                var groupNameValue = self.notification_no_group_name;
                var groupOwnerValue = self.notification_no_group_owner;
                $(groupNameId).text(groupNameValue);
                $(groupOwnerId).text(groupOwnerValue);
               
            }
        }
    }
    //-------------------------------GROUP END--------------------------------------------------//
    //------------------------------------------------------------------------------------------//
    //------------------------------------------------------------------------------------------//
    //-------------------------------NAVIGATION START-------------------------------------------//
    public leftClicked = () => {
        this.position_horiz--;
        if (this.checkValidMovement())
        {
            this.disableRight = false;
            if (this.position_horiz == 0) {
                this.disableLeft = true;
            }
            this.updateTermArrays();
            this.updateNavigationClasses();
        }
        else {
            this.disableLeft=true;
            this.position_horiz++;
            this.handleWrongMove();
        }
    }
    public rightClicked = () => {
        this.position_horiz++;
        if (this.checkValidMovement()) {
            this.disableLeft = false;
            if (this.position_horiz == this.numberOfGroups-5) {
                this.disableRight = true;
            }
            this.updateTermArrays();
            this.updateNavigationClasses();
        }
        else {
            this.disableRight = true;
            this.disableLeft = false;
            this.position_horiz--;
            this.handleWrongMove();
        }
    }
    public upClicked = () => {
        this.position_verti++;
        if (this.checkValidMovement()) {
            this.disableDown = false;
            if (this.position_verti == (this.numberOfTerms - this.numberOfTermsBeforeToday)) {
                this.disableDown = true;
            }
            this.updateTermArrays();
            this.updateNavigationClasses();
        }
        else {
            this.disableUp=true;
            this.position_verti--;
            this.handleWrongMove();
        }        
    }
    public downClicked = () => {
        this.position_verti--;
        if (this.checkValidMovement()) {
            this.disableUp = false;
            if (this.position_verti == (-1 * this.numberOfTermsBeforeToday)) {
                this.disableUp = true;
            }
            this.updateTermArrays();
            this.updateNavigationClasses();
        }
        else {
            this.disableDown=true;
            this.position_verti++;
            this.handleWrongMove();
        }
    }
    public handleWrongMove = () => {
        console.log("*********************\nWrong move!\n*********************");
        this.updateNavigationClasses();
    }
    public updateNavigationClasses = () => {
        console.log("updating navigation classes");
        console.log("left:", !this.disableLeft);console.log("right:", !this.disableRight);console.log("up:", !this.disableUp);console.log("down:", !this.disableDown);
        if (this.disableLeft) {
            $("#arrowLeft").attr('class', 'arrowLeftDisabled');
        }
        else {
            $("#arrowLeft").attr('class', 'arrowLeft');
        }
        if (this.disableRight) {
            $("#arrowRight").attr('class', 'arrowRightDisabled');
        }
        else {
            $("#arrowRight").attr('class', 'arrowRight');
        }
        if (this.disableUp) {
            $("#arrowUp").attr('class', 'arrowUpDisabled');
        }
        else {
            $("#arrowUp").attr('class', 'arrowUp');
        }
        if (this.disableDown) {
            $("#arrowDown").attr('class', 'arrowDownDisabled');
        }
        else {
            $("#arrowDown").attr('class', 'arrowDown');
        }
    }
    public checkValidMovement = () => {
        console.log("vertical position:\n", this.position_verti, "/", this.numberOfTerms, "\nhorizontal position\n", this.position_horiz, "/", this.numberOfGroups);
        console.log("vertical upper limit:", this.numberOfTerms - this.numberOfTermsBeforeToday - 4);
        console.log("vertical lower limit:", -1 * this.numberOfTermsBeforeToday);
        if (
            this.position_verti >= (-1 * this.numberOfTermsBeforeToday) &&
            this.position_verti < (this.numberOfTerms - this.numberOfTermsBeforeToday - 4)
            &&
            this.position_horiz >= 0 &&
            this.position_horiz + 5 <= this.numberOfGroups
        )
        {
            console.log("true");
            return true;
        }
        else {
            console.log("Invalid move!");
            return false;
        }
    }
    public setInitialNavigation = () => {
        //console.log("setting inital navigation");
        $("#arrowLeft").attr('class', 'arrowLeft');
        $("#arrowRight").attr('class', 'arrowRight');
        $("#arrowUp").attr('class', 'arrowUp');
        $("#arrowDown").attr('class', 'arrowDown');
        if (this.position_horiz == 0) { this.disableLeft = true; $("#arrowLeft").attr('class', 'arrowLeftDisabled'); }
        if (this.numberOfGroups <= 5) { this.disableRight = true; $("#arrowRight").attr('class', 'arrowRightDisabled'); }
        if (this.position_verti == 0) { this.disableUp = true; $("#arrowUp").attr('class', 'arrowUpDisabled'); }
        if (this.numberOfTerms <= 4) { this.disableDown = true; $("#arrowDown").attr('class', 'arrowDownDisabled'); }
    }
    //-------------------------------NAVIGATION END---------------------------------------------//
    //------------------------------------------------------------------------------------------//
    //------------------------------------------------------------------------------------------//
    //----------------------------------COOKIE START--------------------------------------------//
    public GetCookie = (cname) => {
        try {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }
        catch (err) {
            return "";
        }
    }
    public CheckCookie = (cname) => {
        var loginData = this.GetCookie(cname);
        if (loginData != "") {
            return loginData;
        }
        else {
            return "";
        }
    }
    //----------------------------------COOKIE END----------------------------------------------//
    //------------------------------------------------------------------------------------------//
    //------------------------------------------------------------------------------------------//
    //-----------------------AUTHORIZATION & AUTHENTICATION START-------------------------------//
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
    public ActivateAdministrator = () => {
        $("#adminSettings").css("visibility", "visible");
        this.getAllCourses();
        this.setInitialTermValues();
    }
    public ActivateRegularUser = () => {
        $("#adminSettings").css("visibility", "collapse");
    }
    //-----------------------AUTHORIZATION & AUTHENTICATION END---------------------------------//
    //------------------------------------------------------------------------------------------//
    //-------------------------------EVERYTHING ELSE START--------------------------------------//
    public setTodayDate = () => {
        var realDate2 = new Date();
        var year = realDate2.getFullYear().toString();
        var month = (realDate2.getMonth() + 1).toString();
        var day = realDate2.getDate().toString();
        var month = this.minTwoDigits(parseInt(month));
        var day = this.minTwoDigits(parseInt(day));
        //console.log(day, month, year);
        $("#term_date").val(year + "-" + month + "-" + day);
    }
    public minTwoDigits = (n) => {
        return (n < 10 ? '0' : '') + n;
    }
    //-------------------------------EVERYTHING ELSE END----------------------------------------//
    //------------------------------------------------------------------------------------------//


    public test = () => {
        
        //console.log("f", userUniqueVariable);
    }
}
class UserM_T {
    public Id:number;
    public Username: string;
    public Name: string;
    public LastName: string;
    public Role : string;
    constructor(myUser?: any) {
        if (myUser) {
            this.Id=myUser.Id;
            this.Username = myUser.Username;
            this.Name = myUser.Name;
            this.LastName = myUser.LastName;
            this.Role=myUser.Role;
        }
    }
}
class UserDTO_T {
    public Id: number;
    public Username: string;
    public FullName: string;
    public Role: string;
}
class TermM_T {
    public Id:number;
    public CourseId: number;
    public Course: CourseM_T;
    public UserId: number;
    public UserPerson: UserM_T;
    public GroupId: number;
    public Group: GroupM_T;    
    public TermDate: string;    
}
class TermDTO_T {
    public Id: number;
    public CourseId: number;
    public GroupId: number;
    public UserId: number;
    public TermDate: string;
}
class CellM_T {
    public x :number;
    public y :number;
    public TakeState : boolean;
    public SkipState : boolean;
    public TermDate : string;
    public Group: GroupM_T;
    public UserId: number;
    public UserPerson : UserM_T;    
}
class CourseM_T {
    public Id : number;
    public Name : string;
    public Study : string;
    public Leader : string;
    public Asistant : string;
    public TermT : TermM_T[][]; 
}
class CourseDTO_T {
    public Id: number;
    public Name: string;
    public Study: string;
    public Leader: string;
    public Asistant: string;
    public TermT: TermM_T[][];    
}
class GroupM_T {
    public Id : number;
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
class LoginDataM_T {
    public Username: string;
    public Password: string;
}

