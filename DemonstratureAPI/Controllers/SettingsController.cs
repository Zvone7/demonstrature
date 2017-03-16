using DemonstratureAPI.Models;
using DemonstratureBLL;
using DemonstratureCM.Auth;
using DemonstratureCM.BM;
using DemonstratureCM.DTO;
using System;
using System.Linq;
using System.Security.Claims;
using System.Web.Http;
using System.Web.Mvc;

namespace DemonstratureAPI.Controllers
{
    public class SettingsController : Controller
    {
        public ActionResult Settings()
        {
            //gets user information
            var x = User.Identity as ClaimsIdentity;
            var id = x.Claims.FirstOrDefault(a => a.Type.Equals(ClaimTypes.NameIdentifier)).Value;
            var role = x.Claims.FirstOrDefault(a => a.Type.Equals(ClaimTypes.Role)).Value;
            var name = x.Claims.FirstOrDefault(a => a.Type.Equals(ClaimTypes.Name)).Value;
            var username = x.Claims.FirstOrDefault(a => a.Type.Equals(ClaimTypes.GivenName)).Value;
            var model = new MyUserWithReturnUrl()
            {
                Id = Convert.ToInt32(id),
                Role = role,
                Name = name,
                Username = username
            };
            ViewBag.Title = "Settings Page";
            return View(model);
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
        public ActionResult DeleteUser([FromBody]int userId)
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
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult UpdateUser([FromBody]MyUserWithPassBM u)
        {
            var instance = new UserLogic();
                var result = instance.UpdateUser(u);
                return Json(result, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult CheckIfCorrectPassword([FromBody]PasswordUpdaterBM pu)
        {
            var instance = new UserLogic();
            var result = instance.CheckIfCorrectPassword(pu);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult UpdateUserPassword([FromBody]PasswordUpdaterBM pu)
        {
            var instance = new UserLogic();
                var result = instance.UpdateUserPassword(pu);
                return Json(result, JsonRequestBehavior.AllowGet);
        }

        //---------------------------------------------------COURSE------------------------------//
        [System.Web.Mvc.HttpPost]
        public ActionResult CreateCourse([FromBody]CourseBM course)
        {
            var instance = new CourseLogic();
            var result = instance.CreateCourse(course);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult DeleteCourse([FromBody]int courseId)
        {

                var instance = new CourseLogic();
                var result = instance.DeleteCourse(courseId);
                return Json(result, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult UpdateCourse([FromBody]CourseBM course)
        {
            var instance = new CourseLogic();
            var result = instance.UpdateCourse(course);
            return Json(result, JsonRequestBehavior.AllowGet);
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
        public ActionResult CreateGroup([FromBody]GroupDTO group)
        {
            var instance = new GroupLogic();
            var result = instance.CreateGroup(group);
                return Json(result, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult DeleteGroup([FromBody]int id)
        {
            var instance = new GroupLogic();
            var result = instance.DeleteGroup(id);
                return Json(result, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult UpdateGroup([FromBody]GroupDTO group)
        {
                var instance = new GroupLogic();
                var result = instance.UpdateGroup(group);
                return Json(result, JsonRequestBehavior.AllowGet);
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
        public ActionResult CreateTerm([FromBody]TermDTO t)
        {
                var instance = new TermLogic();
                var result = instance.CreateTerm(t);
                return Json(result, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult CreateTerms([FromBody]TermDTO t)
        {
                var instance = new TermLogic();
                var result = instance.CreateTerms(t);
            return Json(result, JsonRequestBehavior.AllowGet);

        }

        [System.Web.Mvc.HttpPost]
        public ActionResult DeleteTerm([FromBody]int id)
        {
                var instance = new TermLogic();
                var result = instance.DeleteTerm(id);
                return Json(result, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult DeleteTerms([FromBody]TermDTO t)
        {
                var instance = new TermLogic();
                var result = instance.DeleteTerms(t);
                return Json(result, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult UpdateTerm([FromBody]TermDTO t)
        {
                var instance = new TermLogic();
                var result = instance.UpdateTerm(t);
                return Json(result, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult UpdateTerms([FromBody]TermDTO t)
        {
                var instance = new TermLogic();
                var result = instance.UpdateTerms(t);
                return Json(result, JsonRequestBehavior.AllowGet);
        }

    }
}