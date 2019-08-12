using DemonstratureBLL;
using DemonstratureCM.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web.Http;
using System.Web.Mvc;

namespace DemonstratureAPI.Controllers
{
    public class TermController : Controller
    {
        private log4net.ILog _logger;
        TermLogic _termLogic;
        public TermController()
        {
            _logger = DI.GetInstance<log4net.ILog>();
            _termLogic = DI.GetInstance<TermLogic>();
        }

        public ActionResult Index()
        {
            return View();
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult Get([FromUri]int termId)
        {
            return Json(_termLogic.GetTerm(termId), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult ByCourseId([FromUri]int courseId)
        {
            return Json(_termLogic.GetTermsByCourseId(courseId), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult NumberOfTermDates([FromUri]int courseId)
        {
            return Json(_termLogic.GetNumberOfTermDates(courseId), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult ByCourseIdNavigation([FromUri]int courseId, int movedRight, int movedDown)
        {
            int userId = 0;
            try
            {
                var identity = (ClaimsIdentity)User.Identity;
                IEnumerable<Claim> claims = identity.Claims;
                // get claims because you need userId for determining CellState on TermController
                Int32.TryParse(claims.ToList()[1].Value, out userId);
            }
            catch (Exception e)
            {
                _logger.Info(e);
            }
            return Json(_termLogic.GetTerms(courseId, movedRight, movedDown, userId), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult ByGroupId([FromUri]int groupId)
        {
            return Json(_termLogic.GetTermsByGroupId(groupId), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult CreateOrUpdate([FromBody]TermDto t)
        {
            return Json(_termLogic.CreateOrUpdateTerm(t), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult CreateOrUpdateMany([FromBody]TermDto t)
        {
            return Json(_termLogic.CreateOrUpdateTerms(t), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult Delete([FromBody]int id)
        {
            return Json(_termLogic.DeleteTerm(id), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult DeleteMany([FromBody]TermDto t)
        {
            return Json(_termLogic.DeleteTerms(t), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult ReserveTerm([FromUri]int termId, [FromUri] int suggestedUserId)
        {
            var user = User.Identity as ClaimsIdentity;
            var userIdClaim = user.Claims.FirstOrDefault(a => a.Type.Equals(ClaimTypes.NameIdentifier)).Value;
            int userId = 0;
            Int32.TryParse(userIdClaim, out userId);
            return Json(_termLogic.ReserveTerm(termId, userId, suggestedUserId), JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult FreeTerm([FromUri]int termId)
        {
            var user = User.Identity as ClaimsIdentity;
            var userIdClaim = user.Claims.FirstOrDefault(a => a.Type.Equals(ClaimTypes.NameIdentifier)).Value;
            int userId = 0;
            Int32.TryParse(userIdClaim, out userId);
            return Json(_termLogic.FreeTerm(termId, userId), JsonRequestBehavior.AllowGet);
        }
    }
}