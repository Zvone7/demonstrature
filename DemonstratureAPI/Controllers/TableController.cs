using DemonstratureBLL;
using System.Web.Http;
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
        [System.Web.Mvc.HttpPost]
        public ActionResult FirstAjax()
        {
            return Json("chamara", JsonRequestBehavior.AllowGet);
        }
        
        
        [System.Web.Mvc.HttpGet]
        public ActionResult AllCollegeCourses()
        {
            var instance = new CourseLogic();
            var result = instance.GetAllCourses();
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }
    }
}