$(document).ready(() => {
    var s = new SettingsVM();
    s.LoginCheck();
    //s.populateSelectStudy();

});

class SettingsVM {
    //-------------------------------------primitive-----------------------------------//
    public Courses: CourseDTO_S[];
    public Users: UserDTO_S[];
    public ActiveUser: UserDTO_S;
    public UserCourses: CourseUserDTO_S[];
    public CourseCourse: CourseDTO_S;
    public Groups: GroupDTO_S[];
    public GroupOwners: UserDTO_S[];
    public Terms: TermDTO_S[];
    public LoginData: LoginDataM_S;

    public warning_blank_field = "Molim popunite sva polja!";
    public warning_delete_new = "Pogreska pri odabiru";
    public warning_password_match = "Provjerite lozinku!";
    public warning_not_logged_in = "Molim ulogirajte se!";

    public link_main = "http://localhost:49977";
    public link_settings = "/Settings/Settings";
    public link_table= "/Table/Table";
    public link_login= "/Login/Login";
    

    constructor() {
        var self = this;
        //console.log("constructor: settings");
        $(document).ready(function () {





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
                //console.log("hello4");
                var value = $('#user_user_select').val();
                self.updateUserData(value);
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


            $('#myUl').css("visibility", "visible");

        });
    }
    //---------------------------------------------------------------------------------------//
    //-------------------------------BUTTONS START-------------------------------------------//
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
        var userName = $("#user_name").val();
        var userLastName = $("#user_last_name").val();
        var userUsername = $("#user_username").val();
        var userRole = $("#user_select_role :selected").val();
        userRole = userRole.substr(0, 1);

        var password = $("#user_password").val().trim();
        var passwordAgain = $("#user_password_again").val().trim();

        if (userName == "" || userLastName == "" || userUsername == "") {
            alert(this.warning_blank_field);
            return;
        }

        if (password != "" || passwordAgain != "") {
            //this means that administrator is trying to change the password
            changingPassword = true;
            console.log("u be tryin to change password");
        }

