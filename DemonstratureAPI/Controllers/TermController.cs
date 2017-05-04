using DemonstratureBLL;
using DemonstratureCM.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace DemonstratureAPI.Controllers
{
    public class TermController : Controller
    {
        // GET: Term
        public ActionResult Index()
        {
            return View();
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult Get([FromUri]int termId)
        {
            var instance = new TermLogic();
            var result = instance.GetTerm(termId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult ByCourseId([FromUri]int courseId)
        {
            var instance = new TermLogic();
            var result = instance.GetTermsByCourseId(courseId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpGet]
        public ActionResult ByGroupId([FromUri]int groupId)
        {
            var instance = new TermLogic();
            var result = instance.GetTermsByGroupId(groupId);
            return Json(result, JsonRequestBehavior.AllowGet);
            //return null;
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult Create([FromBody]TermDTO t)
        {
            var instance = new TermLogic();
            var result = instance.CreateTerm(t);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult CreateMany([FromBody]TermDTO t)
        {
            var instance = new TermLogic();
            var result = instance.CreateTerms(t);
            return Json(result, JsonRequestBehavior.AllowGet);

        }

        [System.Web.Mvc.HttpPost]
        public ActionResult Delete([FromBody]int id)
        {
            var instance = new TermLogic();
            var result = instance.DeleteTerm(id);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult DeleteMany([FromBody]TermDTO t)
        {
            var instance = new TermLogic();
            var result = instance.DeleteTerms(t);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult Update([FromBody]TermDTO t)
        {
            var instance = new TermLogic();
            var result = instance.UpdateTerm(t);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [System.Web.Mvc.HttpPost]
        public ActionResult UpdateMany([FromBody]TermDTO t)
        {
            var instance = new TermLogic();
            var result = instance.UpdateTerms(t);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}