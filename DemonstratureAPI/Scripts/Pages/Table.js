$(document).ready(function () {
    var tableVM = new TableVM();
});
var TableVM = (function () {
    //------------------------------------FUNCTIONS------------------------------------//
    function TableVM() {
        var _this = this;
        //------------------------------------TERM----------------------------------//
        this.Terms0 = new Array();
        this.Terms1 = new Array();
        this.Terms2 = new Array();
        this.Terms3 = new Array();
        this.ActiveTerms = new Array();
        this.AllUsers = new Array();
        this.BlankUser = new MyUserM_T({ Id: '0', Username: 'blank', FullName: '-', Role: 'D' });
        this.BlankGroup = new GroupM_T({ Id: '0', Name: '-', OwnerId: '0', CourseId: '0', UserPerson: this.BlankUser });
        //------------------------------------PRIMITIVE------------------------------//
        this.disableLeft = false;
        this.disableRight = true;
        this.disableUp = false;
        this.disableDown = true;
        //-------------------------------------primitive-----------------------------------//
        this.moveX = 0;
        this.moveY = 0;
        this.numberOfGroups = 0;
        this.numberOfTerms = 0;
        this.notification_no_available_data = "Nema podataka";
        this.notification_no_term_owner = "-";
        this.notification_no_group_owner = "Nema";
        this.notification_no_group_name = "Nema";
        //-------------------------------USERS START------------------------------------------------//
        this.getAllUsers = function () {
            var self = _this;
            var serviceURL = '/Table/AllUsers';
            $.ajax({
                type: "GET",
                url: serviceURL,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data, status) {
                //alert(data);
                self.Users = data;
                console.log(self.Users);
                console.log(status);
            }
            function errorFunc() {
                alert('error');
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
                self.createFullTermData();
            }
            function errorFunc(data) {
                console.log('error getting data about all groups for course with id', courseId, "\nreason:\n", data);
            }
        };
        //-------------------------------USERS END--------------------------------------------------//
        //---------------------------------------------------------------------------------------//
        //---------------------------------------------------------------------------------------//
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
                //console.log(self.Courses);
                self.populateSelectStudy();
            }
            function errorFunc() {
                alert('error');
            }
        };
        this.populateSelectStudy = function () {
            //console.log("pupulating select study");
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
            _this.populateSelectCourseName(selectStudyValue);
            //this.updateValuesAfterSelect(); // mislim da tu ne treba
        };
        this.populateSelectCourseName = function (studyName) {
            //console.log("pupulating select course");
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
            _this.updateValuesAfterSelect();
        };
        //-------------------------------COURSE END--------------------------------------------------//
        //---------------------------------------------------------------------------------------//
        //---------------------------------------------------------------------------------------//
        //-------------------------------TERM START------------------------------------------------//
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
        this.fillAllTerms = function () {
            //console.log("filling all terms");
            var stringResult = "";
            var flags = [], TermDates = [], foundDate;
            for (var i = 0; i < _this.ActiveTerms.length; i++) {
                foundDate = false;
                if (TermDates.length == 0) {
                    TermDates.push(_this.ActiveTerms[i].TermDate);
                    continue;
                }
                for (var j = 0; j < TermDates.length; j++) {
                    if (TermDates[j] == _this.ActiveTerms[i].TermDate) {
                        foundDate = true;
                    }
                }
                if (foundDate) {
                    TermDates.push(_this.ActiveTerms[i].TermDate);
                }
            }
            _this.numberOfTerms = TermDates.length;
            _this.numberOfGroups = _this.ActiveGroups.length;
            _this.AllTerms = new Array();
            for (var i = 0; i < TermDates.length; i++) {
                _this.AllTerms[i] = new Array();
                for (var j = 0; j < _this.ActiveGroups.length; j++) {
                    var cell = new CellM_T();
                    cell.x = i;
                    cell.y = j;
                    //console.log(i, j);
                    if (i == 0 && j == 0) {
                    }
                    cell.UserPerson = _this.ActiveTerms[i].UserPerson;
                    //var jsonDate = this.ActiveTerms[i].TermDate.toString();
                    //console.log("jsonDate", jsonDate);
                    //var date = jsonDate.split('.');
                    //cell.TermDate = date[0] + "." + date[1] + "." + date[2];
                    cell.TermDate = _this.ActiveTerms[i].TermDate.getDate() + "." +
                        (_this.ActiveTerms[i].TermDate.getMonth() + 1) + "." +
                        _this.ActiveTerms[i].TermDate.getFullYear() + ".";
                    cell.Group = _this.ActiveTerms[i].Group;
                    _this.AllTerms[i][j] = cell;
                }
            }
            //console.log("All Terms:", this.AllTerms);
            _this.createTermTable();
        };
        this.createTermTable = function () {
            for (var i = 0; i < _this.AllTerms.length; i++) {
                for (var j = 0; j < _this.ActiveGroups.length; j++) {
                    var cell = new CellM_T();
                    cell.x = i;
                    cell.y = j;
                    cell.UserPerson = new MyUserM_T(_this.AllTerms[i][j].UserPerson);
                    var jsonDate = _this.AllTerms[i][j].TermDate.toString();
                    var date = jsonDate.split('.');
                    cell.TermDate = date[0] + "." + date[1] + "." + date[2];
                    cell.Group = _this.AllTerms[i][j].Group;
                    if (i == 0)
                        _this.Terms0.push(cell);
                    else if (i == 1)
                        _this.Terms1.push(cell);
                    else if (i == 2)
                        _this.Terms2.push(cell);
                    else if (i == 3)
                        _this.Terms3.push(cell);
                }
            }
            //console.log(this.Terms0); console.log(this.Terms1); console.log(this.Terms2); console.log(this.Terms3);
            _this.updateWebData(_this.Terms0, 0);
            _this.updateWebData(_this.Terms1, 1);
            _this.updateWebData(_this.Terms2, 2);
            _this.updateWebData(_this.Terms3, 3);
        };
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
                var realDate = parseInt(date.toString().substr(6, date.toString().trim().length - 8));
                var realDate2 = new Date(realDate);
                /*date conversion end*/
                _this.ActiveTerms[i].TermDate = realDate2;
                _this.ActiveTerms[i].UserId = _this.EmptyTerms[i].UserId;
            }
            for (var i = 0; i < _this.ActiveTerms.length; i++) {
                for (var j = 0; j < _this.ActiveUsers.length; j++) {
                    if (_this.ActiveTerms[i].UserId == _this.ActiveUsers[j].Id) {
                        _this.ActiveTerms[i].UserPerson = _this.ActiveUsers[j];
                    }
                    else {
                        _this.ActiveTerms[i].UserPerson = _this.BlankUser;
                    }
                }
                for (var j = 0; j < _this.ActiveGroups.length; j++) {
                    if (_this.ActiveTerms[i].GroupId == _this.ActiveGroups[j].Id) {
                        _this.ActiveTerms[i].Group = _this.ActiveGroups[j];
                    }
                    else {
                        _this.ActiveTerms[i].Group = _this.BlankGroup;
                    }
                }
            }
            //console.log("Active Terms", this.ActiveTerms);
            if (_this.Terms0.length > 0) {
                console.log("self.Terms0.length>0");
            }
            else {
                console.log("self.Terms0.length=0");
                _this.fillAllTerms();
            }
        };
        this.updateTermTable = function (data) {
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
                        _this.Terms0.push(cell);
                    else if (i == 1)
                        _this.Terms1.push(cell);
                    else if (i == 2)
                        _this.Terms2.push(cell);
                    else if (i == 3)
                        _this.Terms3.push(cell);
                }
            }
        };
        this.updateTermArrays = function (i_, j_) {
            console.log("clicked stuff:", i_, "|", j_);
            //i_ = 0; j_ = 0;
            var helper = "";
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 5; j++) {
                    var cell = _this.AllTerms[i_ + i][j_ + j];
                    cell.x = i;
                    cell.y = j;
                    if (i == 0) {
                        _this.Terms0[j].UserPerson = cell.UserPerson;
                        _this.Terms0[j].SkipState = cell.SkipState;
                        _this.Terms0[j].TakeState = cell.SkipState;
                        _this.Terms0[j].TermDate = cell.TermDate;
                        _this.Terms0[j].x = cell.x;
                        _this.Terms0[j].y = cell.y;
                        _this.Terms0[j].Group = cell.Group;
                    }
                    else if (i == 1) {
                        _this.Terms1[j].UserPerson = cell.UserPerson;
                        _this.Terms1[j].SkipState = cell.SkipState;
                        _this.Terms1[j].TakeState = cell.SkipState;
                        _this.Terms1[j].TermDate = cell.TermDate;
                        _this.Terms1[j].x = cell.x;
                        _this.Terms1[j].y = cell.y;
                        _this.Terms1[j].Group = cell.Group;
                    }
                    else if (i == 2) {
                        _this.Terms2[j].UserPerson = cell.UserPerson;
                        _this.Terms2[j].SkipState = cell.SkipState;
                        _this.Terms2[j].TakeState = cell.SkipState;
                        _this.Terms2[j].TermDate = cell.TermDate;
                        _this.Terms2[j].x = cell.x;
                        _this.Terms2[j].y = cell.y;
                        _this.Terms2[j].Group = cell.Group;
                    }
                    else if (i == 3) {
                        _this.Terms3[j].UserPerson = cell.UserPerson;
                        _this.Terms3[j].SkipState = cell.SkipState;
                        _this.Terms3[j].TakeState = cell.SkipState;
                        _this.Terms3[j].TermDate = cell.TermDate;
                        _this.Terms3[j].x = cell.x;
                        _this.Terms3[j].y = cell.y;
                        _this.Terms3[j].Group = cell.Group;
                    }
                }
            }
            console.log("terms0 userperson:", _this.Terms0[0].UserPerson);
        };
        this.updateValuesAfterSelect = function () {
            //console.log("updating values after select");
            var selectStudy = $('#selectStudy').val();
            var selectCourse = $('#selectCourse').val();
            var self = _this;
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
        };
        this.updateWebData = function (termsX, x) {
            var i = x;
            console.log("updating web data for row ", i.toString(), " with this data ", termsX);
            var dateLabelId = "#date" + i.toString();
            var termOwnerLabelId = "#termOwner";
            var groupOwnerLabelId = "#groupOwner";
            var groupNameLabelId = "#groupName";
            if (termsX.length != 0) {
                var date = termsX[0].TermDate;
                $(dateLabelId).text(date);
                $(groupOwnerLabelId).text(_this.notification_no_group_owner);
                for (var j = 0; j < 5; j++) {
                    termOwnerLabelId += i.toString() + j.toString();
                    groupOwnerLabelId += j.toString();
                    groupNameLabelId += j.toString();
                    var termOwner = "";
                    var groupOwner = "";
                    var groupName = "";
                    if (termsX.length <= j) {
                        termOwner = _this.notification_no_term_owner;
                        groupOwner = _this.notification_no_group_owner;
                        groupName = _this.notification_no_group_name;
                    }
                    else {
                        termOwner = termsX[j].UserPerson.FullName;
                        groupOwner = termsX[j].Group.UserPerson.FullName;
                        groupName = termsX[j].Group.Name;
                    }
                    $(termOwnerLabelId).text(termOwner);
                    $(groupOwnerLabelId).text(groupOwner);
                    $(groupNameLabelId).text(groupName);
                    //console.log("[", i, "],[", j, "]","\nTerm Owner:", termOwner,"\nGroup Owner:", groupOwner,"\nGroup Name:", groupName);
                    //console.log("[", i, "],[", j, "]", "\nTerm Owner Id:", termOwnerLabelId, "\nGroup Owner Id:", groupOwnerLabelId, "\nGroup Name Id:", groupNameLabelId);
                    termOwnerLabelId = "#termOwner";
                }
            }
            else {
                $(dateLabelId).text(_this.notification_no_available_data);
                for (var j = 0; j < 5; j++) {
                    termOwnerLabelId += i.toString() + j.toString();
                    groupOwnerLabelId += j.toString();
                    groupNameLabelId += j.toString();
                    var termOwner = _this.notification_no_term_owner;
                    var groupOwner = _this.notification_no_group_owner;
                    var groupName = _this.notification_no_group_name;
                    $(termOwnerLabelId).text(termOwner);
                    $(groupOwnerLabelId).text(groupOwner);
                    $(groupNameLabelId).text(groupName);
                    //console.log("[", i, "],[", j, "]","\nTerm Owner:", termOwner,"\nGroup Owner:", groupOwner,"\nGroup Name:", groupName);
                    termOwnerLabelId = "#termOwner";
                }
            }
        };
        //-------------------------------TERM END---------------------------------------------------//
        //---------------------------------------------------------------------------------------//
        //---------------------------------------------------------------------------------------//
        //-------------------------------GROUP START------------------------------------------------//
        this.getGroupsByCourseId = function (courseId) {
            //console.log("getting groups for", selectGroupId, "and needNew is", needsNew.toString());
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
        //-------------------------------GROUP END--------------------------------------------------//
        //---------------------------------------------------------------------------------------//
        //---------------------------------------------------------------------------------------//
        //-------------------------------NAVIGATION START-------------------------------------------//
        this.leftClicked = function () {
            _this.moveY++;
            if (_this.checkValidMovement(_this.moveX, _this.moveY)) {
                _this.disableRight = false;
            }
            else {
                _this.handleWrongMove();
                _this.moveY--;
                _this.disableLeft = true;
            }
        };
        this.rightClicked = function () {
            _this.moveY--;
            if (_this.checkValidMovement(_this.moveX, _this.moveY)) {
                _this.updateTermArrays(_this.moveX, _this.moveY);
                _this.disableLeft = false;
            }
            else {
                _this.handleWrongMove();
                _this.moveY++;
                _this.disableRight = true;
            }
        };
        this.upClicked = function () {
            _this.moveX++;
            if (_this.checkValidMovement(_this.moveX, _this.moveY)) {
                _this.updateTermArrays(_this.moveX, _this.moveY);
                _this.disableDown = false;
            }
            else {
                _this.handleWrongMove();
                _this.moveX--;
                _this.disableUp = true;
            }
        };
        this.downClicked = function () {
            _this.moveX--;
            if (_this.checkValidMovement(_this.moveX, _this.moveY)) {
                _this.updateTermArrays(_this.moveX, _this.moveY);
                _this.disableUp = false;
            }
            else {
                _this.handleWrongMove();
                _this.moveX++;
                _this.disableDown = true;
            }
        };
        this.handleWrongMove = function () {
            console.log("Wrong move!");
        };
        this.checkValidMovement = function (moveX, moveY) {
            //console.log(this.moveX, this.moveY);
            if (moveX >= 0 && moveX + 4 <= _this.numberOfTerms
                && moveY >= 0 && moveY + 5 <= _this.numberOfGroups) {
                console.log("true");
                return true;
            }
            else {
                console.log("false");
                return false;
            }
        };
        //-------------------------------NAVIGATION END---------------------------------------------//
        this.test = function () {
            _this.Terms0[0].UserPerson.Username = "lalala";
        };
        var self = this;
        $(document).ready(function () {
            self.getAllCourses();
            //this.getAllUsers();
            //this.setTodayDate();
            $('#selectStudy').on("change", function () {
                var value = $(this).val();
                self.populateSelectCourseName(value);
            });
            $('#selectCourse').on("change", function () {
                console.log("selectCourse changed");
                self.updateValuesAfterSelect();
            });
            //navigation
            $('#arrowLeft').on("click", function () {
                console.log("lalaa");
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
            $('#myUl').css("visibility", "visible");
        });
    }
    return TableVM;
}());
var MyUserM_T = (function () {
    function MyUserM_T(myUser) {
        if (myUser) {
            this.Id = myUser.Id;
            this.Username = myUser.Username;
            this.FullName = myUser.FullName;
            this.Role = myUser.Role;
        }
    }
    return MyUserM_T;
}());
var MyUser2DTO = (function () {
    function MyUser2DTO() {
    }
    return MyUser2DTO;
}());
var TermM_T = (function () {
    function TermM_T() {
    }
    return TermM_T;
}());
var Term2DTO = (function () {
    function Term2DTO() {
        this.TermDate = new Date();
    }
    return Term2DTO;
}());
var CellM_T = (function () {
    function CellM_T() {
    }
    return CellM_T;
}());
var Course2DTO = (function () {
    function Course2DTO() {
    }
    return Course2DTO;
}());
var CourseM_T = (function () {
    function CourseM_T() {
    }
    return CourseM_T;
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
