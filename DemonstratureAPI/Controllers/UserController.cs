using DemonstratureBLL;
using DemonstratureCM.BM;
using DemonstratureCM.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web.Http;
using System.Web.Mvc;

namespace DemonstratureAPI.Controllers
{
    public class UserController : Controller
    {
        UserLogic _userLogic;
        public UserController()
        {
            _userLogic = DI.GetInstance<UserLogic>();
        }
        // GET: User
        public ActionResult Index()
        {
            return View();
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult All()
        {
            return Json(_userLogic.GetUsers(), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult ById([FromUri]int userId)
        {
            return Json(_userLogic.GetUser(userId), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult ByCourseId([FromUri]int courseId)
        {
            return Json(_userLogic.GetUsersByCourseId(courseId), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult Courses([FromUri]int userId)
        {
            return Json(_userLogic.GetUserCourses(userId), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpDelete]
        public ActionResult Delete([FromBody]int userId)
        {
            return Json(_userLogic.DeleteUser(userId), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult ByUsername([FromUri]string username)
        {
            return Json(_userLogic.GetUser(username), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult CreateOrUpdate([FromBody]MyUserDto u)
        {
            return Json(_userLogic.CreateOrUpdateUser(u), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult UpdateOwnPassword([FromBody]PasswordUpdaterBm pu)
        {
            try
            {
                int userId = 0;
                var identity = (ClaimsIdentity)User.Identity;
                IEnumerable<Claim> claims = identity.Claims;
                Int32.TryParse(claims.ToList()[1].Value, out userId);
                return Json(_userLogic.UpdateUserPassword(pu, userId), JsonRequestBehavior.AllowGet);

            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}