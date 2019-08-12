using DemonstratureBLL;
using DemonstratureCM.DTO;
using System.Web.Http;
using System.Web.Mvc;

namespace DemonstratureAPI.Controllers
{
    public class GroupController : Controller
    {
		public GroupLogic _groupLogic;
		public GroupController()
		{
            _groupLogic = DI.GetInstance<GroupLogic>();
		}

		public ActionResult Index()
        {
            return View();
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult Get([FromUri]int groupId)
        {
            return Json(_groupLogic.GetGroup(groupId), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult ByCourseId([FromUri]int courseId)
        {
            return Json(_groupLogic.GetGroupsByCourseId(courseId), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult CreateOrUpdate([FromBody]GroupDto group)
        {
            return Json(_groupLogic.CreateOrUpdateGroup(group), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpDelete]
        public ActionResult Delete([FromBody]int id)
        {
            return Json(_groupLogic.DeleteGroup(id), JsonRequestBehavior.AllowGet);
        }
    }
}