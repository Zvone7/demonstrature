using DemonstratureDB.Data;
using System.Linq;

namespace DemonstratureDB
{
    public class CourseUserRepo
    {
        public bool CreateCourseUser(CourseUserT cu)
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                dbase.CourseUserT.Add(cu);
                dbase.SaveChanges();
            }
            return true;
        }

        public bool RemoveRangeByUserId(int userId)
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

        public bool RemoveRangeByCourseId(int courseId)
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                var rowsToRemove = dbase.CourseUserT.Where(cu => cu.CourseId == courseId).ToList();
                if (rowsToRemove == null) return true;
                dbase.CourseUserT.RemoveRange(rowsToRemove);
                dbase.SaveChanges();
            }
            return true;
        }
    }
}
