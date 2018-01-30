"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Requests = (function () {
    function Requests() {
        this.messageError = "Error! ";
    }
    Requests.prototype.getTerms = function (courseId, posOnX, posOnY) {
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
    };
    return Requests;
}());
exports.Requests = Requests;
var Requests2 = (function () {
    function Requests2() {
    }
    Requests2.prototype.test = function () {
        console.log("test");
    };
    return Requests2;
}());
exports.Requests2 = Requests2;
//export default Requests; 
//# sourceMappingURL=Requests.js.map