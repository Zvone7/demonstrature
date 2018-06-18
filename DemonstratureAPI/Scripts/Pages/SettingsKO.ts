$(document).ready(() => {
    var s = new SettingsVM();
    //s.LoginCheck();
    //s.populateSelectStudy();
    s.allocation();
    ko.applyBindings(s);
    s.getInitialData();
});

//possible bugs:
// adding term to already same date

class SettingsVM {
    //----------------------------------default values------------------------------//
    //public defaultTextButtonSkip = defaultTextButtonSkip;
    //public defaultTextButtonTake = defaultTextButtonTake;
    public defaultCourseName = defaultCourseName;
    public defaultDate = defaultDate;
    public defaultGroupName = defaultGroupName;
    public defaultId = defaultId;
    public defaultStudyName = defaultStudyName;
    public defaultUserLastName = defaultUserLastName;
    public defaultUserName = defaultUserName;
    public defaultUserRole = defaultUserRole;
    public defaultUserUsername = defaultUserUsername;


    //-------------------------------------primitive-----------------------------------//
    public Courses: CourseDTO_S[];
    public Users: UserDTO_S[];
    public ActiveUser: UserDTO_S;
    public CourseCourse: CourseDTO_S;
    public Groups: GroupDTO_S[];
    public GroupOwners: UserDTO_S[];
    public Terms: TermDTO_S[];
    public LoginData: LoginDataM_S;

    //---------------------------------OBSERVABLES------------------------------//
    public Users_KO = ko.observableArray<KoUser>();
    public SelectedUser_KO = ko.observable<KoUser>(new KoUser());
    public UserCourses_KO = ko.observableArray<KoCourse>();
    public Courses_KO = ko.observableArray<KoCourse>();
    public BlankString = ko.observable<string>("");

    public warning_blank_field = "Molim popunite sva polja!";
    public warning_delete_new = "Pogreska pri odabiru";
    public warning_password_match = "Provjerite lozinku!";
    public warning_not_logged_in = "Molim ulogirajte se!";

    public link_main = "http://localhost:49977";
    public link_settings = "/Settings/Settings";
    public link_table = "/Table/Table";
    public link_login = "/Login/Login";


    public YO = ko.observable<string>("i have an initial value");


    constructor() {
        var self = this;
        //console.log("constructor: settings");
        $(document).ready(function () {
            //ko.applyBindings(self);


            $('#test').on("click", () => {
                self.test();
            });

            if ($("#adminSettings").length >= 1) {
                self.ActivateAdministrator();
            }
            else {
                self.ActivateRegularUser();
            }

            $('#logout').on("click", () => {
                self.LogOut();
            });



            //password update
            $('#password_save').on("click", () => {
                self.button_savePassword();
            });

            //add/edit user form
            $('#user_save').on("click", () => {
                self.button_saveUser();
            });
            $('#user_delete').on("click", () => {
                self.button_deleteUser();
            });
            $('#user_user_select').on("change", () => {
                var value = $('#user_user_select').val();
                self.updateUserData(value);
            });
            $('#user_role_select').on("change", () => {
                var value = $('#user_user_select').val();
                self.SelectedUser_KO().Role = value;
            });

            //add/edit course form
            $('#course_course_select').on("change", () => {
                self.updateCourseData();
            });
            $('#course_delete').on("click", () => {
                self.button_deleteCourse();
            });
            $('#course_save').on("click", () => {
                self.button_saveCourse();
            });
            $('#course_study_select').on("change", () => {
                var value = $("#course_study_select").val();
                self.populateSelectCourseName("#course_course_select", value, true);
            });

            //add/edit group form
            $('#group_course_select').on("change", () => {
                self.getGroupsByCourseId("#group_group_select", "#group_course_select", true, false);
            });
            $('#group_delete').on("click", () => {
                self.button_deleteGroup();
            });
            $('#group_group_select').on("change", () => {
                self.updateGroupData();
            });
            $('#group_save').on("click", () => {
                self.button_saveGroup();
            });
            $('#group_study_select').on("change", () => {
                //console.log("hello2");
                var value = $("#group_study_select").val();
                self.populateSelectCourseName("#group_course_select", value, false);
                self.getGroupsByCourseId("#group_group_select", "#group_course_select", true, false);
            });

            //add/edit term form
            $('#term_course_select').on("change", () => {
                //console.log("hello2");
                var value = $("#term_course_select").val();
                self.getGroupsByCourseId("#term_group_select", "#term_course_select", false, true);
                self.populateSelectTerm();
            });
            $('#term_delete').on("click", () => {
                self.button_deleteTerm();
            });
            $('#term_group_select').on("change", () => {
                self.getTermsByGroupId();
                self.updateTermData();
            });
            $('#term_save').on("click", () => {
                self.button_saveTerm();
            });
            $('#term_study_select').on("change", () => {
                var value = $("#term_study_select").val();
                self.populateSelectCourseName("#term_course_select", value, false);
                self.getGroupsByCourseId("#term_group_select", "#term_course_select", false, true);
                self.getTermsByCourseId();
            });
            $('#term_term_select').on("change", () => {
                self.updateTermData();
            });
            $("#term_date").datepicker();


            //$('#myUl').css("visibility", "visible");

        });
    }

