using System.Web.Mvc;

namespace DemonstratureAPI.Controllers
{
    public class SettingsController : Controller
    {
        // GET: Settings
        public ActionResult Settings()
        {
            ViewBag.Title = "Settings Page";
            return View();
        }
    }
}