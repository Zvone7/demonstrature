using DemonstratureBLL;
using DemonstratureCM.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace DemonstratureAPI.Controllers
{
    public class GroupController : Controller
    {
        // GET: Group
        public ActionResult Index()
        {
            return View();
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult Get([FromUri]int groupId)
        {
            var instance = new GroupLogic();
            var result = instance.GetGroup(groupId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult ByCourseId([FromUri]int courseId)
        {
            var instance = new GroupLogic();
            var result = instance.GetGroupsByCourseId(courseId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult Create([FromBody]GroupDto group)
        {
            var instance = new GroupLogic();
            var result = instance.CreateGroup(group);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpDelete]
        public ActionResult Delete([FromBody]int id)
        {
            var instance = new GroupLogic();
            var result = instance.DeleteGroup(id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult Update([FromBody]GroupDto group)
        {
            var instance = new GroupLogic();
            var result = instance.UpdateGroup(group);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}