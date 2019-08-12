using DemonstratureDB.Data;
using System.Linq;

namespace DemonstratureDB
{
    public class CourseUserRepo
    {
        public bool CreateCourseUser(CourseUserT cu)
        {
            try
            {
                using (DatabaseContext dbase = new DatabaseContext())
                {
                    dbase.CourseUserT.Add(cu);
                    dbase.SaveChanges();
                }
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
                using (DatabaseContext dbase = new DatabaseContext())
                {
                    var rowsToRemove = dbase.CourseUserT.Where(cu => cu.UserId == userId).ToList();
                    if (rowsToRemove == null) return true;
                    dbase.CourseUserT.RemoveRange(rowsToRemove);
                    dbase.SaveChanges();
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        public bool RemoveRangeByCourseId(int courseId)
        {
            try
            {
                using (DatabaseContext dbase = new DatabaseContext())
                {
                    var rowsToRemove = dbase.CourseUserT.Where(cu => cu.CourseId == courseId).ToList();
                    if (rowsToRemove == null) return true;
                    dbase.CourseUserT.RemoveRange(rowsToRemove);
                    dbase.SaveChanges();
                }
            }
            catch
            {
                return false;
            }
            return true;
        }

    }
}
