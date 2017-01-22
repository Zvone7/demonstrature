$(document).ready(() => {
    var tableVM: TableVM = new TableVM();
    tableVM.LoginCheck();
});

class TableVM{
    //------------------------------------TERM----------------------------------//
    public Terms0: CellM_T[] = new Array<CellM_T>();
    public Terms1: CellM_T[] = new Array<CellM_T>();
    public Terms2: CellM_T[] = new Array<CellM_T>();
    public Terms3: CellM_T[] = new Array<CellM_T>();
    public EmptyTerms: Term2DTO[];
    public ActiveTerms: TermM_T[] = new Array<TermM_T>();
    public AllTerms: CellM_T[][];
    //------------------------------------USER----------------------------------//
    public ActiveUser: MyUserM_T;
    public ActiveUsers: MyUserM_T[];
    public AllUsers: MyUser2DTO[] = new Array<MyUser2DTO>();
    public Users: MyUserM_T[];
    public UserData: MyUserM_T;
    public BlankUser: MyUserM_T = new MyUserM_T({ Id: '0', Username: 'blank', Name: 'Prazan', LastName:'termin', Role: 'D' });
    public BlankGroupOwner: MyUserM_T = new MyUserM_T({ Id: '0', Username: 'blank', Name: 'Nema', LastName:'vlasnika', Role: 'D' });
    //------------------------------------COURSE--------------------------------//
    public AllCourses;
    public Courses: Course2DTO[];
    public Course: Course2DTO;
    //------------------------------------GROUP----------------------------------//
    public ActiveGroups: GroupM_T[];
    public AllGroups;
    public BlankGroup: GroupM_T = new GroupM_T({ Id: '0', Name: '-', OwnerId: '0', CourseId: '0', UserPerson: this.BlankUser });
    //------------------------------------PRIMITIVE------------------------------//
    public disableLeft: boolean = false;
    public disableRight: boolean = true;
    public disableUp: boolean = false;
    public disableDown: boolean = true;
    //-------------------------------------primitive-----------------------------------//
    public moveX: number = 0;
    public moveY: number = 0;
    public numberOfGroups: number = 0;
    public numberOfTerms: number = 0;
    public notification_no_available_data: string = "Nema podataka";
    public notification_no_term_owner: string = "Prazan termin_2";
    public notification_no_group_owner: string = "Nema";
    public notification_no_group_name: string = "Nema";
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
                    self.updateTermValuesAfterSelect();
                }
                else if (this.id.lastIndexOf("search") != '-1') {
                    var i = parseInt(this.id.substring(6, 7));
                    var j = parseInt(this.id.substring(7, 8));
                }
            })
            //navigation
            $('#arrowLeft').on("click", () => {
                console.log("lalaa");
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
            $('#myUl').css("visibility", "visible");
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
                setInitialValues
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
        function successFunc(data: MyUserM_T[], status) {
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
        function successFunc(data: MyUserM_T[], status) {
            self.ActiveUsers = new Array<MyUserM_T>();
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
        function successFunc(data: MyUserM_T, status) {
            if (data != null) {
                self.ActiveUser = new MyUserM_T();
                self.ActiveUser = data;
                self.UserCheck();
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
        function successFunc(data: Course2DTO[], status) {
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
            //console.log("self.Terms0.length>0");
            //self.updateTermTable();
        }
        else {
            //console.log("self.Terms0.length=0");
            this.fillAllTerms();
        }
    }
    public createTermTable = () => {
        //console.log("creating term table");
        //console.log("allTerms", this.AllTerms);
        //console.log("activeGroups", this.ActiveGroups);
        for (var i = 0; i < this.AllTerms.length; i++) {
            for (var j = 0; j < this.ActiveGroups.length; j++) {
                var cell = new CellM_T();
                //console.log(i, j);
                cell.x = i;
                cell.y = j;
                cell.UserId = this.AllTerms[i][j].UserId;
                cell.UserPerson = new MyUserM_T(this.AllTerms[i][j].UserPerson);
                var jsonDate = this.AllTerms[i][j].TermDate.toString();
                var date = jsonDate.split('.');
                cell.TermDate = date[0] + "." + date[1] + "." + date[2];
                //console.log("created cell ", cell);
                cell.Group = this.AllTerms[i][j].Group;
                if (i == 0) this.Terms0.push(cell);
                else if (i == 1) this.Terms1.push(cell);
                else if (i == 2) this.Terms2.push(cell);
                else if (i == 3) this.Terms3.push(cell);
            }
        }
        //console.log("Terms0", this.Terms0); console.log("Terms1", this.Terms1); console.log("Terms2", this.Terms2); console.log("Terms3", this.Terms3);
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
        //console.log("There are ", this.numberOfGroups, "different groups and ", TermDates.length, "different dates")
        this.AllTerms = new Array<CellM_T[]>();
        //this makes a 2D array called AllTerms in which every row stands for date, and every column for group
        for (var i = 0; i < TermDates.length; i++) {
            this.AllTerms[i] = new Array<CellM_T>();
            for (var j = 0; j < this.ActiveGroups.length; j++) {
                var cell: CellM_T = new CellM_T();
                cell.x = i;
                cell.y = j;
                var person = new MyUserM_T();
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
        function successFunc(data: Term2DTO[], status) {
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
    public updateTermArrays = (i_: number, j_: number) => {
        //console.log("updating Term Arrays for:", i_, "|", j_);
        //i_ = 0; j_ = 0;
        var helper = "";
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 5; j++) {
                var cell = this.AllTerms[i_ + i][j_ + j];
                cell.x = i;
                cell.y = j;
                if (i == 0) {
                    this.Terms0[j].UserPerson=cell.UserPerson;
                    this.Terms0[j].SkipState=cell.SkipState;
                    this.Terms0[j].TakeState=cell.SkipState;
                    this.Terms0[j].TermDate=cell.TermDate;
                    this.Terms0[j].x = cell.x;
                    this.Terms0[j].y = cell.y;
                    this.Terms0[j].Group=cell.Group;
                }
                else if (i == 1) {
                    this.Terms1[j].UserPerson=cell.UserPerson;
                    this.Terms1[j].SkipState=cell.SkipState;
                    this.Terms1[j].TakeState=cell.SkipState;
                    this.Terms1[j].TermDate=cell.TermDate;
                    this.Terms1[j].x = cell.x;
                    this.Terms1[j].y = cell.y;
                    this.Terms1[j].Group=cell.Group;
                }
                else if (i == 2) {
                    this.Terms2[j].UserPerson=cell.UserPerson;
                    this.Terms2[j].SkipState=cell.SkipState;
                    this.Terms2[j].TakeState=cell.SkipState;
                    this.Terms2[j].TermDate=cell.TermDate;
                    this.Terms2[j].x = cell.x;
                    this.Terms2[j].y = cell.y;
                    this.Terms2[j].Group=cell.Group;
                }
                else if (i == 3) {
                    this.Terms3[j].UserPerson=cell.UserPerson;
                    this.Terms3[j].SkipState=cell.SkipState;
                    this.Terms3[j].TakeState=cell.SkipState;
                    this.Terms3[j].TermDate=cell.TermDate;
                    this.Terms3[j].x = cell.x;
                    this.Terms3[j].y = cell.y;
                    this.Terms3[j].Group=cell.Group;
                }
            }
        }
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
        var course = new Course2DTO();
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
        console.log("updating web data for row ", i.toString(), " with this data ", termsX);

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
        //console.log("Updating group web data");
        var self = this;
        if (self.ActiveGroups.length == 0) {
            console.log("Nema pronadjenih grupa");
            return;
        }
        var offset = 0;
        for (var i = offset; i < self.ActiveGroups.length; i++){
            //console.log(self.ActiveGroups[i]);
            var groupNameId = "#groupName" + i.toString();
            var groupOwnerId = "#groupOwner" + i.toString();
            var groupNameValue = self.ActiveGroups[i].Name;
            var groupOwnerValue = self.ActiveGroups[i].UserPerson.Name + " " + self.ActiveGroups[i].UserPerson.LastName;
            //console.log("filling ", groupOwnerId, " with ", groupOwnerValue);
            $(groupNameId).text(groupNameValue);
            $(groupOwnerId).text(groupOwnerValue);
        }
        if (offset + self.ActiveGroups.length < 5) {
            for (var i = offset + self.ActiveGroups.length; i < 5; i++) {
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
        this.moveY++;
        if (this.checkValidMovement(this.moveX, this.moveY))
        {
            this.disableRight=false;
            //this.updateTermArrays(this.moveX, this.moveY);
        }
        else {
            this.handleWrongMove();
            this.moveY--;
            this.disableLeft=true;
        }
    }
    public rightClicked = () => {
        this.moveY--;
        if (this.checkValidMovement(this.moveX, this.moveY)) {
            this.updateTermArrays(this.moveX, this.moveY);
            this.disableLeft=false;
        }
        else {
            this.handleWrongMove();
            this.moveY++;
            this.disableRight=true;
        }
    }
    public upClicked = () => {
        this.moveX++;
        if (this.checkValidMovement(this.moveX, this.moveY)) {
            this.updateTermArrays(this.moveX, this.moveY);
            this.disableDown=false;
        }
        else {
            this.handleWrongMove();
            this.moveX--;
            this.disableUp=true;
        }        
    }
    public downClicked = () => {
        this.moveX--;
        if (this.checkValidMovement(this.moveX, this.moveY)) {
            this.updateTermArrays(this.moveX, this.moveY);
            this.disableUp=false;
        }
        else {
            this.handleWrongMove();
            this.moveX++;
            this.disableDown=true;
        }
    }
    public handleWrongMove = () => {
        console.log("Wrong move!");
    }
    public checkValidMovement = (moveX: number, moveY: number) => {
        //console.log(this.moveX, this.moveY);
        if (moveX >= 0 && moveX + 4 <= this.numberOfTerms
            && moveY >= 0 && moveY + 5 <= this.numberOfGroups
        ) {
            console.log("true");
            return true;
        }
        else {
            console.log("false");
            return false;
        }
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
    public LoginCheck = () => {
        var loginDataCookie = this.CheckCookie("LoginData");
        if (loginDataCookie != "") {
            var loginData = new LoginDataSBM2();
            loginData.Username = loginDataCookie.split(' ')[0];
            loginData.Password = loginDataCookie.split(' ')[1];
            this.getUser(loginData.Username);
        }
        else {
            alert(this.warning_not_logged_in);
            location.href = this.link_main + this.link_login;
        }
    }
    public UserCheck = () => {
        if (this.ActiveUser != null) {
            if (this.ActiveUser.Role == "A") {
                this.ActivateAdministrator();
            }
            else {
                this.ActivateRegularUser();
            }
        }
        else {
            alert(this.warning_not_logged_in);
            location.href = this.link_main + this.link_login;
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
        this.Terms0[0].UserPerson.Username="lalala";
    }
}
class MyUserM_T {
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
class MyUser2DTO {
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
    public UserPerson: MyUserM_T;
    public GroupId: number;
    public Group: GroupM_T;    
    public TermDate: string;    
}
class Term2DTO {
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
    public UserPerson : MyUserM_T;    
}
class Course2DTO {
    public Id: number;
    public Name: string;
    public Study: string;
    public Leader: string;
    public Asistant: string;
    public TermT: TermM_T[][];    
}
class CourseM_T {
    public Id : number;
    public Name : string;
    public Study : string;
    public Leader : string;
    public Asistant : string;
    public TermT : TermM_T[][]; 
}
class GroupM_T {
    public Id : number;
    public Name: string;
    public OwnerId: number;
    public CourseId: number;
    public UserPerson: MyUserM_T;
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
class LoginDataSBM2 {
    public Username: string;
    public Password: string;
}

