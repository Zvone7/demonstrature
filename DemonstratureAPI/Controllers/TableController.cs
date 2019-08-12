using DemonstratureAPI.Models;
using System;
using System.Linq;
using System.Security.Claims;
using System.Web.Mvc;

namespace DemonstratureAPI.Controllers
{
    //[System.Web.Mvc.Authorize]
    public class TableController : Controller
    {
        [System.Web.Mvc.Authorize]
        public ActionResult Table()
        {
            //ViewBag.Name = id;
            //gets user information
            var x = User.Identity as ClaimsIdentity;
            var id = x.Claims.FirstOrDefault(a => a.Type.Equals(ClaimTypes.NameIdentifier)).Value;
            var role = x.Claims.FirstOrDefault(a => a.Type.Equals(ClaimTypes.Role)).Value;
            var name = x.Claims.FirstOrDefault(a => a.Type.Equals(ClaimTypes.Name)).Value;
            var username = x.Claims.FirstOrDefault(a => a.Type.Equals(ClaimTypes.GivenName)).Value;
            var model = new MyUserWithReturnUrl()
            {
                Id = Convert.ToInt32(id),
                Role = role,
                Name = name,
                Username = username
            };
            ViewBag.Title = "Table Page";
            return View(model);
        }
        [System.Web.Mvc.HttpPost]
        public ActionResult FirstAjax()
        {
            return Json("chamara", JsonRequestBehavior.AllowGet);
        }

    }
}