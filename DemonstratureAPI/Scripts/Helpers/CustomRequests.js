define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Requests {
        constructor() {
            this.messageError = "Error! ";
        }
        getTerms(courseId, posOnX, posOnY) {
            //console.log("getting terms: ", courseId, "\nmoveX=", self.posOnX, "\nmoveY=", self.posOnY);
            var self = this;
            var serviceURL = '/Term/ByCourseIdNavigation';
            $.ajax({
                type: "GET",
                url: serviceURL + "?courseId=" + courseId + "&movedRight=" + posOnX + "&movedDown=" + posOnY,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data, status) {
                    return data;
                },
                error: function (status) {
                    //console.log('error getting Terms', status);
                    return self.messageError + "Get terms.";
                }
            });
        }
    }
    exports.Requests = Requests;
    class Requests2 {
        test() {
            console.log("test");
        }
    }
    exports.Requests2 = Requests2;
});
//export default Requests; 
//# sourceMappingURL=CustomRequests.js.map