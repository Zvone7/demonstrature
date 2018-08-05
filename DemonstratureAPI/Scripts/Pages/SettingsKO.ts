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

// currently - adding/editing terms

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


    //---------------------------------OBSERVABLES------------------------------//
    public ActiveUser_KO = ko.observable<KoUser>(new KoUser());
    public Users_KO = ko.observableArray<KoUser>();
    public SelectedUser_KO = ko.observable<KoUser>(new KoUser());
    public UserCourses_KO = ko.observableArray<KoCourse>();

    public Studies_KO = ko.observableArray<string>();
    public SelectedStudy_KO = ko.observable<string>("-");

    public Courses_KO = ko.observableArray<KoCourse>();
    public SelectableCourses_KO = ko.observableArray<KoCourse>();
    public SelectedCourse_KO = ko.observable<KoCourse>(new KoCourse());

    public Groups_KO = ko.observableArray<KoGroup>();
    public SelectedGroup_KO = ko.observable<KoGroup>(new KoGroup());
    public GroupOwners_KO = ko.observableArray<KoUser>();
    public SelectedGroupOwner_KO = ko.observable<KoUser>(new KoUser());

    public Terms_KO = ko.observableArray<KoTerm>();
    public SelectedTerm_KO = ko.observable<KoTerm>(new KoTerm());
    public DateHelper = ko.observable<string>("");
    public SelectedTermGroupName = ko.observable<string>("");

    public BlankString = ko.observable<string>("");

    public warning_blank_field = "Molim popunite sva polja!";
    public warning_delete_new = "Pogreska pri odabiru";
    public warning_password_match = "Provjerite lozinku!";
    public warning_not_logged_in = "Molim ulogirajte se!";

    public link_main = "http://localhost:49977";
    public link_settings = "/Settings/Settings";
    public link_table = "/Table/Table";
    public link_login = "/Login/Login";


    public YO = ko.observable<string>("2015-12-25");


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
            $('#study_select').on("change", () => {
                var value = $("#study_select").val();
                self.SelectedStudy_KO(value);
                self.getCoursesByStudy();
                self.getGroupsByCourseId();
                //console.log(self.SelectedStudy_KO());
            });
            $('#course_select').on("change", () => {
                var value = $('#course_select').val();
                self.updateCourseData(value);
                self.getGroupsPossibleOwners();
                self.getTermsByCourseId();
            });
            $('#group_select').on("change", () => {
                var value = $('#group_select').val();
                self.updateGroupData(value);
                self.getTermsByGroupId();
            });

            $('#course_delete').on("click", () => {
                self.button_deleteCourse();
            });
            $('#course_update').on("click", () => {
                self.button_updateCourse();
            });
            $('#course_add').on("click", () => {
                self.button_addCourse();
            });

            //add/edit group form
            $('#group_delete').on("click", () => {
                self.button_deleteGroup();
            });
            $('#group_update').on("click", () => {
                self.button_updateGroup();
            });
            $('#group_add').on("click", () => {
                self.button_addGroup();
            });

            //add/edit term form
            $('#term_delete').on("click", () => {
                self.button_deleteTerm();
            });
            $('#term_save').on("click", () => {
                self.button_saveTerm();
            });
            $('#term_select').on("change", () => {
                self.updateTermData();
            });
            $("#term_date").datepicker();
            $("#term_date").on("focus", () => {
                $('.ui-datepicker').css("display", "none");
            })


            //$('#myUl').css("visibility", "visible");

        });
    }
    public allocation = () => {
        var self = this;
        //self.SelectedUser_KO(new KoUser());
        //self.SelectedCourse_KO(new KoCourse());
    }
    public getInitialData = () => {
        var self = this;
        self.SelectedCourse_KO().Id = -1;
        self.SelectedUser_KO().Id = -1;
        self.SelectedGroup_KO().Id = -1;
        self.SelectedStudy_KO("-");
        self.getAllUsers();
        self.getAllStudies();
        self.getAllCourses();
    }
    //-------------------------------BUTTONS -------------------------------------------//
    public button_addCourse = () => {
        var self = this;
        var courseName = $("#course_add_name").val();
        var courseStudy = self.SelectedStudy_KO();
        var courseProf = $("#course_add_prof").val();
        var courseAsis = $("#course_add_asis").val();
        var course = new KoCourse({
            Name: courseName,
            Study: courseStudy,
            Professor: courseProf,
            Asistant: courseAsis,
            Id: 0
        });
        this.createOrUpdateCourse(course);
    }
    public button_updateCourse = () => {
        var self = this;
        if (self.SelectedCourse_KO().Id == 0 || self.SelectedCourse_KO().Id == undefined) {
            alert("Molim odaberite kolegij!");
        }
        if (self.SelectedCourse_KO().Name.toString() == "" ||
            self.SelectedCourse_KO().Professor.toString() == "" ||
            self.SelectedCourse_KO().Asistant.toString() == ""
        ) {
            alert("Popunite sva polja!");
        }
        self.SelectedCourse_KO().Study(self.SelectedStudy_KO());
        self.createOrUpdateCourse(self.SelectedCourse_KO());
    }
    public button_deleteCourse = () => {
        var courseId = this.SelectedCourse_KO().Id;
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
                var courseIdString = helper.split('_')[4];
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
            //console.log("creating new user");
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
                //console.log("updating user without pass");
                self.SelectedUser_KO().Password = self.BlankString;
            }
            else {
                //console.log("updating user with pass");
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

    public button_addGroup = () => {
        var self = this;
        var groupName = $("#group_add_name").val();
        var ownerId = $("#group_add_user_select").val();
        var courseId = self.SelectedCourse_KO().Id;
        var group = new KoGroup({
            Name: groupName,
            OwnerId: ownerId,
            CourseId: courseId,
            Id: 0
        });
        this.createOrUpdateGroup(group);
    }
    public button_updateGroup = () => {
        var self = this;
        self.SelectedGroup_KO().OwnerId = $("#group_edit_user_select").val();
        if (self.SelectedGroup_KO().Id == -1) {
            self.SelectedGroup_KO().Id = 0;
        }
        if (self.SelectedGroup_KO().OwnerId == -1) {
            self.SelectedGroup_KO().OwnerId = 0;
        }
        self.SelectedGroup_KO().CourseId = self.SelectedCourse_KO().Id;
        this.createOrUpdateGroup(self.SelectedGroup_KO());
    }
    public button_deleteGroup = () => {
        var self = this;
        var groupId = self.SelectedGroup_KO().Id;
        if (groupId == 0) {
            alert(this.warning_delete_new);
        }
        else {
            this.deleteGroup(groupId);
        }
    }

    public button_saveTerm = () => {
        var self = this;
        if (self.DateHelper() == "") {
            self.setTodayDate();
        }
        self.SelectedTerm_KO().TermDate = self.DateHelper;
        if (self.SelectedTerm_KO().TermDate.toString() == "") {
            alert(this.warning_blank_field);
            return;
        }

        var term = self.SelectedTerm_KO();
        var groupId = self.SelectedGroup_KO().Id;
        if (groupId == undefined || groupId.toString() == "" || groupId == 0) {
            groupId = -1;
        }
        var termId = self.SelectedTerm_KO().Id;
        if (termId == undefined || termId.toString() == "" || termId == 0) {
            termId = -1;
        }
        term.TermDate = self.SelectedTerm_KO().TermDate;
        term.GroupId = groupId;
        term.Id = termId;


        term.CourseId = self.SelectedCourse_KO().Id;
        if (termId == -1) {
            term.Id = 0;
            //console.log(t);
            if (term.IsCourseTerm()) {
                this.createOrUpdateTerms(term);
            }
            else {
                this.createOrUpdateTerm(term);
            }
        }
        else {
            if (term.IsCourseTerm.toString() == "true") {
                this.createOrUpdateTerms(term);
            }
            else {
                this.createOrUpdateTerm(term);
            }
        }
    }
    public button_deleteTerm = () => {
        var self = this;
        if (self.DateHelper() == "") {
            self.setTodayDate();
        }
        self.SelectedTerm_KO().TermDate = self.DateHelper;
        if (self.SelectedTerm_KO().TermDate.toString() == "") {
            alert(this.warning_blank_field);
            return;
        }
        var term = self.SelectedTerm_KO();
        var groupId = self.SelectedGroup_KO().Id;
        if (groupId == undefined || groupId.toString() == "" || groupId == 0) {
            groupId = -1;
        }
        var termId = self.SelectedTerm_KO().Id;
        if (termId == undefined || termId.toString() == "" || termId == 0) {
            termId = -1;
        }
        if (termId == -1) {
            alert(this.warning_delete_new);
        }
        else {
            term.GroupId = groupId;
            if (term.IsCourseTerm.toString()=="true") {
                this.deleteTerms(term);
            }
            else {
                this.deleteTerm(term.Id);
            }
        }
    }

    public button_savePassword = () => {
        var self = this;
        var userId = self.ActiveUser_KO().Id;
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
        var pu = new PasswordUpdater();
        pu.OldPassword = oldPassword;
        pu.NewPassword = password;
        self.updateUserPassword(pu);
        return;

    }

    //-------------------------------COURSES -------------------------------------------//
    public createOrUpdateCourse = (c: KoCourse) => {
        var self = this;
        var serviceURL = '/Course/CreateOrUpdate';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: c,
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data, status) {
            console.log("Succesfully created/updated course.", data, status);
            self.getInitialData();
            $("#course_add_name").val("");
            $("#course_add_prof").val("");
            $("#course_add_asis").val("");
            self.SelectedStudy_KO("-");
        }
        function errorFunc() {
            console.log('Error creating/updating course');
        }
    }
    public createEmptyCourseCheckboxes = () => {
        var self = this;
        var userId = self.SelectedUser_KO().Id;
        if (userId == undefined) {
            //new user
            //give him all the checkboxes  
            userId = 0;
            var container = document.getElementById("user_user_course");
            $("#user_user_course").text("");
            if (userId == 0) {
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
        }
        else {
            this.getUserCourses(userId);
            // calls createCourseCheckboxesForExistingUser when requests finishes
        }
    }
    public createUserCourseCheckboxes = (userId: number) => {
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
    public deleteCourse = (courseId) => {
        var self = this;
        console.log("deleting", courseId);
        var serviceURL = '/Course/Delete';
        $.ajax({
            type: "DELETE",
            url: serviceURL + "?courseId=" + courseId,
            success: successFunc,
            error: errorFunc
        });
        function successFunc(status) {
            console.log("course deleted!");
            self.getInitialData();
        }
        function errorFunc(data) {
            console.log('error deleting course');
        }
    }
    public getAllCourses = () => {
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
        function successFunc(data: KoCourse[], status) {
            self.Courses_KO([]);
            for (var i = 0; i < data.length; i++) {
                var crs = ko.observable<KoCourse>(data[i]);
                self.Courses_KO.push(crs());
            }
            //console.log("AllCourses:", self.Courses_KO());
            self.createEmptyCourseCheckboxes();
        }
        function errorFunc() {
            console.log('error getting data about all courses');
        }
    }
    public getCoursesByStudy = () => {
        var self = this;
        var study = self.SelectedStudy_KO();
        var serviceURL = '/Course/CoursesByStudy';
        $.ajax({
            type: "GET",
            url: serviceURL + '?study=' + study,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data: KoCourse[], status) {
            self.SelectableCourses_KO([]);
            for (var i = 0; i < data.length; i++) {
                var crs = ko.observable<KoCourse>(data[i]);
                self.SelectableCourses_KO.push(crs());
            }
            self.createEmptyCourseCheckboxes();
        }
        function errorFunc() {
            console.log('error getting data about all courses');
        }
    }
    public updateCourseData = (courseId) => {
        if (courseId == "" || courseId == "undefined") {
            this.SelectedCourse_KO(new KoCourse());
        }
        for (var i = 0; i < this.SelectableCourses_KO().length; i++) {
            if (this.SelectableCourses_KO()[i].Id == courseId) {
                this.SelectedCourse_KO(this.SelectableCourses_KO()[i]);
            }
        }
        this.getGroupsByCourseId();
    }
    //-------------------------------USER ----------------------------------------------//
    public createOrUpdateUser = (user: KoUser) => {
        var self = this;
        console.log("createOrUpdateUser:", user);
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
            self.SelectedUser_KO(new KoUser());
            //self.getAllCourses();
            self.getAllUsers();
            //self.SelectedUser_KO(data);
            //$("#user_user_select").val(self.SelectedUser_KO().Id.toString());
        }
        function errorFunc() {
            console.log('Error creating new user');
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
            self.Users_KO([]);
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
        function successFunc(data: KoUser, status) {
            if (data != null) {
                console.log("getuser", data);
                self.ActiveUser_KO(data);
            }
            else {
                self.ActiveUser_KO = null;
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
            self.createUserCourseCheckboxes(userId);
        }
        function errorFunc(data) {
            console.log('error getting data about user courses');
        }
    }
    public updateUserData = (id: number) => {
        //console.log("updatingUserData:", id);
        if (this.Users_KO != null) {
            for (var i = 0; i < this.Users_KO().length; i++) {
                if (id == this.Users_KO()[i].Id) {
                    //console.log("here", this.SelectedUser_KO());
                    this.SelectedUser_KO(this.Users_KO()[i]);
                    //console.log("here", this.SelectedUser_KO());
                    $("#user_select_role").val(this.SelectedUser_KO().Role);
                    this.createEmptyCourseCheckboxes();
                }
            }
        }
    }
    public updateUserPassword = (pu: PasswordUpdater) => {
        var self = this;
        var serviceURL = '/User/UpdateOwnPassword';
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
    //-------------------------------GROUP ---------------------------------------------//
    public createOrUpdateGroup = (g: KoGroup) => {
        var self = this;
        var serviceURL = '/Group/CreateOrUpdate';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: g,
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data, status) {
            if (data != null) {
                //console.log("Succesfully created group.", data, status);
                self.getCoursesByStudy();
                $("#group_add_name").val("");
                $("#group_add_user_select").val(0);
            }
            else {
                console.log('Error creating new group(1)');
            }
            self.SelectedGroup_KO(new KoGroup());
        }
        function errorFunc() {
            console.log('Error creating new group');
            self.SelectedGroup_KO(new KoGroup());
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
                self.getInitialData();
            }
            else {
                console.log('error deleting group(1)');
            }
        }
        function errorFunc(data) {
            console.log('error deleting group');
        }
    }
    public getGroupsByCourseId = () => {
        var self = this;
        var courseId = self.SelectedCourse_KO().Id;
        if (courseId == undefined) {
            return;
        }
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
            self.Groups_KO([]);
            for (var i = 0; i < data.length; i++) {
                var group = ko.observable<KoGroup>(data[i]);
                self.Groups_KO.push(group());
            }
        }
        function errorFunc(data) {
            console.log('error getting data about all groups for course with id', courseId, "\nreason:\n", data);
        }

    }
    public getGroupsPossibleOwners = () => {
        //console.log("getting groups possible owners");
        var self = this;
        var courseId = self.SelectedCourse_KO().Id;
        if (courseId == undefined) {
            return;
        }
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
            self.GroupOwners_KO([]);
            for (var i = 0; i < data.length; i++) {
                var usr = ko.observable<KoUser>(data[i]);
                self.GroupOwners_KO.push(usr());
            }
            self.updateGroupOwnerData();
        }
        function errorFunc() {
            console.log('error getting data about all groups');
        }
    }
    public updateGroupData = (groupId) => {
        var self = this;
        if (groupId == 0) {
            self.SelectedGroup_KO(new KoGroup());
            return;
        }
        for (var i = 0; i < self.Groups_KO().length; i++) {
            if (self.Groups_KO()[i].Id == groupId) {
                self.SelectedGroup_KO(self.Groups_KO()[i]);
            }
        }
        self.updateGroupOwnerData();
        self.getTermsByGroupId();
    }
    public updateGroupOwnerData = () => {
        var self = this;
        if (self.SelectedGroup_KO().OwnerId != null) {
            $("#group_edit_user_select").val(self.SelectedGroup_KO().OwnerId);
        }
    }
    //-------------------------------TERM ----------------------------------------------//
    public createOrUpdateTerm = (t: KoTerm) => {
        console.log("creating term", t);
        var self = this;
        var serviceURL = '/Term/CreateOrUpdate';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: t,
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data, status) {
            console.log("Succesfully created term.", data, status);
            self.getTermsByCourseId();
        }
        function errorFunc() {
            console.log('Error creating/updating term');
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
            self.getTermsByCourseId();
        }
        function errorFunc(data) {
            console.log('error deleting term');
        }
    }
    public createOrUpdateTerms = (t: KoTerm) => {
        console.log("creating terms", t);
        var self = this;
        var serviceURL = '/Term/CreateOrUpdateMany';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: t,
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data, status) {
            console.log("Succesfully created term.", data, status);
            self.getTermsByCourseId();
        }
        function errorFunc() {
            console.log('Error creating new term');
        }
    }
    public deleteTerms = (t: KoTerm) => {
        console.log("deleting terms", t);
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
            self.getTermsByCourseId();
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
        function successFunc(data: KoTerm, status) {
            var term = data;
        }
        function errorFunc() {
            console.log('error getting data about selected term');
        }

    }
    public getTermsByCourseId = () => {
        var self = this;
        var courseId = self.SelectedCourse_KO().Id;
        if (courseId == undefined) {
            return;
        }
        var serviceURL = '/Term/ByCourseId';
        $.ajax({
            type: "GET",
            url: serviceURL + "?courseId=" + courseId,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data: KoTerm[], status) {
            self.SelectedTerm_KO(new KoTerm());
            self.Terms_KO([]);
            for (var i = 0; i < data.length; i++) {
                var term = ko.observable<KoTerm>(data[i]);
                self.Terms_KO.push(term());
            }
            self.updateTermData();
        }
        function errorFunc(data) {
            console.log('error getting data about all terms for course with id', courseId, "\nreason:\n", data);
        }

    }
    public getTermsByGroupId = () => {
        var self = this;
        //console.log("getting term per course data");
        var groupId = self.SelectedGroup_KO().Id;
        if (groupId == -1 || groupId == undefined) {
            this.getTermsByCourseId();
            return;
        }
        var serviceURL = '/Term/ByGroupId';
        $.ajax({
            type: "GET",
            url: serviceURL + "?groupId=" + groupId,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data: KoTerm[], status) {
            self.Terms_KO([]);
            self.SelectedTerm_KO(new KoTerm());
            for (var i = 0; i < data.length; i++) {
                var term = ko.observable<KoTerm>(data[i]);
                self.Terms_KO.push(term());
            }
            self.updateTermData();
        }
        function errorFunc(data) {
            console.log('error getting data about all terms for course with id', groupId, "\nreason:\n", data);
        }

    }
    public updateTermData = () => {
        var self = this;
        //console.log("fresh batch of terms:", self.Terms_KO());
        self.SelectedTerm_KO(new KoTerm());
        self.SelectedTermGroupName("");


        var selectedTermId = $('#term_select').val();
        if (selectedTermId == 'undefined' || selectedTermId == undefined || selectedTermId == 0) {
            self.SelectedTerm_KO(new KoTerm());
            self.SelectedTerm_KO().Id = 0;
        }
        else {
            self.SelectedTerm_KO().Id = selectedTermId;
            for (var i = 0; i < self.Terms_KO().length; i++) {
                var termItem = self.Terms_KO()[i];
                if (self.SelectedTerm_KO().Id == termItem.Id) {
                    self.SelectedTerm_KO(termItem);
                }
            }
            var group;
            self.SelectedTermGroupName(self.defaultGroupName);
            for (var i = 0; i < self.Groups_KO().length; i++) {
                if (self.Groups_KO()[i].Id == self.SelectedTerm_KO().GroupId) {
                    var groupName = self.Groups_KO()[i].Name.toString();
                    self.SelectedTermGroupName(groupName);
                }
            }
        }
    }
    //-------------------------------CHOOSE FORM DATA ----------------------------------//
    public getAllStudies = () => {
        //console.log("gettingStudies");
        var self = this;
        var serviceURL = '/Course/AllStudies';
        $.ajax({
            type: "GET",
            url: serviceURL,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data, status) {
            self.Studies_KO([]);
            self.SelectedStudy_KO("-");
            for (var i = 0; i < data.length; i++) {
                var study = ko.observable<string>(data[i]);
                self.Studies_KO.push(study());
            }
        }
        function errorFunc() {
            console.log('error getting data about all courses');
        }
    }
    //----------------------------------COOKIE -----------------------------------------//
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
    //-----------------------AUTHORIZATION & AUTHENTICATION ----------------------------//
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
        this.setTodayDate();
    }
    public ActivateRegularUser = () => {
        $("#adminSettings").css("visibility", "collapse");
    }

    public minTwoDigits = (n) => {
        return (n < 10 ? '0' : '') + n;
    }
    public setTodayDate = () => {
        var self = this;
        var realDate2 = new Date();
        var year = realDate2.getFullYear().toString();
        var month = (realDate2.getMonth() + 1).toString();
        var day = realDate2.getDate().toString();
        var month = this.minTwoDigits(parseInt(month));
        var day = this.minTwoDigits(parseInt(day));
        var dateString = year + "-" + month + "-" + day;
        //console.log(day, month, year);
        $("#term_date").val(dateString);
        self.DateHelper(dateString);
    }
    public test = () => {
        var self = this;
        //this.YO("new");
        console.log("updating observable");
        console.log(self.YO());
        self.YO("2016-01-01");
        console.log("updating observable");
        console.log(self.YO());
        //self.getTermsByGroupId();
    }
}

