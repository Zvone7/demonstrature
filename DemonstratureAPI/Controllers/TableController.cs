using DemonstratureBLL;
using System.Web.Mvc;

namespace DemonstratureAPI.Controllers
{
    public class TableController : Controller
    {
        // GET: Table
        public ActionResult Table()
        {
            ViewBag.Title = "Table Page";
            return View();
        }
        [HttpPost]
        public ActionResult FirstAjax()
        {
            return Json("chamara", JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public ActionResult AllUsers()
        {
            var instance = new UserLogic();
            var result = instance.GetAllUsers();
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [HttpGet]
        public ActionResult AllTerms()
        {
            var instance = new UserLogic();
            var result = instance.GetAllTerms();
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }
        [HttpGet]
        public ActionResult AllCollegeCourses()
        {
            var instance = new CourseLogic();
            var result = instance.GetAllCourses();
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }
    }
}