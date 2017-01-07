using DemonstratureBLL;
using DemonstratureCM.BM;
using DemonstratureCM.DTO;
using System.Web.Http;
using System.Web.Mvc;

namespace DemonstratureAPI.Controllers
{
    public class SettingsController : Controller
    {
        public ActionResult Settings()
        {
            ViewBag.Title = "Settings Page";
            return View();
        }
        //---------------------------------------------------USER--------------------------------//
        [System.Web.Mvc.HttpGet]
        public ActionResult GetUsers()
        {
            var instance = new UserLogic();
            var result = instance.GetUser();
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult GetUser([FromUri]int userId)
        {
            var instance = new UserLogic();
            var result = instance.GetUser(userId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult GetUsersByCourseId([FromUri]int courseId)
        {
            var instance = new UserLogic();
            var result = instance.GetUsersByCourseId(courseId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpDelete]
        public ActionResult DeleteUser([FromUri]int userId)
        {
            var instance = new UserLogic();
            var result = instance.DeleteUser(userId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult UserByUsername([FromUri]string username)
        {
            var instance = new UserLogic();
            var result = instance.GetUser(username);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult CreateUser([FromBody]MyUserWithPassBM u)
        {
            var instance = new UserLogic();
            var result = instance.CreateUser(u);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult UpdateUser([FromBody]MyUserWithPassBM u)
        {
            var instance = new UserLogic();
            var result = instance.UpdateUser(u);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }
        
        [System.Web.Mvc.HttpPost]
        public ActionResult CheckIfCorrectPassword([FromBody]PasswordUpdaterBM pu)
        {
            var instance = new UserLogic();
            var result = instance.CheckIfCorrectPassword(pu);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult UpdateUserPassword([FromBody]PasswordUpdaterBM pu)
        {
            var instance = new UserLogic();
            var result = instance.UpdateUserPassword(pu);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        //---------------------------------------------------COURSE------------------------------//
        [System.Web.Mvc.HttpPost]
        public ActionResult CreateCourse(CourseBM c)
        {
            var instance = new CourseLogic();
            var result = instance.CreateCourse(c);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpDelete]
        public ActionResult DeleteCourse([FromUri]int courseId)
        {
            var instance = new CourseLogic();
            var result = instance.DeleteCourse(courseId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }
        [System.Web.Mvc.HttpPost]
        public ActionResult UpdateCourse(CourseBM c)
        {
            var instance = new CourseLogic();
            var result = instance.UpdateCourse(c);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult GetUserCourses([FromUri]int userId)
        {
            var instance = new UserLogic();
            var result = instance.GetUserCourses(userId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        //---------------------------------------------------GROUP------------------------------//

        [System.Web.Mvc.HttpGet]
        public ActionResult GetGroup([FromUri]int groupId)
        {
            var instance = new GroupLogic();
            var result = instance.GetGroup(groupId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult GetGroupsByCourseId([FromUri]int courseId)
        {
            var instance = new GroupLogic();
            var result = instance.GetGroupsByCourseId(courseId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult CreateGroup(GroupDTO g)
        {
            var instance = new GroupLogic();
            var result = instance.CreateGroup(g);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpDelete]
        public ActionResult DeleteGroup([FromUri]int groupId)
        {
            var instance = new GroupLogic();
            var result = instance.DeleteGroup(groupId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult UpdateGroup(GroupDTO g)
        {
            var instance = new GroupLogic();
            var result = instance.UpdateGroup(g);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }



        //---------------------------------------------------TERM-------------------------------//

        [System.Web.Mvc.HttpGet]
        public ActionResult GetTerm([FromUri]int termId)
        {
            var instance = new TermLogic();
            var result = instance.GetTerm(termId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult GetTermsByCourseId([FromUri]int courseId)
        {
            var instance = new TermLogic();
            var result = instance.GetTermsByCourseId(courseId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }
        
        [System.Web.Mvc.HttpGet]
        public ActionResult GetTermsByGroupId([FromUri]int groupId)
        {
            var instance = new TermLogic();
            var result = instance.GetTermsByGroupId(groupId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult CreateTerm(TermDTO g)
        {
            var instance = new TermLogic();
            var result = instance.CreateTerm(g);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult CreateTerms(TermDTO g)
        {
            var instance = new TermLogic();
            var result = instance.CreateTerms(g);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpDelete]
        public ActionResult DeleteTerm([FromUri]int termId)
        {
            var instance = new TermLogic();
            var result = instance.DeleteTerm(termId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpDelete]
        public ActionResult DeleteTerms([FromUri]TermDTO t)
        {
            var instance = new TermLogic();
            var result = instance.DeleteTerms(t);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult UpdateTerm(TermDTO g)
        {
            var instance = new TermLogic();
            var result = instance.UpdateTerm(g);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult UpdateTerms(TermDTO g)
        {
            var instance = new TermLogic();
            var result = instance.UpdateTerms(g);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

    }
}