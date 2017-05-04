using DemonstratureAPI.Models;
using DemonstratureBLL;
using DemonstratureCM.BM;
using DemonstratureCM.DTO;
using System;
using System.Linq;
using System.Security.Claims;
using System.Web.Http;
using System.Web.Mvc;

namespace DemonstratureAPI.Controllers
{
    public class SettingsController : Controller
    {
        public ActionResult Settings()
        {
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
            ViewBag.Title = "Settings Page";
            return View(model);
        }
        //---------------------------------------------------USER--------------------------------//
        

        //---------------------------------------------------COURSE------------------------------//
        

        //---------------------------------------------------GROUP------------------------------//

       

        //---------------------------------------------------TERM-------------------------------//

        

    }
}