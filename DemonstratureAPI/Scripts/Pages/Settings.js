$(document).ready(function () {
    var s = new SettingsVM();
    s.LoginCheck();
    //s.populateSelectStudy();
});
var SettingsVM = (function () {
    function SettingsVM() {
        var _this = this;
        this.warning_blank_field = "Molim popunite sva polja!";
        this.warning_delete_new = "Pogreska pri odabiru";
        this.warning_password_match = "Provjerite lozinku!";
        this.warning_not_logged_in = "Molim ulogirajte se!";
        this.link_main = "http://localhost:49977";
        this.link_settings = "/Settings/Settings";
        this.link_table = "/Table/Table";
        this.link_login = "/Login/Login";
        //---------------------------------------------------------------------------------------//
        //-------------------------------BUTTONS START-------------------------------------------//
        this.button_saveCourse = function () {
            var studySelect = $("#course_study_select :selected").text();
            var courseSelect = $("#course_course_select :selected").text();
            var courseSelectId = $("#course_course_select :selected").val();
            var courseName = $("#course_name").val();
            var courseProf = $("#course_prof").val();
            var courseAsis = $("#course_asis").val();
            if (courseName == "" || courseProf == "" || courseAsis == "") {
                alert(_this.warning_blank_field);
                return;
            }
            if (courseSelect == "Novi kolegij") {
                var nc = new CourseBM();
                nc.Id = 0;
                nc.Name = courseName;
                nc.Professor = courseProf;
                nc.Asistant = courseAsis;
                nc.Study = studySelect;
                _this.createCourse(nc);
            }
            else {
                var nc = new CourseBM();
                nc.Id = courseSelectId;
                nc.Name = courseName;
                nc.Professor = courseProf;
                nc.Asistant = courseAsis;
                nc.Study = studySelect;
                _this.updateCourse(nc);
            }
        };
        this.button_saveGroup = function () {
            var groupId = $("#group_group_select").val();
            var name = $("#group_name").val();
            var ownerId = $("#group_owner_select").val();
            var courseId = $("#group_course_select").val();
            var g = new GroupDTO();
            g.Name = name;
            g.CourseId = courseId;
            g.OwnerId = ownerId;
            if (groupId == "0") {
                console.log("making a new group");
                g.Id = 0;
                _this.createGroup(g);
            }
            else {
                console.log("updating existing group");
                g.Id = groupId;
                _this.updateGroup(g);
            }
        };
        this.button_saveTerm = function () {
            var termId = $("#term_term_select").val();
            var termDate = $("#term_date").val();
            var courseId = $("#term_course_select").val();
            var groupId = $("#term_group_select").val();
            var t = new TermDTO();
            t.CourseId = courseId;
            t.TermDate = termDate;
            t.GroupId = groupId;
            //console.log(t);
            if (termDate == "" || groupId == "" || courseId == "") {
                alert(_this.warning_blank_field);
                return;
            }
            if (groupId == "-1" && termId == "0") {
                console.log("Making a new term for all groups");
                t.Id = 0;
                console.log(t);
                _this.createTerms(t);
            }
            else if (groupId == "-1" && termId != "0") {
                //console.log("Updating all terms for date");
                t.Id = 0;
                _this.updateTerms(t);
            }
            else if (groupId != "-1" && termId == "0") {
                //console.log("Making a new term for specific course");
                t.Id = 0;
                console.log(t);
                _this.createTerm(t);
            }
            else {
                //console.log("updating existing term");
                t.Id = termId;
                _this.updateTerm(t);
            }
        };
        this.button_saveUser = function () {
            var self = _this;
            var userId = $("#user_user_select :selected").val();
            //console.log(userId);
            var changingPassword = false;
            var userName = $("#user_name").val();
            var userLastName = $("#user_last_name").val();
            var userUsername = $("#user_username").val();
            var userRole = $("#user_select_role :selected").val();
            userRole = userRole.substr(0, 1);
            var password = $("#user_password").val().trim();
            var passwordAgain = $("#user_password_again").val().trim();
            if (userName == "" || userLastName == "" || userUsername == "") {
                alert(_this.warning_blank_field);
                return;
            }
            if (password != "" || passwordAgain != "") {
                //this means that administrator is trying to change the password
                changingPassword = true;
                console.log("u be tryin to change password");
            }
            var userCoursesHelper = new Array();
            // add courses
            var children = $("#user_user_course").find(':checkbox');
            for (var j = 0; j < children.length; j++) {
                var ch = children[j];
                if ($("#" + ch.id).is(":checked")) {
                    //console.log(ch);
                    var helper = ch.id.toString();
                    var courseIdString = helper.substring(helper.length - 1, helper.length);
                    var courseId = parseInt(courseIdString);
                    for (var i = 0; i < self.Courses.length; i++) {
                        var c = self.Courses[i];
                        if (c.Id == courseId) {
                            userCoursesHelper.push(c);
                        }
                    }
                }
            }
            //if adding a new user
            if (userId == 0) {
                console.log("creating new user");
                var nu = new MyUserBM();
                nu.Id = 0;
                nu.Name = userName;
                nu.LastName = userLastName;
                nu.Username = userUsername;
                nu.Role = userRole;
                nu.Courses = userCoursesHelper;
                if (password == "" || passwordAgain == "") {
                    alert(_this.warning_blank_field);
                    return;
                }
                else {
                    if (password != passwordAgain) {
                        alert(_this.warning_password_match);
                        return;
                    }
                    nu.Password = password;
                }
                _this.createUser(nu);
            }
            else {
                if (!changingPassword) {
                    console.log("updating user without pass");
                    var nu = new MyUserBM();
                    nu.Id = userId;
                    nu.Name = userName;
                    nu.LastName = userLastName;
                    nu.Username = userUsername;
                    nu.Role = userRole;
                    nu.Courses = userCoursesHelper;
                    _this.updateUser(nu);
                }
                else {
                    console.log("updating user with pass");
                    var nu = new MyUserBM();
                    nu.Id = userId;
                    nu.Name = userName;
                    nu.LastName = userLastName;
                    nu.Username = userUsername;
                    nu.Role = userRole;
                    nu.Courses = userCoursesHelper;
                    if (password == "" || passwordAgain == "") {
                        alert(_this.warning_blank_field);
                        return;
                    }
                    else {
                        if (password != passwordAgain) {
                            alert(_this.warning_password_match);
                            return;
                        }
                        nu.Password = password;
                    }
                    _this.updateUser(nu);
                }
            }
        };
        this.button_savePassword = function () {
            var self = _this;
            self.LoginCheck();
            var userId = self.ActiveUser.Id;
            //console.log(userId);
            var oldPassword = $("#old_password").val().trim();
            var password = $("#password").val().trim();
            var passwordAgain = $("#password_again").val().trim();
            if (password == "" || passwordAgain == "") {
                alert(_this.warning_blank_field);
                return;
            }
            else {
                if (password != passwordAgain) {
                    alert(_this.warning_password_match);
                    return;
                }
            }
            self.checkIfCorrectPassword(userId, oldPassword, password);
            return;
        };
        this.button_deleteCourse = function () {
            var courseId = $("#course_course_select :selected").val();
            if (courseId == 0) {
                alert(_this.warning_delete_new);
            }
            else {
                _this.deleteCourse(courseId);
            }
        };
        this.button_deleteGroup = function () {
            var groupId = $("#group_group_select").val();
            if (groupId == "0") {
                alert(_this.warning_delete_new);
            }
            else {
                _this.deleteGroup(groupId);
            }
        };
        this.button_deleteTerm = function () {
            var termId = $("#term_term_select").val();
            var termDate = $("#term_date").val();
            var courseId = $("#term_course_select").val();
            var groupId = $("#term_group_select").val();
            if (termId == "0") {
                alert(_this.warning_delete_new);
            }
            else if (groupId == "-1") {
                console.log("deleting terms");
                var t = new TermDTO();
                t.CourseId = courseId;
                t.TermDate = termDate;
                t.GroupId = groupId;
                t.Id = 0;
                _this.deleteTerms(t);
            }
            else {
                console.log("deleting term");
                _this.deleteTerm(termId);
            }
        };
        this.button_deleteUser = function () {
            var userId = $("#user_user_select :selected").val();
            if (userId == 0) {
                alert(_this.warning_delete_new);
            }
            else {
                _this.deleteUser(userId);
            }
        };
        //-------------------------------BUTTONS END---------------------------------------------//
        //---------------------------------------------------------------------------------------//
        //---------------------------------------------------------------------------------------//
        //-------------------------------COURSES START-------------------------------------------//
        this.createCourse = function (c) {
            var self = _this;
            var serviceURL = '/Settings/CreateCourse';
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
        };
        this.createCourseCheckboxes = function (userId) {
            var container = document.getElementById("user_user_course");
            $("#user_user_course").text("");
            if (userId == 0) {
                //new user
                //give him all the checkboxes        
                for (var i = 0; i < _this.Courses.length; i++) {
                    var c = _this.Courses[i];
                    var checkbox = document.createElement('input');
                    checkbox.type = "checkbox";
                    checkbox.name = c.Study + " " + c.Name;
                    checkbox.value = c.Id.toString();
                    checkbox.id = "id";
                    checkbox.defaultChecked = false;
                    checkbox.className = "checkbox1";
                    container.appendChild(checkbox);
                    _this.createCourseCheckboxesHelp(c);
                }
            }
            else {
                _this.getUserCourses(userId);
            }
        };
        this.createCourseCheckboxes2 = function (userId) {
            var container = document.getElementById("user_user_course");
            $("#user_user_course").text("");
            for (var i = 0; i < _this.Courses.length; i++) {
                var c = _this.Courses[i];
                var checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.name = c.Study + " " + c.Name;
                checkbox.value = c.Id.toString();
                checkbox.id = "user_user_course_" + userId + "_" + c.Id;
                checkbox.className = "checkbox1";
                for (var j = 0; j < _this.UserCourses.length; j++) {
                    var uc = _this.UserCourses[j];
                    if (uc.CourseId == c.Id) {
                        checkbox.defaultChecked = true;
                    }
                }
                container.appendChild(checkbox);
                _this.createCourseCheckboxesHelp(c);
            }
        };
        this.createCourseCheckboxesHelp = function (c) {
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
        this.deleteCourse = function (courseId) {
            var self = _this;
            var serviceURL = '/Settings/DeleteCourse';
            $.ajax({
                type: "DELETE",
                url: serviceURL + "?courseId=" + courseId,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
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
        };
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
                self.populateSelectStudy("#course_study_select");
                self.populateSelectStudy("#group_study_select");
                self.populateSelectStudy("#term_study_select");
                self.createCourseCheckboxes(0);
                self.getGroupsByCourseId("#group_group_select", "#group_course_select", true, false);
                self.getGroupsByCourseId("#term_group_select", "#term_course_select", false, true);
            }
            function errorFunc() {
                console.log('error getting data about all courses');
            }
        };
        this.updateCourse = function (c) {
            var self = _this;
            var serviceURL = '/Settings/UpdateCourse';
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
        };
        this.updateCourseData = function () {
            var courseId = $("#course_course_select :selected").val();
            if (courseId == "Novi kolegij") {
                $("#course_name").val("");
                $("#course_prof").val("");
                $("#course_asis").val("");
                return;
            }
            for (var i = 0; i < _this.Courses.length; i++) {
                if (_this.Courses[i].Id == courseId) {
                    var cc = _this.Courses[i];
                    $("#course_name").val(cc.Name);
                    $("#course_prof").val(cc.Professor);
                    $("#course_asis").val(cc.Asistant);
                    return;
                }
            }
        };
        //-------------------------------COURSES END---------------------------------------------//
        //---------------------------------------------------------------------------------------//
        //---------------------------------------------------------------------------------------//
        //-------------------------------USER START----------------------------------------------//
        this.createUser = function (nu) {
            var self = _this;
            var serviceURL = '/Settings/CreateUser';
            $.ajax({
                type: "POST",
                url: serviceURL,
                data: nu,
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
        };
        this.deleteUser = function (userId) {
            var self = _this;
            var serviceURL = '/Settings/DeleteUser';
            $.ajax({
                type: "DELETE",
                url: serviceURL + "?userId=" + userId,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
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
        };
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
                self.Users = data;
                self.populateSelectUser();
            }
            function errorFunc(data) {
                console.log('error getting data about all users', data);
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
                    self.ActiveUser = new MyUserDTO();
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
        };
        this.getUserCourses = function (userId) {
            var self = _this;
            var serviceURL = '/Settings/GetUserCourses';
            $.ajax({
                type: "GET",
                url: serviceURL + "?userId=" + userId,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data, status) {
                self.UserCourses = data;
                self.createCourseCheckboxes2(userId);
            }
            function errorFunc(data) {
                console.log('error getting data about user courses');
            }
        };
        this.populateSelectUser = function () {
            //console.log("populating select user");
            var selectId = "#user_user_select";
            var users = _this.Users;
            var output = [];
            $(selectId).find('option').remove().end();
            output.push('<option value="' + "0" + '">' + "Novi korisnik" + '</option>');
            for (var i = 0; i < users.length; i++) {
                output.push('<option value="' + users[i].Id + '">' + users[i].LastName + " " + users[i].Name + '</option>');
            }
            $(selectId).html(output.join(''));
        };
        this.updateUser = function (nu) {
            var self = _this;
            var serviceURL = '/Settings/UpdateUser';
            $.ajax({
                type: "POST",
                url: serviceURL,
                data: nu,
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data, status) {
                if (status == "success") {
                    console.log("Succesfully updated user.");
                    self.getAllCourses();
                    self.getAllUsers();
                    $("#user_name").val("");
                    $("#user_last_name").val("");
                    $("#user_username").val("");
                }
                else {
                    console.log('Error updating user(1)');
                }
            }
            function errorFunc() {
                console.log('Error updating user(2)');
            }
        };
        this.updateUserData = function (id) {
            if (id == 0) {
                $("#user_name").val("");
                $("#user_last_name").val("");
                $("#user_username").val("");
                $("#user_select_role").val("Demonstrator");
                $("#user_password").val("");
                $("#user_password_again").val("");
                _this.createCourseCheckboxes(0);
            }
            if (_this.Users != null) {
                for (var i = 0; i < _this.Users.length; i++) {
                    if (id == _this.Users[i].Id) {
                        var u = _this.Users[i];
                        var role = "";
                        if (u.Role == 'A') {
                            role = "Administrator";
                        }
                        if (u.Role == 'D') {
                            role = "Demonstrator";
                        }
                        $("#user_name").val(u.Name);
                        $("#user_last_name").val(u.LastName);
                        $("#user_username").val(u.Username);
                        $("#user_select_role").val(role);
                        $("#user_password").val("");
                        $("#user_password_again").val("");
                        _this.createCourseCheckboxes(u.Id);
                    }
                }
            }
        };
        this.updateUserPassword = function (pu) {
            var self = _this;
            var serviceURL = '/Settings/UpdateUserPassword';
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
        };
        //-------------------------------USER END------------------------------------------------//
        //---------------------------------------------------------------------------------------//
        //---------------------------------------------------------------------------------------//
        //-------------------------------GROUP START---------------------------------------------//
        this.createGroup = function (g) {
            var self = _this;
            var serviceURL = '/Settings/CreateGroup';
            $.ajax({
                type: "POST",
                url: serviceURL,
                data: g,
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data, status) {
                console.log("Succesfully created group.", data, status);
                self.getAllCourses();
            }
            function errorFunc() {
                console.log('Error creating new group');
            }
        };
        this.deleteGroup = function (groupId) {
            var self = _this;
            var serviceURL = '/Settings/DeleteGroup';
            $.ajax({
                type: "DELETE",
                url: serviceURL + "?groupId=" + groupId,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: successFunc,
                error: errorFunc
            });
            function successFunc(status) {
                console.log("group deleted!");
                self.getAllCourses();
            }
            function errorFunc(data) {
                console.log('error deleting group');
            }
        };
        this.getGroupData = function (groupId) {
            //console.log("getting group data");
            var self = _this;
            var serviceURL = '/Settings/GetGroup';
            $.ajax({
                type: "GET",
                url: serviceURL + "?groupId=" + groupId,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data, status) {
                var group = data;
                $("$group_owner_select").val(group.OwnerId);
            }
            function errorFunc() {
                console.log('error getting data about selected group');
            }
        };
        this.getGroupsByCourseId = function (selectGroupId, selectCourseId, needsNew, isTermSelect) {
            //console.log("getting groups for", selectGroupId, "and needNew is", needsNew.toString());
            var courseId = $(selectCourseId).val();
            if (selectGroupId == "#group_group_select") {
                $("#group_name").val("");
            }
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
                self.Groups = data;
                //console.log("------------------");console.log("courseSelectId: ", selectCourseId);console.log("groupSelectId: ", selectGroupId);console.log("groups: ", self.Groups);
                self.populateSelectGroup(selectGroupId, needsNew, isTermSelect);
            }
            function errorFunc(data) {
                console.log('error getting data about all groups for course with id', courseId, "\nreason:\n", data);
            }
        };
        this.getGroupsPossibleOwners = function () {
            //console.log("getting groups possible owners");
            var courseId = $('#group_course_select').val();
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
                self.GroupOwners = data;
                self.populateGroupOwners();
            }
            function errorFunc() {
                console.log('error getting data about all groups');
            }
        };
        this.populateSelectGroup = function (selectId, needsNew, isTermSelect) {
            //console.log("populating group select: ", selectId);
            var output = [];
            if (needsNew)
                output.push('<option value="' + "0" + '">' + "Nova grupa" + '</option>');
            if (isTermSelect)
                output.push('<option value="' + "-1" + '">' + "Sve grupe ovog kolegija" + '</option>');
            for (var i = 0; i < _this.Groups.length; i++) {
                var name = _this.Groups[i].Name;
                var id = _this.Groups[i].Id;
                output.push('<option value="' + id.toString() + '">' + name + '</option>');
            }
            $(selectId).find('option').remove().end();
            $(selectId).html(output.join(''));
            if (selectId == "#group_group_select") {
                _this.getGroupsPossibleOwners();
            }
            if (selectId == "#term_group_select") {
                _this.getTermsByGroupId();
            }
        };
        this.populateGroupOwners = function () {
            //console.log("populating group owners");
            var selectId = "#group_owner_select";
            var users = _this.GroupOwners;
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
                _this.getGroupData(groupId);
            }
        };
        this.updateGroup = function (g) {
            var self = _this;
            var serviceURL = '/Settings/UpdateGroup';
            $.ajax({
                type: "POST",
                url: serviceURL,
                data: g,
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data, status) {
                if (status == "success") {
                    console.log("Succesfully updated group.");
                    $("#group_group_select").val(g.Id);
                    self.getAllCourses();
                }
                else {
                    console.log('Error updating group(1)');
                }
            }
            function errorFunc() {
                console.log('Error updating group(2)');
            }
        };
        this.updateGroupData = function () {
            var groupId = $("#group_group_select").val();
            if (groupId == 0) {
                $("#group_name").val("");
            }
            else {
                var g = new GroupDTO;
                for (var i = 0; i < _this.Groups.length; i++) {
                    if (groupId == _this.Groups[i].Id) {
                        g = _this.Groups[i];
                    }
                }
                if (g == null) {
                    console.log("error choosing group");
                    return;
                }
                $("#group_owner_select").val(g.OwnerId);
                $("#group_name").val(g.Name);
            }
        };
        //-------------------------------GROUP END-----------------------------------------------//
        //---------------------------------------------------------------------------------------//
        //---------------------------------------------------------------------------------------//
        //-------------------------------TERM START----------------------------------------------//
        this.createTerm = function (t) {
            //console.log("creating term");
            var self = _this;
            var serviceURL = '/Settings/CreateTerm';
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
        };
        this.createTerms = function (t) {
            console.log("creating terms", t);
            console.log(t.TermDate);
            return;
            //nešto s datumima nešto ne znam
            var self = _this;
            var serviceURL = '/Settings/CreateTerms';
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
        };
        this.deleteTerm = function (termId) {
            //console.log("deleting term");
            var self = _this;
            var serviceURL = '/Settings/DeleteTerm';
            $.ajax({
                type: "DELETE",
                url: serviceURL + "?termId=" + termId,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
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
        };
        this.deleteTerms = function (t) {
            //console.log("deleting terms");
            var self = _this;
            var serviceURL = '/Settings/DeleteTerms';
            $.ajax({
                type: "DELETE",
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
        };
        this.getTermData = function (termId) {
            //console.log("getting term data");
            var self = _this;
            var serviceURL = '/Settings/GetTerm';
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
        this.getTermsByCourseId = function () {
            //console.log("getting term per course data");
            var courseId = $('#term_course_select').val();
            $("#term_name").val("");
            //console.log(courseId);
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
                self.Terms = data;
                console.log(self.Terms);
                self.populateSelectTerm();
            }
            function errorFunc(data) {
                console.log('error getting data about all terms for course with id', courseId, "\nreason:\n", data);
            }
        };
        this.getTermsByGroupId = function () {
            //console.log("getting term per course data");
            var groupId = $('#term_group_select').val();
            if (groupId == "-1") {
                _this.getTermsByCourseId();
                return;
            }
            $("#term_name").val("");
            //console.log(courseId);
            var self = _this;
            var serviceURL = '/Settings/GetTermsByGroupId';
            $.ajax({
                type: "GET",
                url: serviceURL + "?groupId=" + groupId,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: successFunc,
                error: errorFunc
            });
            function successFunc(data, status) {
                self.Terms = data;
                self.populateSelectTerm();
            }
            function errorFunc(data) {
                console.log('error getting data about all terms for course with id', groupId, "\nreason:\n", data);
            }
        };
        this.populateSelectTerm = function () {
            //console.log("------\npopulating select term");
            //console.log("Terms:\n",this.Terms);
            var selectId = "#term_term_select";
            var moreGroupsMode = false;
            if ($("#term_group_select").val() == "-1") {
                moreGroupsMode = true;
            }
            var output = [];
            output.push('<option value="' + "0" + '">' + "Novi termin" + '</option>');
            if (_this.Terms == null) {
                $(selectId).find('option').remove().end();
                $(selectId).html(output.join(''));
                return;
            }
            //console.log(this.Terms);
            for (var i = 0; i < _this.Terms.length; i++) {
                if (!moreGroupsMode) {
                    var date = _this.Terms[i].TermDate;
                    var realDate = parseInt(date.toString().substr(6, date.toString().trim().length - 8));
                    var realDate2 = new Date(realDate);
                    var dateStringified = realDate2.getDate() + "." + (realDate2.getMonth() + 1).toString() + "." + realDate2.getFullYear().toString();
                    _this.Terms[i].TermDate = new Date(realDate);
                    var id = _this.Terms[i].Id;
                    var outputMember = '<option value="' + id.toString() + '">' + dateStringified + '</option>';
                    output.push(outputMember);
                }
                else {
                    var date = _this.Terms[i].TermDate;
                    var realDate = parseInt(date.toString().substr(6, date.toString().trim().length - 8));
                    var realDate2 = new Date(realDate);
                    var dateStringified = realDate2.getDate() + "." + (realDate2.getMonth() + 1).toString() + "." + realDate2.getFullYear().toString();
                    _this.Terms[i].TermDate = new Date(realDate);
                    var id = 1;
                    var outputMember = '<option value="' + id.toString() + '">' + dateStringified + '</option>';
                    var alreadyExists = false;
                    if (output != null) {
                        for (var j = 0; j < output.length; j++) {
                            if (output[j] == outputMember) {
                                alreadyExists = true;
                                break;
                            }
                        }
                    }
                    if (!alreadyExists) {
                        output.push(outputMember);
                    }
                }
            }
            //console.log(output);
            $(selectId).find('option').remove().end();
            $(selectId).html(output.join(''));
            _this.updateTermData();
        };
        this.updateTerm = function (t) {
            //console.log("updating term");
            var self = _this;
            var serviceURL = '/Settings/UpdateTerm';
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
        };
        this.updateTerms = function (t) {
            //console.log("updating terms");
            var self = _this;
            var serviceURL = '/Settings/UpdateTerms';
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
        };
        this.updateTermData = function () {
            var termId = $("#term_term_select").val();
            //console.log("updating term data", termId);
            //console.log("Terms:", this.Terms);
            if (termId == 0) {
                var realDate2 = new Date();
                var year = realDate2.getFullYear().toString();
                var month = (realDate2.getMonth() + 1).toString();
                var day = realDate2.getDate().toString();
                var month = _this.minTwoDigits(parseInt(month));
                var day = _this.minTwoDigits(parseInt(day));
                //console.log("aaa:", year + "-" + month + "-" + day);
                $("#term_date").val(month + "/" + day + "/" + year);
            }
            else {
                var t = new TermDTO;
                for (var i = 0; i < _this.Terms.length; i++) {
                    if (termId == _this.Terms[i].Id) {
                        t = _this.Terms[i];
                    }
                }
                if (t == null) {
                    console.log("error choosing term");
                    return;
                }
                //console.log("updating term data",t);
                var date = t.TermDate;
                var realDate2 = date;
                var year = realDate2.getFullYear().toString();
                var month = (realDate2.getMonth() + 1).toString();
                var day = realDate2.getDate().toString();
                var month = _this.minTwoDigits(parseInt(month));
                var day = _this.minTwoDigits(parseInt(day));
                //console.log(year, month, day);
                $("#term_date").val(day + "/" + month + "/" + year);
            }
        };
        //-------------------------------TERM END------------------------------------------------//
        //---------------------------------------------------------------------------------------//
        //---------------------------------------------------------------------------------------//
        //-------------------------------CHOOSE FORM DATA START----------------------------------//
        this.populateSelectCourseName = function (selectId, studyName, needsNew) {
            //console.log("populating: ", selectId);
            var output = [];
            var names = [];
            var ids = [];
            for (var i = 0; i < _this.Courses.length; i++) {
                //console.log("Course:",this.Courses[i],"\n");
                var study = _this.Courses[i].Study;
                var course = _this.Courses[i].Name;
                var id = _this.Courses[i].Id;
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
            if (needsNew)
                output.push('<option value="' + "Novi kolegij" + '">' + "Novi kolegij" + '</option>');
            for (var i = 0; i < names.length; i++) {
                if (_this.Courses[i].Name != "" && _this.Courses[i].Name != null) {
                    output.push('<option value="' + ids[i].toString() + '">' + names[i] + '</option>');
                }
            }
            $(selectId).html(output.join(''));
            //console.log(output);
        };
        this.populateSelectStudy = function (selectId) {
            //console.log("-----------------------------\npopulating select study for id:",selectId);
            var studies = [];
            var output = [];
            for (var i = 0; i < _this.Courses.length; i++) {
                var x = (_this.Courses[i].Study).trim();
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
                if (studies[i] == "Računarstvo") {
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
            _this.populateSelectCourseName("#course_course_select", selectStudyValue, true);
            _this.populateSelectCourseName("#group_course_select", selectStudyValue, false);
            _this.populateSelectCourseName("#term_course_select", selectStudyValue, false);
        };
        //-------------------------------CHOOSE FORM DATA END------------------------------------//
        //---------------------------------------------------------------------------------------//
        //---------------------------------------------------------------------------------------//
        //----------------------------------COOKIE START-----------------------------------------//
        this.GetCookie = function (cname) {
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
        this.CheckCookie = function (cname) {
            var loginData = _this.GetCookie(cname);
            if (loginData != "") {
                return loginData;
            }
            else {
                return "";
            }
        };
        //----------------------------------COOKIE END-------------------------------------------//
        //---------------------------------------------------------------------------------------//
        //---------------------------------------------------------------------------------------//
        //-----------------------AUTHORIZATION & AUTHENTICATION START----------------------------//
        this.LoginCheck = function () {
            var loginDataCookie = _this.CheckCookie("LoginData");
            if (loginDataCookie != "") {
                var loginData = new LoginDataSBM();
                loginData.Username = loginDataCookie.split(' ')[0];
                loginData.Password = loginDataCookie.split(' ')[1];
                _this.getUser(loginData.Username);
            }
            else {
                alert(_this.warning_not_logged_in);
                location.href = _this.link_main + _this.link_login;
            }
        };
        this.UserCheck = function () {
            if (_this.ActiveUser != null) {
                if (_this.ActiveUser.Role == "A") {
                    _this.ActivateAdministrator();
                }
                else {
                    _this.ActivateRegularUser();
                }
            }
            else {
                alert(_this.warning_not_logged_in);
                location.href = _this.link_main + _this.link_login;
            }
        };
        this.ActivateAdministrator = function () {
            $("#adminSettings").css("visibility", "visible");
            _this.getAllCourses();
            _this.getAllUsers();
            _this.setTodayDate();
        };
        this.ActivateRegularUser = function () {
            $("#adminSettings").css("visibility", "collapse");
        };
        //-----------------------AUTHORIZATION & AUTHENTICATION END------------------------------//
        //---------------------------------------------------------------------------------------//
        this.test = function () {
            console.log("test function");
        };
        this.minTwoDigits = function (n) {
            return (n < 10 ? '0' : '') + n;
        };
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
        var self = this;
        //console.log("constructor: settings");
        $(document).ready(function () {
            //password update
            $('#password_save').on("click", function () {
                self.button_savePassword();
            });
            //add/edit user form
            $('#user_save').on("click", function () {
                self.button_saveUser();
            });
            $('#user_delete').on("click", function () {
                self.button_deleteUser();
            });
            $('#user_user_select').on("change", function () {
                //console.log("hello4");
                var value = $('#user_user_select').val();
                self.updateUserData(value);
            });
            //add/edit course form
            $('#course_course_select').on("change", function () {
                self.updateCourseData();
            });
            $('#course_delete').on("click", function () {
                self.button_deleteCourse();
            });
            $('#course_save').on("click", function () {
                self.button_saveCourse();
            });
            $('#course_study_select').on("change", function () {
                var value = $("#course_study_select").val();
                self.populateSelectCourseName("#course_course_select", value, true);
            });
            //add/edit group form
            $('#group_course_select').on("change", function () {
                self.getGroupsByCourseId("#group_group_select", "#group_course_select", true, false);
            });
            $('#group_delete').on("click", function () {
                self.button_deleteGroup();
            });
            $('#group_group_select').on("change", function () {
                self.updateGroupData();
            });
            $('#group_save').on("click", function () {
                self.button_saveGroup();
            });
            $('#group_study_select').on("change", function () {
                //console.log("hello2");
                var value = $("#group_study_select").val();
                self.populateSelectCourseName("#group_course_select", value, false);
                self.getGroupsByCourseId("#group_group_select", "#group_course_select", true, false);
            });
            //add/edit term form
            $('#term_course_select').on("change", function () {
                //console.log("hello2");
                var value = $("#term_course_select").val();
                self.getGroupsByCourseId("#term_group_select", "#term_course_select", false, true);
                self.populateSelectTerm();
            });
            $('#term_delete').on("click", function () {
                self.button_deleteTerm();
            });
            $('#term_group_select').on("change", function () {
                self.getTermsByGroupId();
                self.updateTermData();
            });
            $('#term_save').on("click", function () {
                self.button_saveTerm();
            });
            $('#term_study_select').on("change", function () {
                var value = $("#term_study_select").val();
                self.populateSelectCourseName("#term_course_select", value, false);
                self.getGroupsByCourseId("#term_group_select", "#term_course_select", false, true);
                self.getTermsByCourseId();
            });
            $('#term_term_select').on("change", function () {
                self.updateTermData();
            });
            $("#term_date").datepicker();
            $('#myUl').css("visibility", "visible");
        });
    }
    SettingsVM.prototype.checkIfCorrectPassword = function (userId, oldPassword, newPassword) {
        var self = this;
        var pu = new PasswordUpdaterBM();
        pu.Password = oldPassword;
        pu.UserId = userId;
        var serviceURL = '/Settings/CheckIfCorrectPassword';
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
    };
    return SettingsVM;
}());
var MyUserBM = (function () {
    function MyUserBM() {
        this.Courses = new Array();
    }
    return MyUserBM;
}());
var MyUserDTO = (function () {
    function MyUserDTO() {
    }
    return MyUserDTO;
}());
var TermDTO = (function () {
    function TermDTO() {
        this.TermDate = new Date();
    }
    return TermDTO;
}());
var CourseDTO = (function () {
    function CourseDTO() {
    }
    return CourseDTO;
}());
var CourseBM = (function () {
    function CourseBM() {
    }
    return CourseBM;
}());
var GroupDTO = (function () {
    function GroupDTO() {
    }
    return GroupDTO;
}());
var CourseUserDTO = (function () {
    function CourseUserDTO() {
    }
    return CourseUserDTO;
}());
var LoginDataSBM = (function () {
    function LoginDataSBM() {
    }
    return LoginDataSBM;
}());
var PasswordUpdaterBM = (function () {
    function PasswordUpdaterBM() {
    }
    return PasswordUpdaterBM;
}());