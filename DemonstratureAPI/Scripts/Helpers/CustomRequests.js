//function getStudies(self) {
//    //console.log("gettingStudies");
//    var serviceURL = '/Course/AllStudies';
//    $.ajax({
//        type: "GET",
//        url: serviceURL,
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: successFunc,
//        error: errorFunc
//    });
//    function successFunc(data, status) {
//        for (var i = 0; i < data.length; i++) {
//            var study = ko.observable<string>(data[i]);
//            self.Studies_KO.push(study());
//        }
//        self.createEmptyCourseCheckboxes(0);
//    }
//    function errorFunc() {
//        console.log('error getting data about all courses');
//    }
//}
//function createCourse(self, c: CourseM_S) {
//    var serviceURL = '/Course/CreateCourse';
//    $.ajax({
//        type: "POST",
//        url: serviceURL,
//        data: c,
//        success: successFunc,
//        error: errorFunc
//    });
//    function successFunc(data, status) {
//        console.log("Succesfully created course.", data, status);
//        self.getCourses();
//    }
//    function errorFunc() {
//        console.log('Error creating new course');
//    }
//}
//function deleteCourse(self, courseId: number) {
//    var serviceURL = '/Course/Delete';
//    $.ajax({
//        type: "DELETE",
//        url: serviceURL,
//        data: courseId,
//        success: successFunc,
//        error: errorFunc
//    });
//    function successFunc(status) {
//        console.log("course deleted!");
//        self.getCourses();
//    }
//    function errorFunc(data) {
//        console.log('error deleting course');
//    }
//}
//function getCourses(self) {
//    var serviceURL = '/Course/Courses';
//    $.ajax({
//        type: "GET",
//        url: serviceURL,
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: successFunc,
//        error: errorFunc
//    });
//    function successFunc(data: KoCourse[], status) {
//        for (var i = 0; i < data.length; i++) {
//            var crs = ko.observable<KoCourse>(data[i]);
//            self.Courses_KO.push(crs());
//        }
//    }
//    function errorFunc() {
//        console.log('error getting data about all courses');
//    }
//}
//function getCoursesByStudy(self, study) {
//    var serviceURL = '/Course/CoursesByStudy';
//    $.ajax({
//        type: "GET",
//        url: serviceURL + '?study=' + study,
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: successFunc,
//        error: errorFunc
//    });
//    function successFunc(data: KoCourse[], status) {
//        self.SelectableCourses_KO([]);
//        for (var i = 0; i < data.length; i++) {
//            var crs = ko.observable<KoCourse>(data[i]);
//            self.SelectableCourses_KO.push(crs());
//        }
//        self.createEmptyCourseCheckboxes(0);
//    }
//    function errorFunc() {
//        console.log('error getting data about all courses');
//    }
//}
//function updateCourse(self, c: CourseM_S) {
//    var serviceURL = '/Course/Update';
//    $.ajax({
//        type: "POST",
//        url: serviceURL,
//        data: c,
//        success: successFunc,
//        error: errorFunc
//    });
//    function successFunc(data, status) {
//        if (status == "success") {
//            console.log("Succesfully updated course.");
//            getCourses(self);
//        }
//        else {
//            console.log('Error updating course(1)');
//        }
//    }
//    function errorFunc() {
//        console.log('Error updating course(2)');
//    }
//}
//function createOrUpdateUser (self, user: KoUser) {
//    var serviceURL = '/User/CreateOrUpdate';
//    $.ajax({
//        type: "POST",
//        url: serviceURL,
//        data: user,
//        success: successFunc,
//        error: errorFunc
//    });
//    function successFunc(data, status) {
//        console.log("Succesfully created user.", data, status);
//        //self.getAllCourses();
//        getAllUsers(self);
//        self.SelectedUser_KO(data);
//        console.log(self.SelectedUser_KO());
//        $("user_user_select").val(self.SelectedUser_KO().Id);
//    }
//    function errorFunc() {
//        console.log('Error creating new user');
//    }
//}
//function getAllUsers(self) {
//    //console.log("getting all users");
//    var self = this;
//    var serviceURL = '/User/All';
//    $.ajax({
//        type: "GET",
//        url: serviceURL,
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: successFunc,
//        error: errorFunc
//    });
//    function successFunc(data: KoUser[], status) {
//        return data;
//    }
//    function errorFunc(data) {
//        console.log('error getting data about all users', data);
//    }
//}
//# sourceMappingURL=CustomRequests.js.map