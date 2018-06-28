using DemonstratureBLL;
using DemonstratureCM.BM;
using DemonstratureCM.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace DemonstratureAPI.Controllers
{
    public class TermController : Controller
    {
        private static readonly log4net.ILog _logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
		TermLogic _termLogic;
		public TermController()
		{
			_termLogic = new TermLogic();
		}
        // GET: Term
        public ActionResult Index()
        {
            return View();
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult Get([FromUri]int termId)
        {
            var result = _termLogic.GetTerm(termId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult ByCourseId([FromUri]int courseId)
        {
            var result = _termLogic.GetTermsByCourseId(courseId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult NumberOfTermDates([FromUri]int courseId)
        {
            var result = _termLogic.GetNumberOfTermDates(courseId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
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
            var result = _termLogic.GetTerms(courseId, movedRight, movedDown, userId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult ByGroupId([FromUri]int groupId)
        {
            var result = _termLogic.GetTermsByGroupId(groupId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult CreateOrUpdate([FromBody]TermDto t)
        {
            var result = _termLogic.CreateOrUpdateTerm(t);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult CreateOrUpdateMany([FromBody]TermDto t)
        {
            var result = _termLogic.CreateOrUpdateTerms(t);
            return Json(result, JsonRequestBehavior.AllowGet);

        }

        [System.Web.Mvc.HttpPost]
        public ActionResult Delete([FromBody]int id)
        {
            var result = _termLogic.DeleteTerm(id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult DeleteMany([FromBody]TermDto t)
        {
            var result = _termLogic.DeleteTerms(t);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
		
        [System.Web.Mvc.HttpGet]
        public ActionResult ReserveTerm([FromUri]int termId, [FromUri] int suggestedUserId)
        {
            var user = User.Identity as ClaimsIdentity;
            var userIdClaim = user.Claims.FirstOrDefault(a => a.Type.Equals(ClaimTypes.NameIdentifier)).Value;
            int userId = 0;
            Int32.TryParse(userIdClaim, out userId);
            var result = _termLogic.ReserveTerm(termId, userId, suggestedUserId);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult FreeTerm([FromUri]int termId)
        {
            var user = User.Identity as ClaimsIdentity;
            var userIdClaim = user.Claims.FirstOrDefault(a => a.Type.Equals(ClaimTypes.NameIdentifier)).Value;
            int userId = 0;
            Int32.TryParse(userIdClaim, out userId);
            var result = _termLogic.FreeTerm(termId, userId);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}