    public allocation = () => {
        var self = this;
        //console.log("allocation");

        //var user = ko.observable<KoUser>(new KoUser());
        //user().Id = 0;
        //user().LastName(self.defaultUserLastName);
        //user().Name(self.defaultUserName);
        //user().Role(self.defaultUserRole);
        //user().Username("Novi korisnik");
        //self.Users_KO().push(user());

        self.SelectedUser_KO(new KoUser());
        self.SelectedUser_KO().Id = 0;

        //var course = ko.observable<KoCourse>(new KoCourse());
        //course().Id = self.defaultId;
        //course().Name(self.defaultCourseName);
        //course().Study(self.defaultStudyName);
        //self.Courses_KO().push(course());

        //var study = ko.observable<KoStudy>(new KoStudy());
        //study().Name(self.defaultStudyName);
        //study().Id = self.defaultId;
        //self.Studies([]);
        //self.Studies().push(study());


        //var demonstrator = ko.observable<KoDemonstrator>(new KoDemonstrator(self.defaultUserName, self.defaultId));
        //self.Demonstrators([]);
        //self.Demonstrators().push(demonstrator());


        //var suggestedUser = ko.observable<KoUser>(new KoUser());
        //suggestedUser().Id = 0;
        //suggestedUser().LastName(self.defaultUserLastName);
        //suggestedUser().Name(self.defaultUserName);
        //suggestedUser().Role(self.defaultUserRole);
        //suggestedUser().Username(self.defaultUserUsername);

        //var group = ko.observable<KoGroup>(new KoGroup());
        //group().CourseId = self.defaultId;
        //group().Id = self.defaultId;
        //group().Name(self.defaultGroupName);
        //group().OwnerId = self.defaultId;
        //group().Owner = user;

        //self.dummyTerm = ko.observable<KoTerm>(new KoTerm());
        //self.dummyTerm().Course = course;
        //self.dummyTerm().CourseId = course().Id;
        //self.dummyTerm().User = user;
        //self.dummyTerm().UserId = user().Id;
        //self.dummyTerm().Group = group;
        //self.dummyTerm().GroupId = group().Id;
        //self.dummyTerm().Id = 0;
        //self.dummyTerm().TermDate(self.defaultDate);
        //self.dummyTerm().SuggestedUser = suggestedUser;
        //self.dummyTerm().SuggestedUserId(suggestedUser().Id);


    }

    public getInitialData = () => {
        var self = this;
        // get users
        self.getAllUsers();
        self.getAllCourses();
    }

    //---------------------------------------------------------------------------------------//
    //-------------------------------BUTTONS START-------------------------------------------//
    //#region Buttons

    public button_saveCourse = () => {
        var studySelect = $("#course_study_select :selected").text();
        var courseSelect = $("#course_course_select :selected").text();
        var courseSelectId = $("#course_course_select :selected").val();
        var courseName = $("#course_name").val();
        var courseProf = $("#course_prof").val();
        var courseAsis = $("#course_asis").val();
        if (courseName == "" || courseProf == "" || courseAsis == "") {
            alert(this.warning_blank_field);
            return;
        }
        if (courseSelect == "Novi kolegij") {
            var nc: CourseM_S = new CourseM_S();
            nc.Id = 0;
            nc.Name = courseName;
            nc.Professor = courseProf;
            nc.Asistant = courseAsis;
            nc.Study = studySelect;
            this.createCourse(nc);
        }
        else {
            var nc: CourseM_S = new CourseM_S();
            nc.Id = courseSelectId;
            nc.Name = courseName;
            nc.Professor = courseProf;
            nc.Asistant = courseAsis;
            nc.Study = studySelect;
            this.updateCourse(nc);
        }
    }
    public button_deleteCourse = () => {
        var courseId = $("#course_course_select :selected").val();
        if (courseId == 0) {
            alert(this.warning_delete_new);
        }
        else {
            this.deleteCourse(courseId);
        }
    }

    public button_saveUser = () => {
        var self = this;
        var userId = $("#user_user_select :selected").val();
        //console.log(userId);
        var changingPassword = false;

        var password = $("#user_password").val().trim();
        var passwordAgain = $("#user_password_again").val().trim();

        if (self.SelectedUser_KO().Username == self.BlankString ||
            self.SelectedUser_KO().LastName == self.BlankString ||
            self.SelectedUser_KO().Name == self.BlankString) {
            alert(this.warning_blank_field);
            return;
        }

        if (password != "" || passwordAgain != "") {
            //this means that administrator is trying to change the password
            changingPassword = true;
        }

        var userCourses: KoCourse[] = new Array<KoCourse>();
        // get user courses
        var children = $("#user_user_course").find(':checkbox');
        for (var j = 0; j < children.length; j++) {
            var ch = children[j];
            if ($("#" + ch.id).is(":checked")) {
                //console.log(ch);
                var helper = ch.id.toString();
                var courseIdString = helper.substring(helper.length - 1, helper.length);
                var courseId = parseInt(courseIdString);
                for (var i = 0; i < self.Courses_KO().length; i++) {
                    var c = self.Courses_KO()[i];
                    if (c.Id == courseId) {
                        userCourses.push(c);
                    }
                }

            }
        }

        //if adding a new user
        if (userId == 0) {
            console.log("creating new user");
            self.SelectedUser_KO().Id = 0;
            if (password == "" || passwordAgain == "") {
                alert(this.warning_blank_field);
                return;
            }
            else {
                if (password != passwordAgain) {
                    alert(this.warning_password_match);
                    return;
                }
                self.SelectedUser_KO().Password = password;
            }
        }
        //if updating old user
        else {
            if (!changingPassword) {
                console.log("updating user without pass");
                self.SelectedUser_KO().Password = self.BlankString;
            }
            else {
                console.log("updating user with pass");
                if (password == "" || passwordAgain == "") {
                    alert(this.warning_blank_field);
                    return;
                }
                else {
                    if (password != passwordAgain) {
                        alert(this.warning_password_match);
                        return;
                    }
                    self.SelectedUser_KO().Password(password);
                }
            }
        }
        self.SelectedUser_KO().Courses = userCourses;
        this.createOrUpdateUser(self.SelectedUser_KO());

    }
    public button_deleteUser = () => {
        var userId = $("#user_user_select :selected").val();
        if (userId == 0) {
            alert(this.warning_delete_new);
        }
        else {
            this.deleteUser(userId);
        }
    }

