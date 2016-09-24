using DemonstratureBLL;
using DemonstratureCM.BM;
using System.Web.Http;
using System.Web.Mvc;

namespace DemonstratureAPI.Controllers
{
    public class SettingsController : Controller
    {
        public ActionResult Settings()
        {
            ViewBag.Title = "Settings Page";
            return View();
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult UserData()
        {
            var instance = new UserLogic();
            var result = instance.GetUser();
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult UserById([FromUri]int Id)
        {
            var instance = new UserLogic();
            var result = instance.GetUser(Id);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult UserByUsername([FromUri]string username)
        {
            var instance = new UserLogic();
            var result = instance.GetUser(username);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult AddCreateUser([FromBody]MyUserBM u)
        {
            var instance = new UserLogic();
            var result = instance.AddCreateUser(u);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }
    }
}