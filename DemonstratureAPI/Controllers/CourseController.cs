using DemonstratureBLL;
using DemonstratureCM.BM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace DemonstratureAPI.Controllers
{
    public class CourseController : Controller
    {
		CourseLogic _courseLogic;
		public CourseController()
		{
			_courseLogic = new CourseLogic();
		}
        // GET: Course
        public ActionResult Index()
        {
            return View();
        }

		[System.Web.Mvc.HttpGet]
		public ActionResult Courses()
		{
			var result = _courseLogic.GetCourses();
			return Json(result, JsonRequestBehavior.AllowGet);
			//return null;
		}

		[System.Web.Mvc.HttpGet]
        public ActionResult CoursesByStudy(string study)
        {
            var result = _courseLogic.GetCourses(study);
            return Json(result, JsonRequestBehavior.AllowGet);
			//return null;
		}

		[System.Web.Mvc.HttpGet]
		public ActionResult AllStudies()
		{
			var result = _courseLogic.GetAllStudies();
			return Json(result, JsonRequestBehavior.AllowGet);
			//return null;
		}

		[System.Web.Mvc.HttpPost]
        public ActionResult CreateOrUpdate([FromBody]CourseBm course)
        {
            var result = _courseLogic.CreateOrUpdateCourse(course);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpDelete]
        public ActionResult Delete([FromUri]int courseId)
        {
            var result = _courseLogic.DeleteCourse(courseId);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}