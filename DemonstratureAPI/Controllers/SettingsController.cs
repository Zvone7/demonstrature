using DemonstratureBLL;
using DemonstratureCM.Auth;
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

        [System.Web.Mvc.HttpPost]
        public ActionResult DeleteUser([FromBody]AuthUserId obj)
        {
            var instance = new UserLogic();
            var ld = obj.LoginData;
            if (instance.CheckAdmin(ld))
            {
                var userId = obj.UserID;
                var result = instance.DeleteUser(userId);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return null;
            }
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
        public ActionResult CreateUser([FromBody]AuthMyUserWithPassBM obj)
        {
            var instance = new UserLogic();
            var ld = obj.LoginData;
            if (instance.CheckAdmin(ld))
            {
                var u = obj.MyUserWithPass;
                var result = instance.CreateUser(u);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else return null;
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult UpdateUser([FromBody]AuthMyUserWithPassBM obj)
        {
            var instance = new UserLogic();
            var ld = obj.LoginData;
            if (instance.CheckAdmin(ld))
            {
                var u = obj.MyUserWithPass;
                var result = instance.UpdateUser(u);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else return null;
        }
        
        [System.Web.Mvc.HttpPost]
        public ActionResult CheckIfCorrectPassword([FromBody]AuthPasswordUpdaterBM obj)
        {
            var instance = new UserLogic();
            var ld = obj.LoginData;
            if (instance.CheckAdmin(ld))
            {
                var pu = obj.PasswordUpdater;
                var result = instance.CheckIfCorrectPassword(pu);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else return null;
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult UpdateUserPassword([FromBody]AuthPasswordUpdaterBM obj)
        {
            var instance = new UserLogic();
            var ld = obj.LoginData;
            if (instance.CheckAdmin(ld))
            {
                var pu = obj.PasswordUpdater;
                var result = instance.UpdateUserPassword(pu);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else return null;
        }

        //---------------------------------------------------COURSE------------------------------//
        [System.Web.Mvc.HttpPost]
        public ActionResult CreateCourse([FromBody]AuthCourseBM obj)
        {
            if (new UserLogic().CheckAdmin(obj.LoginData))
            {
                var instance = new CourseLogic();
                var result = instance.CreateCourse(obj.Course);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else return null;
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult DeleteCourse([FromBody]AuthCourseId obj)
        {
            if (new UserLogic().CheckAdmin(obj.LoginData))
            {
                var instance = new CourseLogic();
                var result = instance.DeleteCourse(obj.CourseId);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else return null;
        }
        [System.Web.Mvc.HttpPost]
        public ActionResult UpdateCourse([FromBody]AuthCourseBM obj)
        {
            if (new UserLogic().CheckAdmin(obj.LoginData))
            {
                var instance = new CourseLogic();
                var result = instance.UpdateCourse(obj.Course);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else return null;
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
        public ActionResult CreateGroup([FromBody]AuthGroupDTO obj)
        {
            if (new UserLogic().CheckAdmin(obj.LoginData))
            {
                var instance = new GroupLogic();
                var result = instance.CreateGroup(obj.Group);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else return null;
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult DeleteGroup([FromUri]AuthGroupId obj)
        {
            if (new UserLogic().CheckAdmin(obj.LoginData))
            {
                var instance = new GroupLogic();
                var result = instance.DeleteGroup(obj.GroupId);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else return null;
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult UpdateGroup([FromBody]AuthGroupDTO obj)
        {
            if (new UserLogic().CheckAdmin(obj.LoginData))
            {
                var instance = new GroupLogic();
                var result = instance.UpdateGroup(obj.Group);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else return null;
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
        public ActionResult CreateTerm([FromBody]AuthTermDTO obj)
        {
            if (new UserLogic().CheckAdmin(obj.LoginData))
            {
                var instance = new TermLogic();
                var result = instance.CreateTerm(obj.Term);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else return null;
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult CreateTerms([FromBody]AuthTermDTO obj)
        {
            if (new UserLogic().CheckAdmin(obj.LoginData))
            {
                var instance = new TermLogic();
                var result = instance.CreateTerms(obj.Term);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else return null;
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult DeleteTerm([FromBody]AuthTermId obj)
        {
            if (new UserLogic().CheckAdmin(obj.LoginData))
            {
                var instance = new TermLogic();
                var result = instance.DeleteTerm(obj.TermId);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else return null;
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult DeleteTerms([FromBody]AuthTermDTO obj)
        {
            if (new UserLogic().CheckAdmin(obj.LoginData))
            {
                var instance = new TermLogic();
                var result = instance.DeleteTerms(obj.Term);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else return null;
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult UpdateTerm([FromBody]AuthTermDTO obj)
        {
            if (new UserLogic().CheckAdmin(obj.LoginData))
            {
                var instance = new TermLogic();
                var result = instance.UpdateTerm(obj.Term);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else return null;
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult UpdateTerms([FromBody]AuthTermDTO obj)
        {
            if (new UserLogic().CheckAdmin(obj.LoginData))
            {
                var instance = new TermLogic();
                var result = instance.UpdateTerms(obj.Term);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else return null;
        }

    }
}