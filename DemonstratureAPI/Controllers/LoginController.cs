using DemonstratureBLL;
using DemonstratureCM.BM;
using DemonstratureCM.DTO;
using Microsoft.AspNet.Identity;
using System.Security.Claims;
using System.Web;
using System.Web.Mvc;

namespace DemonstratureAPI.Controllers
{
    [AllowAnonymous]
    public class LoginController : Controller
    {
        // GET: Login
        public ActionResult Login()
        {
            ViewBag.Title = "Login page";
            return View();
        }
        [HttpGet]
        public ActionResult LogIn(string returnUrl)
        {
            var model = new LoginDataBM
            {
                ReturnUrl = returnUrl
            };

            return View(model);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult TryLogin(LoginDataBM log)
        {
            var instance = new UserLogic();
            var result = instance.TryLogin(log);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [HttpPost]
        public ActionResult LogIn(LoginDataBM model)
        {
            if (!ModelState.IsValid)
            {
                return View();
            }

            var _userLogic = new UserLogic();
            MyUserDTO user = _userLogic.TryLogin(model);
            if (user!=null)
            {
                ClaimsIdentity identity;
                if (user.Role == "A")
                {
                    identity = new ClaimsIdentity(new[] {
                        new Claim(ClaimTypes.Role, "A"),
                        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                        new Claim(ClaimTypes.Name, user.Name+" "+user.LastName)
                    },"ApplicationCookie");
                }
                else
                {
                    identity = new ClaimsIdentity(new[] {
                        new Claim(ClaimTypes.Role, "D"),
                        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                        new Claim(ClaimTypes.Name, user.Name+" "+user.LastName)
                    },"ApplicationCookie");
                }

                ViewData["Role"] = user.Role;

                var ctx = Request.GetOwinContext();
                var authManager = ctx.Authentication;
                authManager.SignIn(identity);
                if (model.ReturnUrl == null)
                {
                    model.ReturnUrl = "/Table/Table";
                }
                
                return Redirect(GetRedirectUrl(model.ReturnUrl));
            }

           
            // user authN failed
            ModelState.AddModelError("", "Invalid username or password");
            return View();
        }

        [Authorize]
        [System.Web.Mvc.HttpGet]
        public ActionResult LogOff()
        {
            var ctx = Request.GetOwinContext();
            var authManager = ctx.Authentication;
            authManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
            return RedirectToAction("Login", "Login");
        }

        private string GetRedirectUrl(string returnUrl)
        {
            if (string.IsNullOrEmpty(returnUrl) || !Url.IsLocalUrl(returnUrl))
            {
                return Url.Action("login", "login");
            }

            return returnUrl;
        }

    }
}