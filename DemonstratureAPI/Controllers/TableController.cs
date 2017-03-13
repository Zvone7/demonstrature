using DemonstratureAPI.Models;
using DemonstratureBLL;
using DemonstratureCM.DTO;
using System;
using System.Linq;
using System.Security.Claims;
using System.Web.Http;
using System.Web.Mvc;

namespace DemonstratureAPI.Controllers
{
    //[System.Web.Mvc.Authorize]
    public class TableController : Controller
    {
        [System.Web.Mvc.Authorize]
        // GET: Table
        public ActionResult Table()
        {
            var x = User.Identity as ClaimsIdentity;
            var id=x.Claims.FirstOrDefault(a => a.Type.Equals(ClaimTypes.NameIdentifier)).Value;
            ViewBag.Name = id;
            var model = new MyUser()
            {
                Id = Convert.ToInt32(id)
            };
            ViewBag.Title = "Table Page";
            return View(model);
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