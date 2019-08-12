using DemonstratureBLL;
using DemonstratureCM.BM;
using System.Web.Http;
using System.Web.Mvc;

namespace DemonstratureAPI.Controllers
{
    public class CourseController : Controller
    {
        CourseLogic _courseLogic;
        public CourseController()
        {
            _courseLogic = DI.GetInstance<CourseLogic>();
        }

        public ActionResult Index()
        {
            return View();
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult Courses()
        {
            return Json(_courseLogic.GetCourses(), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult CoursesByStudy(string study)
        {
            return Json(_courseLogic.GetCourses(study), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult AllStudies()
        {
            return Json(_courseLogic.GetAllStudies(), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult CreateOrUpdate([FromBody]CourseBm course)
        {
            return Json(_courseLogic.CreateOrUpdateCourse(course), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpDelete]
        public ActionResult Delete([FromUri]int courseId)
        {
            return Json(_courseLogic.DeleteCourse(courseId), JsonRequestBehavior.AllowGet);
        }
    }
}