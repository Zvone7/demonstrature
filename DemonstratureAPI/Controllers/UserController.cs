using DemonstratureBLL;
using DemonstratureCM.BM;
using DemonstratureCM.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace DemonstratureAPI.Controllers
{
    public class UserController : Controller
    {
        // GET: User
        public ActionResult Index()
        {
            return View();
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult All()
        {
            var instance = new UserLogic();
            var result = instance.GetUsers();
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult ById([FromUri]int userId)
        {
            var instance = new UserLogic();
            var result = instance.GetUser(userId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult ByCourseId([FromUri]int courseId)
        {
            var instance = new UserLogic();
            var result = instance.GetUsersByCourseId(courseId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult Courses([FromUri]int userId)
        {
            var instance = new UserLogic();
            var result = instance.GetUserCourses(userId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpDelete]
        public ActionResult Delete([FromBody]int userId)
        {
            var instance = new UserLogic();
            var result = instance.DeleteUser(userId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult ByUsername([FromUri]string username)
        {
            var instance = new UserLogic();
            var result = instance.GetUser(username);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult CreateOrUpdate([FromBody]MyUserDto u)
        {
            var instance = new UserLogic();

            var result = instance.CreateOrUpdateUser(u);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
		
        [System.Web.Mvc.HttpPost]
        public ActionResult CheckCorrectPass([FromBody]PasswordUpdaterBm pu)
        {
            var instance = new UserLogic();
            var result = instance.CheckIfCorrectPassword(pu);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult UpdatePass([FromBody]PasswordUpdaterBm pu)
        {
            var instance = new UserLogic();
            var result = instance.UpdateUserPassword(pu);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}