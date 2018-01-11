using DemonstratureDB.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemonstratureDB
{
    public class TermRepo
    {
        DemonstratureEntities dbase = new DemonstratureEntities();
        private static readonly log4net.ILog _logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public TermT CreateTerm(TermT t)
        {
            try
            {
                if (t.UserId == 0)
                {
                    t.UserId = null;
                }
                var x = dbase.TermT.Add(t);
                dbase.SaveChanges();
                var termInDb = dbase.TermT.Where(te =>
                                                te.CourseId == t.CourseId &&
                                                te.GroupId == t.GroupId &&
                                                te.TermDate == t.TermDate &&
                                                te.UserId == t.UserId).FirstOrDefault();
                return termInDb;
            }
            catch (Exception e)
            {
                _logger.Info(e);
                return null;
            }
        }
        public bool DeleteTerm(int termId)
        {
            try
            {
                var termToDelete = dbase.TermT.Where(t => t.Id == termId).FirstOrDefault();
                dbase.TermT.Remove(termToDelete);
                dbase.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }
        public bool UpdateTerm(TermT t)
        {
            try
            {
                var termInDB = GetTerm(t.Id);
                dbase.TermT.Where(te => te.Id == t.Id).FirstOrDefault().CourseId = t.CourseId;
                if (t.UserId == 0)
                {
                    dbase.TermT.Where(te => te.Id == t.Id).FirstOrDefault().UserId = null;
                }
                else
                {
                    dbase.TermT.Where(te => te.Id == t.Id).FirstOrDefault().UserId = t.UserId;
                }
                dbase.TermT.Where(te => te.Id == t.Id).FirstOrDefault().GroupId = t.GroupId;
                dbase.TermT.Where(te => te.Id == t.Id).FirstOrDefault().TermDate = t.TermDate;
                dbase.TermT.Where(te => te.Id == t.Id).FirstOrDefault().SuggestedUserId = t.SuggestedUserId;
                dbase.SaveChanges();
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }
        public TermT GetTerm(int termId)
        {
            try
            {
                var te = dbase.TermT.Where(t => t.Id == termId).FirstOrDefault();
                return te;
            }
            catch
            {
                return null;
            }
        }

        public List<TermT> GetTerms(int courseId)
        {
            List<TermT> terms = new List<TermT>();
            try
            {
                terms = dbase.TermT.Where(t => t.CourseId == courseId)
                    .OrderBy(t => t.TermDate)
                    //.OrderBy(t=>t.GroupT.Name)
                    .ToList();
            }
            catch (Exception e)
            {
                _logger.Info(e);
                return null;
            }
            return terms;
        }
        public List<TermT> GetTerms(DateTime d, int courseId)
        {
            try
            {
                return dbase.TermT.Where(t => t.TermDate == d && t.CourseId == courseId).ToList();
            }
            catch
            {
                return null;
            }
        }
        public List<TermT> GetTermsByCourseId(int courseId)
        {
            return dbase.TermT.Where(t => t.CourseId == courseId).ToList();
        }
        public List<TermT> GetTermsByGroupId(int groupId)
        {
            return dbase.TermT.Where(t => t.GroupId == groupId).ToList();
        }
    }
}