    public button_saveGroup = () => {
        var groupId = $("#group_group_select").val();
        var name = $("#group_name").val();
        var ownerId = $("#group_owner_select").val();
        var courseId = $("#group_course_select").val();

        var g = new GroupDTO_S();
        g.Name = name;
        g.CourseId = courseId;
        g.OwnerId = ownerId;

        if (groupId == "0") {
            console.log("making a new group");
            g.Id = 0;
            this.createGroup(g);
        }
        else {
            console.log("updating existing group");
            g.Id = groupId;
            this.updateGroup(g);
        }
    }
    public button_deleteGroup = () => {
        var groupId = $("#group_group_select").val();
        if (groupId == "0") {
            alert(this.warning_delete_new);
        }
        else {
            this.deleteGroup(groupId);
        }
    }

    public button_saveTerm = () => {
        var termId = $("#term_term_select").val();
        var termDate = $("#term_date").val();
        var courseId = $("#term_course_select").val();
        var groupId = $("#term_group_select").val();

        var tmonth = termDate.split('/')[0];
        var tday = termDate.split('/')[1];
        var tyear = termDate.split('/')[2];
        tmonth = parseInt(tmonth);
        tday = parseInt(tday);
        tyear = parseInt(tyear);
        termDate = tday + "." + tmonth + "." + tyear;

        var t = new TermDTO_S();
        t.CourseId = courseId;
        t.TermDate = termDate;
        t.GroupId = groupId;
        console.log(t);
        if (termDate == "" || groupId == "" || courseId == "") {
            alert(this.warning_blank_field);
            return;
        }
        if (groupId == "-1" && termId == "0") {
            //console.log("Making a new term for all groups");
            t.Id = 0;
            //console.log(t);
            this.createTerms(t);
        }
        else if (groupId == "-1" && termId != "0") {
            //console.log("Updating all terms for date");
            t.Id = 0;
            this.updateTerms(t);
        }
        else if (groupId != "-1" && termId == "0") {
            //console.log("Making a new term for specific course");
            t.Id = 0;
            console.log(t);
            this.createTerm(t);
        }
        else {
            //console.log("updating existing term");
            t.Id = termId;
            this.updateTerm(t);
        }
    }
    public button_deleteTerm = () => {
        var termId = $("#term_term_select").val();
        var termDate = $("#term_date").val();
        var courseId = $("#term_course_select").val();
        var groupId = $("#term_group_select").val();

        var tmonth = termDate.split('/')[0];
        var tday = termDate.split('/')[1];
        var tyear = termDate.split('/')[2];
        tmonth = parseInt(tmonth);
        tday = parseInt(tday);
        tyear = parseInt(tyear);
        termDate = tday + "." + tmonth + "." + tyear;

        if (termId == "0") {
            alert(this.warning_delete_new);
        }
        else if (groupId == "-1") {
            console.log("deleting terms for all groups", t);
            var t = new TermDTO_S();
            t.CourseId = courseId;
            t.TermDate = termDate;
            t.GroupId = groupId;
            t.Id = 0;
            this.deleteTerms(t);
        }
        else {
            console.log("deleting term per single group");
            this.deleteTerm(termId);
        }
    }

    public button_savePassword = () => {
        var self = this;
        var userId = self.ActiveUser.Id;
        //console.log(userId);
        var oldPassword = $("#old_password").val().trim();
        var password = $("#password").val().trim();
        var passwordAgain = $("#password_again").val().trim();

        if (password == "" || passwordAgain == "") {
            alert(this.warning_blank_field);
            return;
        }
        else {
            if (password != passwordAgain) {
                alert(this.warning_password_match);
                return;
            }
        }
        self.checkIfCorrectPassword(userId, oldPassword, password);
        return;

    }

