using DemonstratureCM.DTO;
using DemonstratureDB.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemonstratureDB
{
    public class CourseUserRepo
    {
        DemonstratureEntities dbase = new DemonstratureEntities();

        public bool CreateCourseUser(CourseUserT cu)
        {
            try
            {
                dbase.CourseUserT.Add(cu);
                dbase.SaveChanges();
            }
            catch
            {
                return false;
            }
            return true;
        }

        public bool RemoveRangeByUserId(int userId)
        {
            try
            {
                var rowsToRemove=dbase.CourseUserT.Where(cu => cu.UserId == userId).ToList();
                if (rowsToRemove == null) return true;
                dbase.CourseUserT.RemoveRange(rowsToRemove);
                dbase.SaveChanges();
            }
            catch
            {
                return false;
            }
            return true;
        }

        public bool RemoveRangeByCourseId(int courseId)
        {
            try
            {
                var rowsToRemove = dbase.CourseUserT.Where(cu => cu.CourseId == courseId).ToList();
                if (rowsToRemove == null) return true;
                dbase.CourseUserT.RemoveRange(rowsToRemove);
                dbase.SaveChanges();
            }
            catch
            {
                return false;
            }
            return true;
        }

    }
}
