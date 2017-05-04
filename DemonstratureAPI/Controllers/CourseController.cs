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
        // GET: Course
        public ActionResult Index()
        {
            return View();
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult All()
        {
            var instance = new CourseLogic();
            var result = instance.GetAllCourses();
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult Create([FromBody]CourseBM course)
        {
            var instance = new CourseLogic();
            var result = instance.CreateCourse(course);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpDelete]
        public ActionResult Delete([FromBody]int courseId)
        {

            var instance = new CourseLogic();
            var result = instance.DeleteCourse(courseId);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult Update([FromBody]CourseBM course)
        {
            var instance = new CourseLogic();
            var result = instance.UpdateCourse(course);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

    }
}