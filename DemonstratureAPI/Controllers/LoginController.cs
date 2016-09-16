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
    }
}