    //-------------------------------BUTTONS END---------------------------------------------//
    //---------------------------------------------------------------------------------------//
    //---------------------------------------------------------------------------------------//
    //-------------------------------COURSES START-------------------------------------------//
    public createCourse = (c: CourseM_S) => {
        var self = this;
        var serviceURL = '/Course/CreateCourse';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: c,
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data, status) {
            console.log("Succesfully created course.", data, status);
            self.getAllCourses();
        }
        function errorFunc() {
            console.log('Error creating new course');
        }
    }
    public createCourseCheckboxesForView = (userId: number) => {
        var container = document.getElementById("user_user_course");
        $("#user_user_course").text("");
        if (userId == 0) {
            //new user
            //give him all the checkboxes  
            for (var i = 0; i < this.Courses_KO().length; i++) {
                var c = this.Courses_KO()[i];
                var checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.name = c.Study + " " + c.Name;
                checkbox.value = c.Id.toString();
                checkbox.id = "id";
                checkbox.defaultChecked = false;
                checkbox.className = "checkbox1";

                container.appendChild(checkbox);
                this.setCheckboxHtmlValues(c);
            }
        }
        else {
            this.getUserCourses(userId);
            // calls createCourseCheckboxesForExistingUser when requests finishes
        }
    }
    public createCourseCheckboxesForExistingUser = (userId: number) => {
        var container = document.getElementById("user_user_course");
        $("#user_user_course").text("");
        for (var i = 0; i < this.Courses_KO().length; i++) {
            var c = this.Courses_KO()[i];
            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.name = c.Study + " " + c.Name;
            checkbox.value = c.Id.toString();
            checkbox.id = "user_user_course_" + userId + "_" + c.Id;
            checkbox.className = "checkbox1";

            for (var j = 0; j < this.UserCourses_KO().length; j++) {
                var uc = this.UserCourses_KO()[j];
                if (uc.Id == c.Id) {
                    checkbox.defaultChecked = true;
                }
            }
            container.appendChild(checkbox);
            this.setCheckboxHtmlValues(c);
        }
    }
    public setCheckboxHtmlValues = (c) => {
        var container = document.getElementById("user_user_course");
        var label = document.createElement('label')
        label.htmlFor = "id";
        label.className = "identifier-bold";
        label.appendChild(document.createTextNode(c.Name));

        var label2 = document.createElement('label')
        label2.htmlFor = "id";
        label2.className = "identifier-small";
        label2.appendChild(document.createTextNode("" + c.Study));

        container.appendChild(label);
        container.innerHTML += "<br />";
        container.appendChild(label2);
        container.innerHTML += "<br /><br />";
    }
    public deleteCourse = (courseId: number) => {
        var self = this;
        var serviceURL = '/Course/Delete';
        $.ajax({
            type: "DELETE",
            url: serviceURL,
            data: courseId,
            success: successFunc,
            error: errorFunc
        });
        function successFunc(status) {
            console.log("course deleted!");
            self.getAllCourses();
        }
        function errorFunc(data) {
            console.log('error deleting course');
        }
    }
    public getAllCourses = () => {
        //console.log("gettingAllCourses");
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
            for (var i = 0; i < data.length; i++) {
                var crs = ko.observable<KoCourse>(data[i]);
                self.Courses_KO.push(crs());
            }
            self.createCourseCheckboxesForView(0);
            //self.populateSelectStudy("#course_study_select");
            //self.populateSelectStudy("#group_study_select");
            //self.populateSelectStudy("#term_study_select");
            //self.createCourseCheckboxes(0);
            //self.getGroupsByCourseId("#group_group_select", "#group_course_select", true, false);
            //self.getGroupsByCourseId("#term_group_select", "#term_course_select", false, true);
        }
        function errorFunc() {
            console.log('error getting data about all courses');
        }
    }
    public updateCourse = (c: CourseM_S) => {
        var self = this;
        var serviceURL = '/Course/Update';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: c,
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data, status) {
            if (status == "success") {
                console.log("Succesfully updated course.");
                self.getAllCourses();
            }
            else {
                console.log('Error updating course(1)');
            }
        }
        function errorFunc() {
            console.log('Error updating course(2)');
        }
    }
    public updateCourseData = () => {
        var courseId = $("#course_course_select :selected").val();
        if (courseId == "Novi kolegij") {
            $("#course_name").val("");
            $("#course_prof").val("");
            $("#course_asis").val("");
            return;
        }
        for (var i = 0; i < this.Courses.length; i++) {
            if (this.Courses[i].Id == courseId) {
                var cc = this.Courses[i];
                $("#course_name").val(cc.Name);
                $("#course_prof").val(cc.Professor);
                $("#course_asis").val(cc.Asistant);
                return;
            }
        }
    }
    //-------------------------------COURSES END---------------------------------------------//
    //---------------------------------------------------------------------------------------//
    //---------------------------------------------------------------------------------------//
    //-------------------------------USER START----------------------------------------------//
    public createOrUpdateUser = (user: KoUser) => {
        var self = this;
        var serviceURL = '/User/CreateOrUpdate';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: user,
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data, status) {
            console.log("Succesfully created user.", data, status);
            self.getAllCourses();
            self.getAllUsers();
        }
        function errorFunc() {
            console.log('Error creating new user');
        }
    }
    public checkIfCorrectPassword(userId: number, oldPassword: string, newPassword: string) {
        var self = this;
        var pu: PasswordUpdaterM_S = new PasswordUpdaterM_S();
        pu.Password = oldPassword;
        pu.UserId = userId;
        var serviceURL = '/User/CheckCorrectPass';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: pu,
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data, status) {
            if (data == true) {
                pu.Password = newPassword;
                self.updateUserPassword(pu);
            }
            else {
                console.log("Stara lozinka netocna!");
                $("#old_password").val("");
                $("#password").val("");
                $("#password_again").val("");
                return;
            }
        }
        function errorFunc(data, status) {
            console.log('Error checking password', data, status);
        }
    }
    public deleteUser = (userId: number) => {
        var self = this;
        var serviceURL = '/User/Delete';
        $.ajax({
            type: "DELETE",
            url: serviceURL + "?userId=" + userId,
            success: successFunc,
            error: errorFunc
        });
        function successFunc(status) {
            console.log("user deleted!");
            self.getAllCourses();
            self.getAllUsers();
        }
        function errorFunc(data) {
            console.log('error deleting user');
        }
    }
    public getAllUsers = () => {
        //console.log("getting all users");
        var self = this;
        var serviceURL = '/User/All';
        $.ajax({
            type: "GET",
            url: serviceURL,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data: KoUser[], status) {
            for (var i = 0; i < data.length; i++) {
                var usr = ko.observable<KoUser>(data[i]);
                self.Users_KO.push(usr());
            }
        }
        function errorFunc(data) {
            console.log('error getting data about all users', data);
        }
    }
    public getUser = (username: string) => {
        var self = this;
        var serviceURL = '/User/ByUsername';
        $.ajax({
            type: "GET",
            url: serviceURL + "?username=" + username,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data: UserDTO_S, status) {
            if (data != null) {
                self.ActiveUser = new UserDTO_S();
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
    public getUserCourses = (userId: number) => {
        var self = this;
        var serviceURL = '/User/Courses';
        $.ajax({
            type: "GET",
            url: serviceURL + "?userId=" + userId,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data, status) {
            for (var i = 0; i < data.length; i++) {
                var course = ko.observable<KoCourse>(data[i]);
                self.UserCourses_KO().push(course());
            }
            self.createCourseCheckboxesForExistingUser(userId);
        }
        function errorFunc(data) {
            console.log('error getting data about user courses');
        }
    }
    public populateSelectUser = () => {
        //console.log("populating select user");
        var selectId = "#user_user_select";
        var users = this.Users;
        var output = [];
        $(selectId).find('option').remove().end();
        output.push('<option value="' + "0" + '">' + "Novi korisnik" + '</option>');
        for (var i = 0; i < users.length; i++) {
            output.push('<option value="' + users[i].Id + '">' + users[i].LastName + " " + users[i].Name + '</option>');
        }
        $(selectId).html(output.join(''));
    }
    public updateUserData = (id: number) => {
        //console.log("updatingUserData:", id);
        if (this.Users_KO != null) {
            for (var i = 0; i < this.Users_KO().length; i++) {
                if (id == this.Users_KO()[i].Id) {
                    //console.log("here", this.SelectedUser_KO());
                    this.SelectedUser_KO(this.Users_KO()[i]);
                    console.log("here", this.SelectedUser_KO());
                    $("#user_select_role").val(this.SelectedUser_KO().Role);
                    this.createCourseCheckboxesForView(this.SelectedUser_KO().Id);
                }
            }
        }
    }
    public updateUserPassword = (pu: PasswordUpdaterM_S) => {
        var self = this;
        var serviceURL = '/User/UpdatePass';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: pu,
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data, status) {
            if (status == "success") {
                console.log("Succesfully updated user password.");
                self.getAllCourses();
                self.getAllUsers();
                $("#old_password").val("");
                $("#password").val("");
                $("#password_again").val("");
            }
            else {
                console.log('Error updating user password(1)');
                $("#password").val("");
                $("#password_again").val("");
            }
        }
        function errorFunc() {
            console.log('Error updating user password(2)');
            $("#password").val("");
            $("#password_again").val("");
        }
    }
    //-------------------------------USER END------------------------------------------------//
    //---------------------------------------------------------------------------------------//
    //---------------------------------------------------------------------------------------//
    //-------------------------------GROUP START---------------------------------------------//
    public createGroup = (g: GroupDTO_S) => {
        //console.log("creating group");
        var self = this;
        //console.log(obj);
        var serviceURL = '/Group/Create';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: g,
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data, status) {
            if (data != null) {
                console.log("Succesfully created group.", data, status);
                self.getAllCourses();
            }
            else {
                console.log('Error creating new group(1)');

            }
        }
        function errorFunc() {
            console.log('Error creating new group');
        }
    }
    public deleteGroup = (groupId: number) => {
        console.log("deleting group");
        var self = this;
        //console.log(obj);
        var serviceURL = '/Group/Delete';
        $.ajax({
            type: "DELETE",
            url: serviceURL + "?id=" + groupId,
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data, status) {
            if (status == "success" && data == true) {
                console.log("group deleted!", data, status);
                self.getAllCourses();
            }
            else {
                console.log('error deleting group(1)');
            }
        }
        function errorFunc(data) {
            console.log('error deleting group');
        }
    }
    public getGroupData = (groupId) => {
        //console.log("getting group data");
        var self = this;
        var serviceURL = '/Group/Get';
        $.ajax({
            type: "GET",
            url: serviceURL + "?groupId=" + groupId,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data: GroupDTO_S, status) {
            var group = data;
            $("$group_owner_select").val(group.OwnerId);
        }
        function errorFunc() {
            console.log('error getting data about selected group');
        }

    }
    public getGroupsByCourseId = (selectGroupId: string, selectCourseId: string, needsNew: boolean, isTermSelect: boolean) => {
        //console.log("getting groups for", selectGroupId, "and needNew is", needsNew.toString());
        var courseId = $(selectCourseId).val();
        if (selectGroupId == "#group_group_select") {
            $("#group_name").val("");
        }
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
        function successFunc(data: GroupDTO_S[], status) {
            self.Groups = data;
            //console.log("------------------");console.log("courseSelectId: ", selectCourseId);console.log("groupSelectId: ", selectGroupId);console.log("groups: ", self.Groups);
            self.populateSelectGroup(selectGroupId, needsNew, isTermSelect);
        }
        function errorFunc(data) {
            console.log('error getting data about all groups for course with id', courseId, "\nreason:\n", data);
        }

    }
    public getGroupsPossibleOwners = () => {
        //console.log("getting groups possible owners");
        var courseId = $('#group_course_select').val();
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
        function successFunc(data: UserDTO_S[], status) {
            self.GroupOwners = data;
            self.populateGroupOwners();
        }
        function errorFunc() {
            console.log('error getting data about all groups');
        }
    }
    public populateSelectGroup = (selectId: string, needsNew: boolean, isTermSelect: boolean) => {
        //console.log("populating group select: ", selectId);
        var output = [];
        if (needsNew) output.push('<option value="' + "0" + '">' + "Nova grupa" + '</option>');
        if (isTermSelect) output.push('<option value="' + "-1" + '">' + "Sve grupe ovog kolegija" + '</option>');
        for (var i = 0; i < this.Groups.length; i++) {
            var name = this.Groups[i].Name;
            var id = this.Groups[i].Id;
            output.push('<option value="' + id.toString() + '">' + name + '</option>');
        }
        $(selectId).find('option').remove().end();
        $(selectId).html(output.join(''));
        if (selectId == "#group_group_select") { this.getGroupsPossibleOwners(); }
        if (selectId == "#term_group_select") { this.getTermsByGroupId(); }
    }
    public populateGroupOwners = () => {
        //console.log("populating group owners");
        var selectId = "#group_owner_select";
        var users = this.GroupOwners;
        var output = [];
        $(selectId).find('option').remove().end();
        output.push('<option value="0">' + "Nema vlasnika" + '</option>');

        for (var i = 0; i < users.length; i++) {
            output.push('<option value="' + users[i].Id + '">' + users[i].LastName + " " + users[i].Name + '</option>');
        }
        //console.log(output);
        $(selectId).html(output.join(''));
        var groupId = $("#group_group_select").val();
        if (groupId != "0") {
            this.getGroupData(groupId);
        }
    }
    public updateGroup = (g: GroupDTO_S) => {
        var self = this;
        var serviceURL = '/Group/Update';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: g,
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data, status) {
            if (status == "success" && data == true) {
                console.log("Succesfully updated group.");
                $("#group_group_select").val(g.Id);
                self.getAllCourses();
            }
            else {
                console.log('Error updating group(1)', data, status);
            }
        }
        function errorFunc() {
            console.log('Error updating group(2)');
        }
    }
    public updateGroupData = () => {
        var groupId = $("#group_group_select").val();
        if (groupId == 0) {
            $("#group_name").val("");
        }
        else {
            var g = new GroupDTO_S;
            for (var i = 0; i < this.Groups.length; i++) {
                if (groupId == this.Groups[i].Id) {
                    g = this.Groups[i];
                }
            }
            if (g == null) {
                console.log("error choosing group");
                return;
            }
            $("#group_owner_select").val(g.OwnerId);
            $("#group_name").val(g.Name);
        }
    }
    //-------------------------------GROUP END-----------------------------------------------//
    //---------------------------------------------------------------------------------------//
    //---------------------------------------------------------------------------------------//
    //-------------------------------TERM START----------------------------------------------//
    public createTerm = (t: TermDTO_S) => {
        //console.log("creating term");
        var self = this;
        var serviceURL = '/Term/Create';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: t,
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data, status) {
            console.log("Succesfully created term.", data, status);
            self.getAllCourses();
        }
        function errorFunc() {
            console.log('Error creating new term');
        }
    }
    public createTerms = (t: TermDTO_S) => {
        //console.log("creating terms", t);
        //return;
        //nešto s datumima nešto ne znam
        var self = this;
        var serviceURL = '/Term/CreateMany';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: t,
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data, status) {
            console.log("Succesfully created term.", data, status);
            self.getAllCourses();
        }
        function errorFunc() {
            console.log('Error creating new term');
        }
    }
    public deleteTerm = (termId: number) => {
        //console.log("deleting term");
        var self = this;
        var serviceURL = '/Term/Delete';
        $.ajax({
            type: "POST",
            url: serviceURL + "?id=" + termId,
            success: successFunc,
            error: errorFunc
        });
        function successFunc(status) {
            console.log("term deleted!");
            self.getAllCourses();
        }
        function errorFunc(data) {
            console.log('error deleting term');
        }
    }
    public deleteTerms = (t: TermDTO_S) => {
        //console.log("deleting terms");
        //console.log(t);
        var self = this;
        var serviceURL = '/Term/DeleteMany';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: t,
            success: successFunc,
            error: errorFunc
        });
        function successFunc(status) {
            console.log("terms deleted!");
        }
        function errorFunc(data) {
            console.log('error deleting terms');
        }
    }
    public getTermData = (termId) => {
        //console.log("getting term data");
        var self = this;
        var serviceURL = '/Term/Get';
        $.ajax({
            type: "GET",
            url: serviceURL + "?termId=" + termId,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data: TermDTO_S, status) {
            var term = data;
        }
        function errorFunc() {
            console.log('error getting data about selected term');
        }

    }
    public getTermsByCourseId = () => {
        //console.log("getting term per course id");
        var courseId = $('#term_course_select').val();
        $("#term_name").val("");
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
        function successFunc(data, status) {
            //console.log(data);
            self.Terms = data;
            for (var i = 0; i < self.Terms.length; i++) {
                //console.log(self.Terms[i].TermDate);
            }
            self.populateSelectTerm();
        }
        function errorFunc(data) {
            console.log('error getting data about all terms for course with id', courseId, "\nreason:\n", data);
        }

    }
    public getTermsByGroupId = () => {
        //console.log("getting term per course data");
        var groupId = $('#term_group_select').val();
        if (groupId == "-1") {
            this.getTermsByCourseId();
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
            self.Terms = data;
            self.populateSelectTerm();
        }
        function errorFunc(data) {
            console.log('error getting data about all terms for course with id', groupId, "\nreason:\n", data);
        }

    }
    public populateSelectTerm = () => {
        //console.log("populating select term");
        //console.log("Terms:\n",this.Terms);
        var selectId = "#term_term_select";
        var moreGroupsMode = false;
        if ($("#term_group_select").val() == "-1") {
            moreGroupsMode = true;
            //console.log("more groups mode!");
        }
        var output = [];
        var outputDates = [];
        output.push('<option value="' + "0" + '">' + "Novi termin" + '</option>');
        if (this.Terms == null) {
            $(selectId).find('option').remove().end();
            $(selectId).html(output.join(''));
            return;
        }
        //console.log(this.Terms);
        for (var i = 0; i < this.Terms.length; i++) {
            if (!moreGroupsMode) {
                //console.log("filling term_term_select")
                var date = this.Terms[i].TermDate.substring(0, 10);
                var id = this.Terms[i].Id;
                var outputMember = '<option value="' + id.toString() + '">' + date + '</option>';
                output.push(outputMember);
            }
            else {
                //console.log("filling term_term_select_2")
                var date = this.Terms[i].TermDate.substring(0, 10);
                var id = this.Terms[i].Id;
                var outputMember = '<option value="' + id.toString() + '">' + date + '</option>';
                var alreadyExists = false;
                if (output != null) {
                    for (var j = 0; j < outputDates.length; j++) {
                        if (outputDates[j] == date) {
                            alreadyExists = true;
                            break;
                        }
                    }
                }
                if (!alreadyExists) {
                    output.push(outputMember);
                    outputDates.push(date);
                }
                //console.log("option for term", this.Terms[i], "is:\n", outputMember);
                //console.log("Id", this.Terms[i].Id, "\nid", id);
            }
        }
        //console.log(output);
        $(selectId).find('option').remove().end();
        $(selectId).html(output.join(''));
        this.updateTermData();
    }
    public updateTerm = (t: TermDTO_S) => {
        //console.log("updating term");
        var self = this;
        var serviceURL = '/Term/Update';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: t,
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data, status) {
            if (status == "success") {
                console.log("Succesfully updated term.");
                $("#term_term_select").val(t.Id);
                self.getAllCourses();
            }
            else {
                console.log('Error updating term(1)');
            }
        }
        function errorFunc() {
            console.log('Error updating term(2)');
        }
    }
    public updateTerms = (t: TermDTO_S) => {
        //console.log("updating terms");
        var self = this;
        var serviceURL = '/Term/UpdateMany';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: t,
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data, status) {
            if (status == "success") {
                console.log("Succesfully updated term.");
                $("#term_term_select").val(t.Id);
            }
            else {
                console.log('Error updating term(1)');
            }
        }
        function errorFunc() {
            console.log('Error updating term(2)');
        }
    }
    public updateTermData = () => {
        var termId = $("#term_term_select").val();
        //console.log("updating term data for termId=", termId);
        //console.log("Terms:", this.Terms);
        if (termId == 0) {
            var today: Date = new Date();
            var year = today.getFullYear().toString();
            var month = (today.getMonth() + 1).toString();
            var day = today.getDate().toString();
            var month = this.minTwoDigits(parseInt(month));
            var day = this.minTwoDigits(parseInt(day));
            //console.log("a", day, month, year);
            $("#term_date").val(month + "/" + day + "/" + year);
        }
        else {
            var t = new TermDTO_S;
            for (var i = 0; i < this.Terms.length; i++) {
                if (termId == this.Terms[i].Id) {
                    t = this.Terms[i];
                }
            }
            if (t == null) {
                console.log("error choosing term");
                return;
            }
            console.log("updating term dataaa", t);
            var date = t.TermDate;
            var day = date.split('.')[0];
            var month = date.split('.')[1];
            var year = date.split('.')[2];
            //console.log("b", day, month, year);
            $("#term_date").val(month + "/" + day + "/" + year);
        }
    }
    //-------------------------------TERM END------------------------------------------------//
    //---------------------------------------------------------------------------------------//
    //---------------------------------------------------------------------------------------//
    //-------------------------------CHOOSE FORM DATA START----------------------------------//
    public populateSelectCourseName = (selectId: string, studyName: string, needsNew: boolean) => {
        //console.log("populating: ", selectId);
        var output = [];
        var names = [];
        var ids = [];
        for (var i = 0; i < this.Courses.length; i++) {
            //console.log("Course:",this.Courses[i],"\n");
            var study = this.Courses[i].Study;
            var course = this.Courses[i].Name;
            var id = this.Courses[i].Id;
            if (study != studyName) {
                //console.log("continuing because ",studyName," is different from ",study);
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
                ids.push(id);
            }
        }
        $(selectId).find('option').remove().end();
        if (needsNew) output.push('<option value="' + "Novi kolegij" + '">' + "Novi kolegij" + '</option>');
        for (var i = 0; i < names.length; i++) {
            if (this.Courses[i].Name != "" && this.Courses[i].Name != null) {
                output.push('<option value="' + ids[i].toString() + '">' + names[i] + '</option>');
            }
        }
        $(selectId).html(output.join(''));
        //console.log(output);
    }
    public populateSelectStudy = (selectId: string) => {
        //console.log("-----------------------------\npopulating select study for id:",selectId);
        var studies = [];
        var output = [];
        for (var i = 0; i < this.Courses.length; i++) {
            var x = (this.Courses[i].Study).trim();
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
        var rac_exists = false;
        var el_exists = false;
        for (var i = 0; i < studies.length; i++) {
            if (studies[i] == "Računarstvo" || studies[i] == "Racunarstvo") {
                rac_exists = true;
            }
            if (studies[i] == "Elektrotehnika") {
                el_exists = true;
            }
        }
        if (!rac_exists) {
            studies.push("Računarstvo");
        }
        if (!el_exists) {
            studies.push("Elektrotehnika");
        }
        $(selectId).find('option').remove().end();
        for (var i = 0; i < studies.length; i++) {
            output.push('<option value="' + studies[i] + '">' + studies[i] + '</option>');
        }
        //console.log(output);
        $(selectId).html(output.join(''));
        var selectStudyValue = $(selectId).val();
        this.populateSelectCourseName("#course_course_select", selectStudyValue, true);
        this.populateSelectCourseName("#group_course_select", selectStudyValue, false);
        this.populateSelectCourseName("#term_course_select", selectStudyValue, false);
    }
    //-------------------------------CHOOSE FORM DATA END------------------------------------//
    //---------------------------------------------------------------------------------------//
    //---------------------------------------------------------------------------------------//
    //----------------------------------COOKIE START-----------------------------------------//
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
    //----------------------------------COOKIE END-------------------------------------------//
    //---------------------------------------------------------------------------------------//
    //---------------------------------------------------------------------------------------//
    //-----------------------AUTHORIZATION & AUTHENTICATION START----------------------------//
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
        //this.getAllCourses();
        //this.getAllUsers();
        this.setTodayDate();
    }
    public ActivateRegularUser = () => {
        $("#adminSettings").css("visibility", "collapse");
    }
    //-----------------------AUTHORIZATION & AUTHENTICATION END------------------------------//
    //---------------------------------------------------------------------------------------//
    public minTwoDigits = (n) => {
        return (n < 10 ? '0' : '') + n;
    }
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

    public test = () => {
        var self = this;
        this.YO("new");
        console.log("updating observable");
        console.log(self.Users_KO());
    }

}

class UserM_S {
    public Id: number;
    public Username: string;
    public Name: string;
    public LastName: string;
    public Role: string;
    public Password: string;
    public Courses: CourseDTO_S[] = new Array<CourseDTO_S>();
}
class UserDTO_S {
    public Id: number;
    public Username: string;
    public Name: string;
    public LastName: string;
    public Role: string;
}
class TermDTO_S {
    public Id: number;
    public CourseId: number;
    public GroupId: GroupDTO_S;
    public TermDate: string;
}
class CourseDTO_S {
    public Id: number;
    public Name: string;
    public Study: string;
    public Professor: string;
    public Asistant: string;
}
class CourseM_S {
    public Id: number;
    public Name: string;
    public Study: string;
    public Professor: string;
    public Asistant: string;
}
class GroupDTO_S {
    public Id: number;
    public Name: string;
    public OwnerId: number;
    public CourseId: number;
}
class CourseUserDTO_S {
    public UserId: number;
    public CourseId: number;
    public CourseName: string;
}
class LoginDataM_S {
    public Username: string;
    public Password: string;
}
class PasswordUpdaterM_S {
    UserId: number;
    Password: string;
}
