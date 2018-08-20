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
		public GroupLogic _groupLogic;
		public GroupController()
		{
			_groupLogic = new GroupLogic();
		}
										   // GET: Group
		public ActionResult Index()
        {
            return View();
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult Get([FromUri]int groupId)
        {
            var result = _groupLogic.GetGroup(groupId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult ByCourseId([FromUri]int courseId)
        {
            var result = _groupLogic.GetGroupsByCourseId(courseId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult CreateOrUpdate([FromBody]GroupDto group)
        {
            var result = _groupLogic.CreateOrUpdateGroup(group);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpDelete]
        public ActionResult Delete([FromBody]int id)
        {
            var result = _groupLogic.DeleteGroup(id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}