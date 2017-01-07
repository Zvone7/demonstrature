using DemonstratureBLL;
using DemonstratureCM.BM;
using DemonstratureCM.DTO;
using System.Web.Mvc;

namespace DemonstratureAPI.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        public ActionResult Login()
        {
            ViewBag.Title = "Login page";
            return View();
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult TryLogin(LoginData log)
        {
            var instance = new UserLogic();
            var result = instance.TryLogin(log);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }
    }
}