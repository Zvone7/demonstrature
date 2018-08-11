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
    constructor() {
        //----------------------------------default values------------------------------//
        //public defaultTextButtonSkip = defaultTextButtonSkip;
        //public defaultTextButtonTake = defaultTextButtonTake;
        this.defaultCourseName = defaultCourseName;
        this.defaultDate = defaultDate;
        this.defaultGroupName = defaultGroupName;
        this.defaultId = defaultId;
        this.defaultStudyName = defaultStudyName;
        this.defaultUserLastName = defaultUserLastName;
        this.defaultUserName = defaultUserName;
        this.defaultUserRole = defaultUserRole;
        this.defaultUserUsername = defaultUserUsername;
        //---------------------------------OBSERVABLES------------------------------//
        this.ActiveUser_KO = ko.observable(new KoUser());
        this.Users_KO = ko.observableArray();
        this.SelectedUser_KO = ko.observable(new KoUser());
        this.UserCourses_KO = ko.observableArray();
        this.Studies_KO = ko.observableArray();
        this.SelectedStudy_KO = ko.observable("-");
        this.Courses_KO = ko.observableArray();
        this.SelectableCourses_KO = ko.observableArray();
        this.SelectedCourse_KO = ko.observable(new KoCourse());
        this.Groups_KO = ko.observableArray();
        this.SelectedGroup_KO = ko.observable(new KoGroup());
        this.GroupOwners_KO = ko.observableArray();
        this.SelectedGroupOwner_KO = ko.observable(new KoUser());
        this.Terms_KO = ko.observableArray();
        this.SelectedTerm_KO = ko.observable(new KoTerm());
        this.DateHelper = ko.observable("");
        this.SelectedTermGroupName = ko.observable("");
        this.BlankString = ko.observable("");
        this.warning_blank_field = "Molim popunite sva polja!";
        this.warning_delete_new = "Molim provjerite odabir.";
        this.warning_password_match = "Provjerite lozinku!";
        this.warning_not_logged_in = "Molim ulogirajte se!";
        this.succes_creating_or_updating = "Uspjesno pohranjeno!";
        this.succes_deleting = "Uspjesno obrisano";
        this.fail_creating_or_updating = "Pogreska pri spremanju promjena.";
        this.link_main = "http://localhost:49977";
        this.link_settings = "/Settings/Settings";
        this.link_table = "/Table/Table";
        this.link_login = "/Login/Login";
        this.YO = ko.observable("2015-12-25");
        this.allocation = () => {
            var self = this;
            //self.SelectedUser_KO(new KoUser());
            //self.SelectedCourse_KO(new KoCourse());
        };
        this.getInitialData = () => {
            var self = this;
            self.SelectedCourse_KO().Id = -1;
            self.SelectedUser_KO().Id = -1;
            self.SelectedGroup_KO().Id = -1;
            self.SelectedStudy_KO("-");
            self.getAllUsers();
            self.getAllStudies();
            self.getAllCourses();
        };
        //-------------------------------BUTTONS -------------------------------------------//
        this.button_addCourse = () => {
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
        };
        this.button_updateCourse = () => {
            var self = this;
            if (self.SelectedCourse_KO().Id == 0 || self.SelectedCourse_KO().Id == undefined) {
                ShowNotification("Nijedan kolegij nije odabran.", 0);
            }
            if (self.SelectedCourse_KO().Name.toString() == "" ||
                self.SelectedCourse_KO().Professor.toString() == "" ||
                self.SelectedCourse_KO().Asistant.toString() == "") {
                ShowNotification(this.warning_blank_field, 0);
            }
            self.SelectedCourse_KO().Study(self.SelectedStudy_KO());
            self.createOrUpdateCourse(self.SelectedCourse_KO());
        };
        this.button_deleteCourse = () => {
            var courseId = this.SelectedCourse_KO().Id;
            if (courseId == 0) {
                ShowNotification(this.warning_delete_new, 0);
            }
            else {
                this.deleteCourse(courseId);
            }
        };
        this.button_saveUser = () => {
            var self = this;
            var userId = $("#user_user_select :selected").val();
            //console.log(userId);
            var changingPassword = false;
            var password = $("#user_password").val().trim();
            var passwordAgain = $("#user_password_again").val().trim();
            if (self.SelectedUser_KO().Username == self.BlankString ||
                self.SelectedUser_KO().LastName == self.BlankString ||
                self.SelectedUser_KO().Name == self.BlankString) {
                ShowNotification(this.warning_blank_field, 0);
                return;
            }
            if (password != "" || passwordAgain != "") {
                //this means that administrator is trying to change the password
                changingPassword = true;
            }
            var userCourses = new Array();
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
                    ShowNotification(this.warning_blank_field, 0);
                    return;
                }
                else {
                    if (password != passwordAgain) {
                        ShowNotification(this.warning_password_match, 0);
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
                        ShowNotification(this.warning_blank_field, 0);
                        return;
                    }
                    else {
                        if (password != passwordAgain) {
                            ShowNotification(this.warning_password_match, 0);
                            return;
                        }
                        self.SelectedUser_KO().Password = password;
                    }
                }
            }
            self.SelectedUser_KO().Courses = userCourses;
            this.createOrUpdateUser(self.SelectedUser_KO());
        };
        this.button_deleteUser = () => {
            var userId = $("#user_user_select :selected").val();
            if (userId == 0) {
                ShowNotification(this.warning_delete_new, 0);
            }
            else {
                this.deleteUser(userId);
            }
        };
        this.button_addGroup = () => {
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
        };
        this.button_updateGroup = () => {
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
        };
        this.button_deleteGroup = () => {
            var self = this;
            var groupId = self.SelectedGroup_KO().Id;
            if (groupId == 0) {
                ShowNotification(this.warning_delete_new, 0);
            }
            else {
                this.deleteGroup(groupId);
            }
        };
        this.button_saveTerm = () => {
            var self = this;
            if (self.DateHelper() == "") {
                self.setTodayDate();
            }
            self.SelectedTerm_KO().TermDate = self.DateHelper;
            if (self.SelectedTerm_KO().TermDate.toString() == "") {
                ShowNotification(this.warning_blank_field, 0);
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
        };
        this.button_deleteTerm = () => {
            var self = this;
            if (self.DateHelper() == "") {
                self.setTodayDate();
            }
            self.SelectedTerm_KO().TermDate = self.DateHelper;
            if (self.SelectedTerm_KO().TermDate.toString() == "") {
                ShowNotification(this.warning_blank_field, 0);
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
                ShowNotification(this.warning_delete_new, 0);
            }
            else {
                term.GroupId = groupId;
                if (term.IsCourseTerm.toString() == "true") {
                    this.deleteTerms(term);
                }
                else {
                    this.deleteTerm(term.Id);
                }
            }
        };
        this.button_savePassword = () => {
            var self = this;
            var userId = self.ActiveUser_KO().Id;
            //console.log(userId);
            var oldPassword = $("#old_password").val().trim();
            var password = $("#password").val().trim();
            var passwordAgain = $("#password_again").val().trim();
            if (password == "" || passwordAgain == "") {
                ShowNotification(this.warning_blank_field, 0);
                return;
            }
            else {
                if (password != passwordAgain) {
                    ShowNotification(this.warning_password_match, 0);
                    return;
                }
            }
            var pu = new PasswordUpdater();
            pu.OldPassword = oldPassword;
            pu.NewPassword = password;
            self.updateUserPassword(pu);
            return;
        };
        //-------------------------------COURSES -------------------------------------------//
        this.createOrUpdateCourse = (c) => {
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
                //console.log("Succesfully created/updated course.", data, status);
                ShowNotification(self.succes_creating_or_updating, 1);
                self.getInitialData();
                $("#course_add_name").val("");
                $("#course_add_prof").val("");
                $("#course_add_asis").val("");
                self.SelectedStudy_KO("-");
            }
            function errorFunc(data) {
                //console.log('Error creating/updating course', data);
                ShowNotification(self.fail_creating_or_updating, -1);
            }
        };
        this.createEmptyCourseCheckboxes = () => {
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
        };
        this.createUserCourseCheckboxes = (userId) => {
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
        };
        this.setCheckboxHtmlValues = (c) => {
            var container = document.getElementById("user_user_course");
            var label = document.createElement('label');
            label.htmlFor = "id";
            label.className = "identifier-bold";
            label.appendChild(document.createTextNode(c.Name));
            var label2 = document.createElement('label');
            label2.htmlFor = "id";
            label2.className = "identifier-small";
            label2.appendChild(document.createTextNode("" + c.Study));
            container.appendChild(label);
            container.innerHTML += "<br />";
            container.appendChild(label2);
            container.innerHTML += "<br /><br />";
        };
        this.deleteCourse = (courseId) => {
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
                //console.log("course deleted!");
                ShowNotification(self.succes_deleting, 1);
                self.getInitialData();
            }
            function errorFunc(data) {
                //console.log('error deleting course');
                ShowNotification(self.fail_deleting, -1);
            }
        };
        this.getAllCourses = () => {
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
            function successFunc(data, status) {
                self.Courses_KO([]);
                for (var i = 0; i < data.length; i++) {
                    var crs = ko.observable(data[i]);
                    self.Courses_KO.push(crs());
                }
                //console.log("AllCourses:", self.Courses_KO());
                self.createEmptyCourseCheckboxes();
            }
            function errorFunc() {
                //console.log('error getting data about all courses');
            }
        };
        this.getCoursesByStudy = () => {
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
            function successFunc(data, status) {
                self.SelectableCourses_KO([]);
                for (var i = 0; i < data.length; i++) {
                    var crs = ko.observable(data[i]);
                    self.SelectableCourses_KO.push(crs());
                }
                self.createEmptyCourseCheckboxes();
            }
            function errorFunc() {
                //console.log('error getting data about all courses');
            }
        };
        this.updateCourseData = (courseId) => {
            if (courseId == "" || courseId == "undefined") {
                this.SelectedCourse_KO(new KoCourse());
            }
            for (var i = 0; i < this.SelectableCourses_KO().length; i++) {
                if (this.SelectableCourses_KO()[i].Id == courseId) {
                    this.SelectedCourse_KO(this.SelectableCourses_KO()[i]);
                }
            }
            this.getGroupsByCourseId();
        };
        //-------------------------------USER ----------------------------------------------//
        this.createOrUpdateUser = (user) => {
            var self = this;
            //console.log("createOrUpdateUser:", user);
            var serviceURL = '/User/CreateOrUpdate';
            $.ajax({
                type: "POST",
                url: serviceURL,
                data: user,
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data, status) {
                //console.log("Succesfully created user.", data, status);
                ShowNotification(self.succes_creating_or_updating, 1);
                self.SelectedUser_KO(new KoUser());
                self.getAllUsers();
            }
            function errorFunc() {
                //console.log('Error creating new user');
                ShowNotification(self.fail_creating_or_updating, -1);
            }
        };
        this.deleteUser = (userId) => {
            var self = this;
            var serviceURL = '/User/Delete';
            $.ajax({
                type: "DELETE",
                url: serviceURL + "?userId=" + userId,
                success: successFunc,
                error: errorFunc
            });
            function successFunc(status) {
                //console.log("user deleted!");
                ShowNotification(self.succes_deleting, 1);
                self.getAllCourses();
                self.getAllUsers();
            }
            function errorFunc(data) {
                //console.log('error deleting user');
                ShowNotification(self.fail_deleting, -1);
            }
        };
        this.getAllUsers = () => {
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
            function successFunc(data, status) {
                self.Users_KO([]);
                for (var i = 0; i < data.length; i++) {
                    var usr = ko.observable(data[i]);
                    self.Users_KO.push(usr());
                }
            }
            function errorFunc(data) {
                console.log('error getting data about all users', data);
            }
        };
        this.getUser = (username) => {
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
            function successFunc(data, status) {
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
        };
        this.getUserCourses = (userId) => {
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
                    var course = ko.observable(data[i]);
                    self.UserCourses_KO().push(course());
                }
                self.createUserCourseCheckboxes(userId);
            }
            function errorFunc(data) {
                console.log('error getting data about user courses');
            }
        };
        this.updateUserData = (id) => {
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
        };
        this.updateUserPassword = (pu) => {
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
                    //console.log("Succesfully updated user password.");
                    ShowNotification(self.succes_creating_or_updating, 1);
                    self.getAllCourses();
                    self.getAllUsers();
                    $("#old_password").val("");
                    $("#password").val("");
                    $("#password_again").val("");
                }
                else {
                    //console.log('Error updating user password(1)');
                    ShowNotification(self.fail_creating_or_updating, -1);
                    $("#password").val("");
                    $("#password_again").val("");
                }
            }
            function errorFunc() {
                //console.log('Error updating user password(2)');
                ShowNotification(self.fail_creating_or_updating, -1);
                $("#password").val("");
                $("#password_again").val("");
            }
        };
        //-------------------------------GROUP ---------------------------------------------//
        this.createOrUpdateGroup = (g) => {
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
                    ShowNotification(self.succes_creating_or_updating, 1);
                    self.getCoursesByStudy();
                    $("#group_add_name").val("");
                    $("#group_add_user_select").val(0);
                }
                else {
                    //console.log('Error creating new group(1)');
                    ShowNotification(self.fail_creating_or_updating, -1);
                }
                self.SelectedGroup_KO(new KoGroup());
            }
            function errorFunc() {
                //console.log('Error creating new group');
                ShowNotification(self.fail_creating_or_updating, -1);
                self.SelectedGroup_KO(new KoGroup());
            }
        };
        this.deleteGroup = (groupId) => {
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
                    //console.log("group deleted!", data, status);
                    ShowNotification(self.succes_deleting, 1);
                    self.getInitialData();
                }
                else {
                    //console.log('error deleting group(1)');
                    ShowNotification(self.fail_deleting, -1);
                }
            }
            function errorFunc(data) {
                //console.log('error deleting group');
                ShowNotification(self.fail_deleting, -1);
            }
        };
        this.getGroupsByCourseId = () => {
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
            function successFunc(data, status) {
                self.Groups_KO([]);
                for (var i = 0; i < data.length; i++) {
                    var group = ko.observable(data[i]);
                    self.Groups_KO.push(group());
                }
            }
            function errorFunc(data) {
                console.log('error getting data about all groups for course with id', courseId, "\nreason:\n", data);
            }
        };
        this.getGroupsPossibleOwners = () => {
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
            function successFunc(data, status) {
                self.GroupOwners_KO([]);
                for (var i = 0; i < data.length; i++) {
                    var usr = ko.observable(data[i]);
                    self.GroupOwners_KO.push(usr());
                }
                self.updateGroupOwnerData();
            }
            function errorFunc() {
                console.log('error getting data about all groups');
            }
        };
        this.updateGroupData = (groupId) => {
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
        };
        this.updateGroupOwnerData = () => {
            var self = this;
            if (self.SelectedGroup_KO().OwnerId != null) {
                $("#group_edit_user_select").val(self.SelectedGroup_KO().OwnerId);
            }
        };
        //-------------------------------TERM ----------------------------------------------//
        this.createOrUpdateTerm = (t) => {
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
                //console.log("Succesfully created term.", data, status);
                ShowNotification(self.succes_creating_or_updating, 1);
                self.getTermsByCourseId();
            }
            function errorFunc() {
                //console.log('Error creating/updating term');
                ShowNotification(self.fail_creating_or_updating, -1);
            }
        };
        this.deleteTerm = (termId) => {
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
                //console.log("term deleted!");
                ShowNotification(self.succes_deleting, 1);
                self.getTermsByCourseId();
            }
            function errorFunc(data) {
                //console.log('error deleting term');
                ShowNotification(self.fail_deleting, -1);
            }
        };
        this.createOrUpdateTerms = (t) => {
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
                //console.log("Succesfully created term.", data, status);
                ShowNotification(self.succes_creating_or_updating, 1);
                self.getTermsByCourseId();
            }
            function errorFunc() {
                //console.log('Error creating new term');
                ShowNotification(self.fail_creating_or_updating, -1);
            }
        };
        this.deleteTerms = (t) => {
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
                //console.log("terms deleted!");
                ShowNotification(self.succes_deleting, 1);
                self.getTermsByCourseId();
            }
            function errorFunc(data) {
                //console.log('error deleting terms');
                ShowNotification(self.fail_deleting, -1);
            }
        };
        this.getTermData = (termId) => {
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
            function successFunc(data, status) {
                var term = data;
            }
            function errorFunc() {
                console.log('error getting data about selected term');
            }
        };
        this.getTermsByCourseId = () => {
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
            function successFunc(data, status) {
                self.SelectedTerm_KO(new KoTerm());
                self.Terms_KO([]);
                for (var i = 0; i < data.length; i++) {
                    var term = ko.observable(data[i]);
                    self.Terms_KO.push(term());
                }
                self.updateTermData();
            }
            function errorFunc(data) {
                console.log('error getting data about all terms for course with id', courseId, "\nreason:\n", data);
            }
        };
        this.getTermsByGroupId = () => {
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
            function successFunc(data, status) {
                self.Terms_KO([]);
                self.SelectedTerm_KO(new KoTerm());
                for (var i = 0; i < data.length; i++) {
                    var term = ko.observable(data[i]);
                    self.Terms_KO.push(term());
                }
                self.updateTermData();
            }
            function errorFunc(data) {
                console.log('error getting data about all terms for course with id', groupId, "\nreason:\n", data);
            }
        };
        this.updateTermData = () => {
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
        };
        //-------------------------------CHOOSE FORM DATA ----------------------------------//
        this.getAllStudies = () => {
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
                    var study = ko.observable(data[i]);
                    self.Studies_KO.push(study());
                }
            }
            function errorFunc() {
                console.log('error getting data about all courses');
            }
        };
        //----------------------------------COOKIE -----------------------------------------//
        this.GetCookie = (cname) => {
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
        };
        this.CheckCookie = (cname) => {
            var loginData = this.GetCookie(cname);
            if (loginData != "") {
                return loginData;
            }
            else {
                return "";
            }
        };
        //-----------------------AUTHORIZATION & AUTHENTICATION ----------------------------//
        this.LogOut = () => {
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
        };
        this.ActivateAdministrator = () => {
            $("#adminSettings").css("visibility", "visible");
            this.setTodayDate();
        };
        this.ActivateRegularUser = () => {
            $("#adminSettings").css("visibility", "collapse");
        };
        this.minTwoDigits = (n) => {
            return (n < 10 ? '0' : '') + n;
        };
        this.setTodayDate = () => {
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
        };
        this.test = () => {
            var self = this;
            ShowNotification("test2", 1);
            //this.YO("new");
            //console.log("updating observable");
            //console.log(self.YO());
            //self.YO("2016-01-01");
            //console.log("updating observable");
            //console.log(self.YO());
            //self.getTermsByGroupId();
        };
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
            });
            //$('#myUl').css("visibility", "visible");
        });
    }
}
//# sourceMappingURL=SettingsKO.js.map