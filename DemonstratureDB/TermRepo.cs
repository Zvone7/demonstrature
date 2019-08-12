using DemonstratureDB.Data;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DemonstratureDB
{
    public class TermRepo
    {
        public TermT CreateTerm(TermT t)
        {
            using (DatabaseContext dbase = new DatabaseContext())
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
        }

        public bool DeleteTerm(int termId)
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                var termToDelete = dbase.TermT.Where(t => t.Id == termId).FirstOrDefault();
                dbase.TermT.Remove(termToDelete);
                dbase.SaveChanges();
                return true;
            }
        }

        public bool UpdateTerm(TermT t)
        {
            using (DatabaseContext dbase = new DatabaseContext())
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
        }

        public TermT GetTerm(int termId)
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                var te = dbase.TermT.Where(t => t.Id == termId).FirstOrDefault();
                return te;
            }
        }

        public IEnumerable<TermT> GetTerms(int courseId)
        {
            List<TermT> terms = new List<TermT>();
            using (DatabaseContext dbase = new DatabaseContext())
            {
                terms = dbase.TermT.Where(t => t.CourseId == courseId)
                .OrderBy(t => t.TermDate)
                .ToList();
            }
            return terms;
        }

        public IEnumerable<TermT> GetTerms(DateTime d, int courseId)
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                return dbase.TermT.Where(t => t.TermDate == d && t.CourseId == courseId).ToList();
            }
        }

        public IEnumerable<TermT> GetTermsByCourseId(int courseId)
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                return dbase.TermT.Where(t => t.CourseId == courseId).ToList();
            }
        }

        public IEnumerable<TermT> GetTermsByGroupId(int groupId)
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                return dbase.TermT.Where(t => t.GroupId == groupId).ToList();
            }
        }
    }
}
