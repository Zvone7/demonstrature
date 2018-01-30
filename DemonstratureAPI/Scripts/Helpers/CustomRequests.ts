export class Requests {
    private messageError:string = "Error! ";
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

export class Requests2 {
    test() {
        console.log("test");
    }
}
//export default Requests;