        var userCoursesHelper: CourseDTO_S[] = new Array<CourseDTO_S>();
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
            var nu: UserM_S = new UserM_S();
            nu.Id = 0;
            nu.Name = userName;
            nu.LastName = userLastName;
            nu.Username = userUsername;
            nu.Role = userRole;
            nu.Courses = userCoursesHelper;
            if (password == "" || passwordAgain == "") {
                alert(this.warning_blank_field);
                return;
            }
            else {
                if (password != passwordAgain) {
                    alert(this.warning_password_match);
                    return;
                }
                nu.Password = password;
            }
            this.createUser(nu);
        }
        //if updating old user
        else {
            if (!changingPassword) {
                console.log("updating user without pass");
                var nu: UserM_S = new UserM_S();
                nu.Id = userId;
                nu.Name = userName;
                nu.LastName = userLastName;
                nu.Username = userUsername;
                nu.Role = userRole;
                nu.Courses = userCoursesHelper;
                nu.Password = "";
                //console.log(nu);
                this.updateUser(nu);
            }
            else {
                console.log("updating user with pass");
                var nu: UserM_S = new UserM_S();
                nu.Id = userId;
                nu.Name = userName;
                nu.LastName = userLastName;
                nu.Username = userUsername;
                nu.Role = userRole;
                nu.Courses = userCoursesHelper;
                if (password == "" || passwordAgain == "") {
                    alert(this.warning_blank_field);
                    return;
                }
                else {
                    if (password != passwordAgain) {
                        alert(this.warning_password_match);
                        return;
                    }
                    nu.Password = password;
                }
                this.updateUser(nu);
            }
        }

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
        var ownerId =$("#group_owner_select").val();
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
        if (termDate == "" || groupId == "" || courseId=="") {
            alert(this.warning_blank_field);
            return;
        }
        if (groupId=="-1" && termId == "0") {
            //console.log("Making a new term for all groups");
            t.Id = 0;
            //console.log(t);
            this.createTerms(t);
        }
        else if (groupId=="-1" && termId!="0"){
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
        self.LoginCheck();
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
        var obj = new AuthCourse();
        obj.LoginData = self.LoginData;
        obj.Course = c;
        var serviceURL = '/Settings/CreateCourse';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: obj,
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
    public createCourseCheckboxes = (userId: number) => {
        var container = document.getElementById("user_user_course");
        $("#user_user_course").text("");
        if (userId == 0) {
            //new user
            //give him all the checkboxes        
            for (var i = 0; i < this.Courses.length; i++) {
                var c = this.Courses[i];
                var checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.name = c.Study + " " + c.Name;
                checkbox.value = c.Id.toString();
                checkbox.id = "id";
                checkbox.defaultChecked = false;
                checkbox.className = "checkbox1";

                container.appendChild(checkbox);
                this.createCourseCheckboxesHelp(c);                   
            }
        }
        else {            
            this.getUserCourses(userId);
        }
    }
    public createCourseCheckboxes2 = (userId: number) => {
        var container = document.getElementById("user_user_course");
        $("#user_user_course").text("");
        for (var i = 0; i < this.Courses.length; i++) {
            var c = this.Courses[i];
            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.name = c.Study + " " + c.Name;
            checkbox.value = c.Id.toString();
            checkbox.id = "user_user_course_" + userId + "_" + c.Id;
            checkbox.className = "checkbox1";                   

            for (var j = 0; j < this.UserCourses.length; j++) {
                var uc = this.UserCourses[j];
                if (uc.CourseId == c.Id) {
                    checkbox.defaultChecked = true;
                }
            }
            container.appendChild(checkbox);
            this.createCourseCheckboxesHelp(c);            
        }
        

    }
    public createCourseCheckboxesHelp = (c: CourseDTO_S) => {
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
        var obj = new AuthCourseId();
        obj.LoginData = self.LoginData;
        obj.CourseId = courseId;
        var serviceURL = '/Settings/DeleteCourse';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: obj,
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
        var serviceURL = '/Table/AllCollegeCourses';
        $.ajax({
            type: "GET",
            url: serviceURL,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data: CourseDTO_S[], status) {
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
    }
    public updateCourse = (c: CourseM_S) => {
        var self = this;
        var obj = new AuthCourse();
        obj.LoginData = self.LoginData;
        obj.Course = c;
        var serviceURL = '/Settings/UpdateCourse';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: obj,
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
    public createUser = (nu: UserM_S) => {
        var self = this;
        var obj = new AuthMyUserWithPassBM();
        obj.LoginData = self.LoginData;
        obj.MyUserWithPass = nu;
        var serviceURL = '/Settings/CreateUser';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: obj,
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
    public checkIfCorrectPassword(userId:number, oldPassword:string, newPassword:string) {
        var self = this;
        var pu: PasswordUpdaterM_S = new PasswordUpdaterM_S();
        pu.Password = oldPassword;
        pu.UserId = userId;
        var obj = new AuthPasswordUpdater();
        obj.LoginData = self.LoginData;
        obj.PasswordUpdater = pu;
        var serviceURL = '/Settings/CheckIfCorrectPassword';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: obj,
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
        var obj = new AuthUserId();
        obj.LoginData = self.LoginData;
        obj.UserId = userId;
        var serviceURL = '/Settings/DeleteUser';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: obj,
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
        var serviceURL = '/Settings/GetUsers';
        $.ajax({
            type: "GET",
            url: serviceURL,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: successFunc,
            error: errorFunc
        });
        function successFunc(data: UserDTO_S[], status) {
            self.Users = data;
            self.populateSelectUser();
        }
        function errorFunc(data) {
            console.log('error getting data about all users', data);
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
        function successFunc(data: UserDTO_S, status) {
            if (data != null) {
                self.ActiveUser = new UserDTO_S();
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
    public getUserCourses = (userId:number) => {
        var self = this;
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
    public updateUser = (nu: UserM_S) => {
        //console.log("updating user", nu);
        var self = this;
        var obj = new AuthMyUserWithPassBM();
        obj.LoginData = self.LoginData;
        obj.MyUserWithPass = nu;
        console.log(obj);
        var serviceURL = '/Settings/UpdateUser';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: obj,
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
    }
    public updateUserData = (id: number) => {
        if (id == 0) {
            $("#user_name").val("");
            $("#user_last_name").val("");
            $("#user_username").val("");
            $("#user_select_role").val("Demonstrator");
            $("#user_password").val("");
            $("#user_password_again").val("");
            this.createCourseCheckboxes(0);
        }
        if (this.Users != null) {
            for (var i = 0; i < this.Users.length; i++) {
                if (id == this.Users[i].Id) {
                    var u = this.Users[i];
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
                    this.createCourseCheckboxes(u.Id);
                }
            }
        }
    }
    public updateUserPassword = (pu: PasswordUpdaterM_S) => {
        var self = this;
        var obj = new AuthPasswordUpdater();
        obj.LoginData = self.LoginData;
        obj.PasswordUpdater = pu;
        var serviceURL = '/Settings/UpdateUserPassword';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: obj,
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
        var self = this;
        var obj = new AuthGroup();
        obj.LoginData = self.LoginData;
        obj.GroupDTO = g;
        var serviceURL = '/Settings/CreateGroup';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: obj,
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
    }    
    public deleteGroup = (groupId: number) => {
        var self = this;
        var obj = new AuthGroupId();
        obj.LoginData = self.LoginData;
        obj.GroupId = groupId;
        var serviceURL = '/Settings/DeleteGroup';
        $.ajax({
            type: "POST",
            data: obj,
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
    }
    public getGroupData = (groupId) => {
        //console.log("getting group data");
        var self = this;
        var serviceURL = '/Settings/GetGroup';
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
        var serviceURL = '/Settings/GetGroupsByCourseId';
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
            console.log('error getting data about all groups for course with id',courseId,"\nreason:\n",data);
        }

    }
    public getGroupsPossibleOwners = () => {
        //console.log("getting groups possible owners");
        var courseId = $('#group_course_select').val();
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
        if (groupId!="0") {
            this.getGroupData(groupId);
        }
    }
    public updateGroup = (g: GroupDTO_S) => {
        var self = this;
        var obj = new AuthGroup();
        obj.LoginData = self.LoginData;
        obj.GroupDTO = g;
        var serviceURL = '/Settings/UpdateGroup';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: obj,
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
        var obj = new AuthTerm();
        obj.LoginData = self.LoginData;
        obj.Term = t;
        var serviceURL = '/Settings/CreateTerm';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: obj,
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
        var obj = new AuthTerm();
        obj.LoginData = self.LoginData;
        obj.Term = t;
        var serviceURL = '/Settings/CreateTerms';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: obj,
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
        var obj = new AuthTermId();
        obj.LoginData = self.LoginData;
        obj.TermId = termId;
        var serviceURL = '/Settings/DeleteTerm';
        $.ajax({
            type: "POST",
            data: obj,
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
        var obj = new AuthTerm();
        obj.LoginData = self.LoginData;
        obj.Term = t;
        var serviceURL = '/Settings/DeleteTerms';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: obj,
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
        var serviceURL = '/Settings/GetTerm';
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
        var serviceURL = '/Settings/GetTermsByGroupId';
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
                var date = this.Terms[i].TermDate.substring(0,10);
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
        var obj = new AuthTerm();
        obj.LoginData = self.LoginData;
        obj.Term = t;
        var serviceURL = '/Settings/UpdateTerm';
        $.ajax({
            type: "POST",
            url: serviceURL,
            data: obj,
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
        var obj = new AuthTerm();
        obj.LoginData = self.LoginData;
        obj.Term = t;
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
            console.log("updating term dataaa",t);
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
        if(needsNew) output.push('<option value="' + "Novi kolegij"+ '">' + "Novi kolegij" + '</option>');
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
        this.populateSelectCourseName("#course_course_select",selectStudyValue, true);
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
        catch(err)
        {
            return "";
        }
    }
    public CheckCookie=(cname)=> {
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
    public LoginCheck = () => {
        var loginDataCookie = this.CheckCookie("LoginData");
        if (loginDataCookie != "") {
            this.LoginData = new LoginDataM_S();
            this.LoginData.Username = loginDataCookie.split(' ')[0];
            this.LoginData.Password = loginDataCookie.split(' ')[1];
            this.getUser(this.LoginData.Username);
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
        this.getAllUsers();
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
    public Id:number;
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
    public Id:number;
    public Name:string;
    public Study:string;
    public Professor:string;
    public Asistant:string;
}
class GroupDTO_S{
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
class AuthUserId {
    LoginData: LoginDataM_S;
    UserId: number;
}
class AuthMyUserWithPassBM {
    LoginData: LoginDataM_S;
    MyUserWithPass: UserM_S;
}
class AuthPasswordUpdater {
    LoginData: LoginDataM_S;
    PasswordUpdater: PasswordUpdaterM_S;
}
class AuthCourse {
    LoginData: LoginDataM_S;
    Course: CourseM_S;
}
class AuthCourseId {
    LoginData: LoginDataM_S;
    CourseId: number;
}
class AuthGroup {
    LoginData: LoginDataM_S;
    GroupDTO: GroupDTO_S;
}
class AuthGroupId {
    LoginData: LoginDataM_S;
    GroupId: number;
}
class AuthTerm {
    LoginData: LoginDataM_S;
    Term: TermDTO_S;
}
class AuthTermId {
    LoginData: LoginDataM_S;
    TermId: number;
}