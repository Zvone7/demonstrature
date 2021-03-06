﻿using DemonstratureAPI.Models;
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
        private readonly UserLogic _userLogic;
        public LoginController()
        {
            _userLogic = DI.GetInstance<UserLogic>();
        }
        // GET: Login
        public ActionResult Login()
        {
            //this doesn't get called
            var model = new MyUser()
            {
                Id = -1
            };
            ViewBag.Title = "Login page";
            return View(model);
        }
        [HttpGet]
        public ActionResult LogIn(string returnUrl)
        {
            var model = new MyUserWithReturnUrl()
            {
                Id = -1,
                ReturnUrl = returnUrl
            };

            return View(model);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult TryLogin(LoginDataBm loginData)
        {
            return Json(_userLogic.TryLogin(loginData), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult LogIn(LoginDataBm model)
        {
            if (!ModelState.IsValid)
            {
                return View();
            }

            MyUserDto user = _userLogic.TryLogin(model);
            if (user != null)
            {
                ClaimsIdentity identity;
                identity = new ClaimsIdentity(new[] {
                        new Claim(ClaimTypes.Role, user.Role),
                        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                        new Claim(ClaimTypes.Name, user.Name+" "+user.LastName),
                        new Claim(ClaimTypes.GivenName, user.Username)
                    }, "ApplicationCookie");

                var ctx = Request.GetOwinContext();
                var authManager = ctx.Authentication;
                authManager.SignIn(identity);
                if (model.ReturnUrl == null)
                {
                    model.ReturnUrl = "/Table/Table";
                }

                return Redirect(GetRedirectUrl(model.ReturnUrl));
            }


            // user auth failed
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