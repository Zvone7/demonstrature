$(document).ready(function () {
    //var tableVM: TableVM = new TableVM();
    //ko.applyBindings(tableVM);
    //tableVM.getAllCourses();
});
//patiš se sa micanjem gore dolje..zabavica
var Table_VM = (function () {
    //------------------------------------FUNCTIONS------------------------------------//
    function Table_VM() {
        var _this = this;
        //---------------------------------OBSERVABLES------------------------------//
        this.Terms0 = ko.observableArray();
        this.Terms1 = ko.observableArray();
        this.Terms2 = ko.observableArray();
        this.Terms3 = ko.observableArray();
        this.allTerms = ko.observableArray();
        this.Users = ko.observableArray();
        this.YO = ko.observable();
        //------------------------------------TERM----------------------------------//
        this.Terms0_no = new Array();
        this.Terms1_no = new Array();
        this.Terms2_no = new Array();
        this.Terms3_no = new Array();
        this.ActiveTerms = new Array();
        this.AllUsers = new Array();
        this.BlankUser = new UserM_T({ Id: '0', Username: 'blank', Name: 'Prazan', LastName: 'termin', Role: 'D' });
        this.BlankGroupOwner = new UserM_T({ Id: '0', Username: 'blank', Name: 'Nema', LastName: 'vlasnika', Role: 'D' });
        this.BlankGroup = new GroupM_T({ Id: '0', Name: '-', OwnerId: '0', CourseId: '0', UserPerson: this.BlankUser });
        //------------------------------------PRIMITIVE------------------------------//
        this.disableLeft = false;
        this.disableRight = false;
        this.disableUp = false;
        this.disableDown = false;
        //-------------------------------------primitive-----------------------------------//
        this.position_verti = 0;
        this.position_horiz = 0;
        this.numberOfGroups = 0;
        this.numberOfTerms = 0;
        this.numberOfTermsBeforeToday = 0;
        this.notification_no_available_data = "Nema podataka";
        this.notification_no_term_owner = "Prazan termin_2";
        this.notification_no_group_owner = "Nema";
        this.notification_no_group_name = "Ne postoji";
        this.warning_password_match = "Provjerite lozinku!";
        this.warning_not_logged_in = "Molim ulogirajte se!";
        this.link_main = "http://localhost:49977";
        this.link_settings = "/Settings/Settings";
        this.link_table = "/Table/Table";
        this.link_login = "/Login/Login";
        //-------------------------------USERS START------------------------------------------------//
        this.getAllUsers = function () {
            //console.log("getting all users");
            var self = _this;
            var serviceURL = '/Settings/GetUsers';
            $.ajax({
                type: "GET",
                url: serviceURL,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data, status) {
                self.Users_no = data;
            }
            function errorFunc(data) {
                console.log('error getting data about all users', data);
            }
        };
        this.getUsersByCourseId = function (courseId) {
            //console.log("getting users by course Id");
            var self = _this;
            var serviceURL = '/Settings/GetUsersByCourseId';
            $.ajax({
                type: "GET",
                url: serviceURL + "?courseId=" + courseId,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data, status) {
                self.ActiveUsers = new Array();
                //console.log("users by course id:",data);
                self.ActiveUsers = data;
                self.updateSelectUser();
                self.updateGroupData();
                self.createFullTermData();
            }
            function errorFunc(data) {
                console.log('error getting data about all groups for course with id', courseId, "\nreason:\n", data);
            }
        };
        this.getUser = function (username) {
            var self = _this;
            var serviceURL = '/Settings/UserByUsername';
            $.ajax({
                type: "GET",
                url: serviceURL + "?username=" + username,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data, status) {
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
        };
        //-------------------------------USERS END--------------------------------------------------//
        //------------------------------------------------------------------------------------------//
        //------------------------------------------------------------------------------------------//
        //-------------------------------COURSE START-----------------------------------------------//
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
                self.Courses = data;
                ko.applyBindings(self);
                //console.log(self.Courses);
                self.populateSelectStudy();
            }
            function errorFunc() {
                alert('error');
            }
        };
        this.populateSelectStudy = function () {
            //console.log("populating select study");
            var studies = [];
            var output = [];
            for (var i = 0; i < _this.Courses.length; i++) {
                var x = _this.Courses[i].Study;
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
            _this.populateSelectCourse(selectStudyValue);
            //this.updateValuesAfterSelect(); // mislim da tu ne treba
        };
        this.populateSelectCourse = function (studyName) {
            //console.log("populating select course");
            var output = [];
            var names = [];
            for (var i = 0; i < _this.Courses.length; i++) {
                var study = _this.Courses[i].Study;
                var course = _this.Courses[i].Name;
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
                if (_this.Courses[i].Name != "" && _this.Courses[i].Name != null) {
                    output.push('<option value="' + names[i] + '">' + names[i] + '</option>');
                }
            }
            $('#selectCourse').html(output.join(''));
            _this.updateTermValuesAfterSelect();
        };
        //-------------------------------COURSE END-------------------------------------------------//
        //------------------------------------------------------------------------------------------//
        //------------------------------------------------------------------------------------------//
        //-------------------------------TERM START-------------------------------------------------//
        this.createFullTermData = function () {
            //console.log("creating full term data");
            //console.log("Empty terms", this.EmptyTerms);
            //console.log("Active Users", this.ActiveUsers);
            //console.log("Active Groups", this.ActiveGroups);
            _this.ActiveTerms = new Array();
            for (var i = 0; i < _this.EmptyTerms.length; i++) {
                _this.ActiveTerms[i] = new TermM_T();
                _this.ActiveTerms[i].Id = _this.EmptyTerms[i].Id;
                _this.ActiveTerms[i].CourseId = _this.EmptyTerms[i].CourseId;
                _this.ActiveTerms[i].Course = _this.Course;
                /*start date conversion*/
                var date = _this.EmptyTerms[i].TermDate;
                /*date conversion end*/
                _this.ActiveTerms[i].TermDate = date;
                _this.ActiveTerms[i].UserId = _this.EmptyTerms[i].UserId;
                _this.ActiveTerms[i].GroupId = _this.EmptyTerms[i].GroupId;
            }
            for (var i = 0; i < _this.ActiveTerms.length; i++) {
                for (var j = 0; j < _this.ActiveUsers.length; j++) {
                    if (_this.ActiveTerms[i].UserId == _this.ActiveUsers[j].Id) {
                        _this.ActiveTerms[i].UserPerson = _this.ActiveUsers[j];
                        break;
                    }
                    else {
                        _this.ActiveTerms[i].UserPerson = _this.BlankUser;
                    }
                }
                for (var j = 0; j < _this.ActiveGroups.length; j++) {
                    if (_this.ActiveTerms[i].GroupId == _this.ActiveGroups[j].Id) {
                        _this.ActiveTerms[i].Group = _this.ActiveGroups[j];
                        break;
                    }
                    else {
                        _this.ActiveTerms[i].Group = _this.BlankGroup;
                    }
                }
            }
            //console.log("Active Terms", this.ActiveTerms);
            if (_this.Terms0_no.length > 0) {
                console.log("self.Terms0.length>0, 303 red!!");
                //self.updateTermTable();
            }
            else {
                console.log("self.Terms0.length=0");
                _this.fillAllTerms();
            }
        };
        this.createTermTable = function () {
            //console.log("creating term table");
            //console.log("allTerms", this.AllTerms);
            //console.log("activeGroups", this.ActiveGroups);
            for (var i = _this.position_verti; i < _this.AllTerms.length; i++) {
                for (var j = 0; j < _this.ActiveGroups.length; j++) {
                    var cell = new CellM_T();
                    //console.log(i, j);
                    cell.x = i;
                    cell.y = j;
                    cell.UserId = _this.AllTerms[i][j].UserId;
                    cell.UserPerson = new UserM_T(_this.AllTerms[i][j].UserPerson);
                    var jsonDate = _this.AllTerms[i][j].TermDate.toString();
                    var date = jsonDate.split('.');
                    cell.TermDate = date[0] + "." + date[1] + "." + date[2];
                    //console.log("created cell ", cell);
                    cell.Group = _this.AllTerms[i][j].Group;
                    if (i == 0 + _this.position_verti)
                        _this.Terms0_no.push(cell);
                    else if (i == 1 + _this.position_verti)
                        _this.Terms1_no.push(cell);
                    else if (i == 2 + _this.position_verti)
                        _this.Terms2_no.push(cell);
                    else if (i == 3 + _this.position_verti)
                        _this.Terms3_no.push(cell);
                }
            }
            //console.log("Terms0", this.Terms0); console.log("Terms1", this.Terms1); console.log("Terms2", this.Terms2); console.log("Terms3", this.Terms3);
            _this.setInitialNavigation();
            _this.updateGroupWebData();
            _this.updateTermWebData(_this.Terms0_no, 0);
            _this.updateTermWebData(_this.Terms1_no, 1);
            _this.updateTermWebData(_this.Terms2_no, 2);
            _this.updateTermWebData(_this.Terms3_no, 3);
        };
        this.fillAllTerms = function () {
            //console.log("filling all terms");
            var stringResult = "";
            var flags = [], TermDates = [], foundDate;
            //this part determines how many different dates there are
            for (var i = 0; i < _this.ActiveTerms.length; i++) {
                foundDate = false;
                for (var j = 0; j < TermDates.length; j++) {
                    if (TermDates[j] == _this.ActiveTerms[i].TermDate) {
                        foundDate = true;
                    }
                }
                if (!foundDate) {
                    TermDates.push(_this.ActiveTerms[i].TermDate);
                }
            }
            //end
            _this.numberOfTerms = TermDates.length;
            _this.numberOfGroups = _this.ActiveGroups.length;
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
                var dateFormated = new Date(parseInt(year_), parseInt(month_) - 1, parseInt(day_));
                //console.log(dateFormated, "\n\n", today);
                if (dateFormated < today) {
                    _this.position_verti++;
                }
            }
            //console.log("there are ", this.position_verti, " terms which are before today");
            _this.numberOfTermsBeforeToday = _this.position_verti;
            //console.log("There are ", this.numberOfGroups, "different groups and ", TermDates.length, "different dates")
            _this.AllTerms = new Array();
            //this makes a 2D array called AllTerms in which every row stands for date, and every column for group
            for (var i = 0; i < TermDates.length; i++) {
                _this.AllTerms[i] = new Array();
                for (var j = 0; j < _this.ActiveGroups.length; j++) {
                    var cell = new CellM_T();
                    cell.x = i;
                    cell.y = j;
                    var person = new UserM_T();
                    for (var k = 0; k < _this.ActiveTerms.length; k++) {
                        var t = _this.ActiveTerms[k];
                        if (t.TermDate == TermDates[i] && t.GroupId == _this.ActiveGroups[j].Id) {
                            person = t.UserPerson;
                        }
                    }
                    cell.UserPerson = person;
                    cell.UserId = person.Id;
                    cell.TermDate = TermDates[i];
                    cell.Group = _this.ActiveGroups[j];
                    _this.AllTerms[i][j] = cell;
                }
            }
            //console.log("All Terms:", this.AllTerms);
            _this.createTermTable();
        };
        this.getTermsByCourseId = function (courseId) {
            //console.log("getting terms by course Id");
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
                self.EmptyTerms = data;
                self.getGroupsByCourseId(courseId);
            }
            function errorFunc(data) {
                console.log('error getting data about all terms for course with id', courseId, "\nreason:\n", data);
            }
        };
        this.setInitialTermValues = function () {
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
        };
        this.updateSelectUser = function () {
            //console.log("populating select user");
            //console.log("Active Users:\n",this.ActiveUsers);
            var output = [];
            output.push('<option value="' + "0" + '">' + "Odaberite demonstratora" + '</option>');
            if (_this.ActiveUsers == null) {
                $(selectId).find('option').remove().end();
                $(selectId).html(output.join(''));
                return;
            }
            for (var i = 0; i < _this.ActiveUsers.length; i++) {
                //console.log("filling search")
                var name = _this.ActiveUsers[i].Name + " " + _this.ActiveUsers[i].LastName;
                var id = _this.ActiveUsers[i].Id;
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
        };
        this.updateTermArrays = function () {
            var j_ = _this.position_horiz;
            var i_ = _this.position_verti;
            console.log("updating Term Arrays for:", i_, "|", j_);
            var helper = "";
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 5; j++) {
                    var cell = _this.AllTerms[i_ + i][j_ + j];
                    cell.x = i;
                    cell.y = j;
                    if (i == 0 + _this.position_verti) {
                        _this.Terms0_no[j].UserPerson = cell.UserPerson;
                        _this.Terms0_no[j].SkipState = cell.SkipState;
                        _this.Terms0_no[j].TakeState = cell.SkipState;
                        _this.Terms0_no[j].TermDate = cell.TermDate.substring(0, 9);
                        _this.Terms0_no[j].x = cell.x;
                        _this.Terms0_no[j].y = cell.y;
                        _this.Terms0_no[j].Group = cell.Group;
                    }
                    else if (i == 1) {
                        _this.Terms1_no[j].UserPerson = cell.UserPerson;
                        _this.Terms1_no[j].SkipState = cell.SkipState;
                        _this.Terms1_no[j].TakeState = cell.SkipState;
                        _this.Terms1_no[j].TermDate = cell.TermDate.substring(0, 9);
                        _this.Terms1_no[j].x = cell.x;
                        _this.Terms1_no[j].y = cell.y;
                        _this.Terms1_no[j].Group = cell.Group;
                    }
                    else if (i == 2) {
                        _this.Terms2_no[j].UserPerson = cell.UserPerson;
                        _this.Terms2_no[j].SkipState = cell.SkipState;
                        _this.Terms2_no[j].TakeState = cell.SkipState;
                        _this.Terms2_no[j].TermDate = cell.TermDate.substring(0, 9);
                        _this.Terms2_no[j].x = cell.x;
                        _this.Terms2_no[j].y = cell.y;
                        _this.Terms2_no[j].Group = cell.Group;
                    }
                    else if (i == 3) {
                        _this.Terms3_no[j].UserPerson = cell.UserPerson;
                        _this.Terms3_no[j].SkipState = cell.SkipState;
                        _this.Terms3_no[j].TakeState = cell.SkipState;
                        _this.Terms3_no[j].TermDate = cell.TermDate.substring(0, 9);
                        _this.Terms3_no[j].x = cell.x;
                        _this.Terms3_no[j].y = cell.y;
                        _this.Terms3_no[j].Group = cell.Group;
                    }
                }
            }
            _this.updateTermWebData(_this.Terms0_no, 0);
            _this.updateTermWebData(_this.Terms1_no, 1);
            _this.updateTermWebData(_this.Terms2_no, 2);
            _this.updateTermWebData(_this.Terms3_no, 3);
            _this.updateGroupWebData();
            //console.log("terms0 userperson:", this.Terms0[0].UserPerson);
        };
        this.updateTermTable = function (data) {
            //console.log("updating Term Table");
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[0].length; j++) {
                    var cell = new CellM_T();
                    cell.x = i;
                    cell.y = j;
                    cell.UserPerson = data[i][j].UserPerson;
                    var jsonDate = data[i][j].TermDate.toString();
                    var date = new Date(parseInt(jsonDate.substr(6)));
                    cell.TermDate = date.getDate() + "." +
                        (date.getMonth()).toString() + "." +
                        date.getFullYear().toString();
                    cell.Group = data[i][j].Group;
                    if (i == 0)
                        _this.Terms0_no.push(cell);
                    else if (i == 1)
                        _this.Terms1_no.push(cell);
                    else if (i == 2)
                        _this.Terms2_no.push(cell);
                    else if (i == 3)
                        _this.Terms3_no.push(cell);
                }
            }
        };
        this.updateTermValuesAfterSelect = function () {
            //console.log("------------\nupdating term values after select");
            var selectStudy = $('#selectStudy').val();
            var selectCourse = $('#selectCourse').val();
            var self = _this;
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
        };
        this.updateTermWebData = function (termsX, x) {
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
                        termOwner = _this.notification_no_term_owner;
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
                $(dateLabelId).text(_this.notification_no_available_data);
                for (var j = 0; j < 5; j++) {
                    termOwnerLabelId += i.toString() + j.toString();
                    var termOwner = _this.notification_no_term_owner;
                    $(termOwnerLabelId).text(termOwner);
                    //console.log("[", i, "],[", j, "]","\nTerm Owner:", termOwner,"\nGroup Owner:", groupOwner,"\nGroup Name:", groupName);
                    termOwnerLabelId = "#termOwner";
                }
            }
        };
        //-------------------------------TERM END---------------------------------------------------//
        //------------------------------------------------------------------------------------------//
        //------------------------------------------------------------------------------------------//
        //-------------------------------GROUP START------------------------------------------------//
        this.getGroupsByCourseId = function (courseId) {
            //console.log("getting groups for", courseId);
            var self = _this;
            var serviceURL = '/Settings/GetGroupsByCourseId';
            $.ajax({
                type: "GET",
                url: serviceURL + "?courseId=" + courseId,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data, status) {
                self.ActiveGroups = new Array();
                self.ActiveGroups = data;
                //console.log("active groups", self.ActiveGroups);
                self.getUsersByCourseId(courseId);
            }
            function errorFunc(data) {
                console.log('error getting data about all groups for course with id', courseId, "\nreason:\n", data);
            }
        };
        this.updateGroupData = function () {
            //console.log("Updating group data");
            var self = _this;
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
        };
        this.updateGroupWebData = function () {
            _this.checkValidMovement();
            //console.log("Updating group web data, this.position_horiz", this.position_horiz);
            var self = _this;
            if (self.ActiveGroups.length == 0) {
                console.log("Nema pronadjenih grupa");
                return;
            }
            for (var i = 0; i < self.ActiveGroups.length - 1; i++) {
                //console.log(self.ActiveGroups[i]);
                var groupNameId = "#groupName" + i.toString();
                var groupOwnerId = "#groupOwner" + i.toString();
                var groupNameValue = self.ActiveGroups[i + _this.position_horiz].Name;
                var groupOwnerValue = self.ActiveGroups[i + _this.position_horiz].UserPerson.Name + " " + self.ActiveGroups[i + _this.position_horiz].UserPerson.LastName;
                //console.log("filling ", groupOwnerId, " with ", groupOwnerValue);
                //console.log(i, ":", groupNameValue, groupOwnerValue);
                $(groupNameId).text(groupNameValue);
                $(groupOwnerId).text(groupOwnerValue);
            }
            if (self.ActiveGroups.length < 5) {
                for (var i = self.ActiveGroups.length - 1; i < 5; i++) {
                    var groupNameId = "#groupName" + i.toString();
                    var groupOwnerId = "#groupOwner" + i.toString();
                    var groupNameValue = self.notification_no_group_name;
                    var groupOwnerValue = self.notification_no_group_owner;
                    $(groupNameId).text(groupNameValue);
                    $(groupOwnerId).text(groupOwnerValue);
                }
            }
        };
        //-------------------------------GROUP END--------------------------------------------------//
        //------------------------------------------------------------------------------------------//
        //------------------------------------------------------------------------------------------//
        //-------------------------------NAVIGATION START-------------------------------------------//
        this.leftClicked = function () {
            _this.position_horiz--;
            if (_this.checkValidMovement()) {
                _this.disableRight = false;
                if (_this.position_horiz == 0) {
                    _this.disableLeft = true;
                }
                _this.updateTermArrays();
                _this.updateNavigationClasses();
            }
            else {
                _this.disableLeft = true;
                _this.position_horiz++;
                _this.handleWrongMove();
            }
        };
        this.rightClicked = function () {
            _this.position_horiz++;
            if (_this.checkValidMovement()) {
                _this.disableLeft = false;
                if (_this.position_horiz == _this.numberOfGroups - 5) {
                    _this.disableRight = true;
                }
                _this.updateTermArrays();
                _this.updateNavigationClasses();
            }
            else {
                _this.disableRight = true;
                _this.disableLeft = false;
                _this.position_horiz--;
                _this.handleWrongMove();
            }
        };
        this.upClicked = function () {
            _this.position_verti++;
            if (_this.checkValidMovement()) {
                _this.disableDown = false;
                if (_this.position_verti == (_this.numberOfTerms - _this.numberOfTermsBeforeToday)) {
                    _this.disableDown = true;
                }
                _this.updateTermArrays();
                _this.updateNavigationClasses();
            }
            else {
                _this.disableUp = true;
                _this.position_verti--;
                _this.handleWrongMove();
            }
        };
        this.downClicked = function () {
            _this.position_verti--;
            if (_this.checkValidMovement()) {
                _this.disableUp = false;
                if (_this.position_verti == (-1 * _this.numberOfTermsBeforeToday)) {
                    _this.disableUp = true;
                }
                _this.updateTermArrays();
                _this.updateNavigationClasses();
            }
            else {
                _this.disableDown = true;
                _this.position_verti++;
                _this.handleWrongMove();
            }
        };
        this.handleWrongMove = function () {
            console.log("*********************\nWrong move!\n*********************");
            _this.updateNavigationClasses();
        };
        this.updateNavigationClasses = function () {
            console.log("updating navigation classes");
            console.log("left:", !_this.disableLeft);
            console.log("right:", !_this.disableRight);
            console.log("up:", !_this.disableUp);
            console.log("down:", !_this.disableDown);
            if (_this.disableLeft) {
                $("#arrowLeft").attr('class', 'arrowLeftDisabled');
            }
            else {
                $("#arrowLeft").attr('class', 'arrowLeft');
            }
            if (_this.disableRight) {
                $("#arrowRight").attr('class', 'arrowRightDisabled');
            }
            else {
                $("#arrowRight").attr('class', 'arrowRight');
            }
            if (_this.disableUp) {
                $("#arrowUp").attr('class', 'arrowUpDisabled');
            }
            else {
                $("#arrowUp").attr('class', 'arrowUp');
            }
            if (_this.disableDown) {
                $("#arrowDown").attr('class', 'arrowDownDisabled');
            }
            else {
                $("#arrowDown").attr('class', 'arrowDown');
            }
        };
        this.checkValidMovement = function () {
            console.log("vertical position:\n", _this.position_verti, "/", _this.numberOfTerms, "\nhorizontal position\n", _this.position_horiz, "/", _this.numberOfGroups);
            console.log("vertical upper limit:", _this.numberOfTerms - _this.numberOfTermsBeforeToday - 4);
            console.log("vertical lower limit:", -1 * _this.numberOfTermsBeforeToday);
            if (_this.position_verti >= (-1 * _this.numberOfTermsBeforeToday) &&
                _this.position_verti < (_this.numberOfTerms - _this.numberOfTermsBeforeToday - 4)
                &&
                    _this.position_horiz >= 0 &&
                _this.position_horiz + 5 <= _this.numberOfGroups) {
                console.log("true");
                return true;
            }
            else {
                console.log("Invalid move!");
                return false;
            }
        };
        this.setInitialNavigation = function () {
            //console.log("setting inital navigation");
            $("#arrowLeft").attr('class', 'arrowLeft');
            $("#arrowRight").attr('class', 'arrowRight');
            $("#arrowUp").attr('class', 'arrowUp');
            $("#arrowDown").attr('class', 'arrowDown');
            if (_this.position_horiz == 0) {
                _this.disableLeft = true;
                $("#arrowLeft").attr('class', 'arrowLeftDisabled');
            }
            if (_this.numberOfGroups <= 5) {
                _this.disableRight = true;
                $("#arrowRight").attr('class', 'arrowRightDisabled');
            }
            if (_this.position_verti == 0) {
                _this.disableUp = true;
                $("#arrowUp").attr('class', 'arrowUpDisabled');
            }
            if (_this.numberOfTerms <= 4) {
                _this.disableDown = true;
                $("#arrowDown").attr('class', 'arrowDownDisabled');
            }
        };
        //-------------------------------NAVIGATION END---------------------------------------------//
        //------------------------------------------------------------------------------------------//
        //------------------------------------------------------------------------------------------//
        //-----------------------AUTHORIZATION & AUTHENTICATION START-------------------------------//
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
        this.ActivateAdministrator = function () {
            $("#adminSettings").css("visibility", "visible");
            _this.getAllCourses();
            _this.setInitialTermValues();
        };
        this.ActivateRegularUser = function () {
            $("#adminSettings").css("visibility", "collapse");
        };
        //-----------------------AUTHORIZATION & AUTHENTICATION END---------------------------------//
        //------------------------------------------------------------------------------------------//
        //-------------------------------EVERYTHING ELSE START--------------------------------------//
        this.setTodayDate = function () {
            var realDate2 = new Date();
            var year = realDate2.getFullYear().toString();
            var month = (realDate2.getMonth() + 1).toString();
            var day = realDate2.getDate().toString();
            var month = _this.minTwoDigits(parseInt(month));
            var day = _this.minTwoDigits(parseInt(day));
            //console.log(day, month, year);
            $("#term_date").val(year + "-" + month + "-" + day);
        };
        this.minTwoDigits = function (n) {
            return (n < 10 ? '0' : '') + n;
        };
        //-------------------------------EVERYTHING ELSE END----------------------------------------//
        //------------------------------------------------------------------------------------------//
        this.test = function () {
            _this.YO("new");
            console.log("updating observable");
        };
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
                    self.Terms0_no = new Array();
                    self.Terms1_no = new Array();
                    self.Terms2_no = new Array();
                    self.Terms3_no = new Array();
                    self.position_horiz = 0;
                    self.position_verti = 0;
                    self.updateTermValuesAfterSelect();
                }
                else if (this.id.lastIndexOf("search") != '-1') {
                    var i = parseInt(this.id.substring(6, 7));
                    var j = parseInt(this.id.substring(7, 8));
                }
            });
            //navigation
            $('#logout').on("click", function () {
                self.LogOut();
            });
            $('#test').on("click", function () {
                self.test();
            });
            $('#arrowLeft').on("click", function () {
                self.leftClicked();
            });
            $('#arrowRight').on("click", function () {
                self.rightClicked();
            });
            $('#arrowUp').on("click", function () {
                self.upClicked();
            });
            $('#arrowDown').on("click", function () {
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
    return Table_VM;
}());
var UserM_T = (function () {
    function UserM_T(myUser) {
        if (myUser) {
            this.Id = myUser.Id;
            this.Username = myUser.Username;
            this.Name = myUser.Name;
            this.LastName = myUser.LastName;
            this.Role = myUser.Role;
        }
    }
    return UserM_T;
}());
var UserDTO_T = (function () {
    function UserDTO_T() {
    }
    return UserDTO_T;
}());
var TermM_T = (function () {
    function TermM_T() {
    }
    return TermM_T;
}());
var TermDTO_T = (function () {
    function TermDTO_T() {
    }
    return TermDTO_T;
}());
var CellM_T = (function () {
    function CellM_T() {
    }
    return CellM_T;
}());
var CourseM_T = (function () {
    function CourseM_T() {
    }
    return CourseM_T;
}());
var CourseDTO_T = (function () {
    function CourseDTO_T() {
    }
    return CourseDTO_T;
}());
var GroupM_T = (function () {
    function GroupM_T(group) {
        if (group) {
            this.Id = group.Id;
            this.Name = group.Name;
            this.OwnerId = group.OwnerId;
            this.CourseId = group.CourseId;
            this.UserPerson = group.UserPerson;
        }
    }
    return GroupM_T;
}());
var LoginDataM_T = (function () {
    function LoginDataM_T() {
    }
    return LoginDataM_T;
}());
//# sourceMappingURL=Table.js.map