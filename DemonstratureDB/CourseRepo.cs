using DemonstratureDB.Data;
using System.Collections.Generic;
using System.Linq;

namespace DemonstratureDB
{
    public class CourseRepo
    {
        public CourseT CreateCourse(CourseT c)
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                var courseInDb = dbase.CourseT.Add(c);
                dbase.SaveChanges();
                return courseInDb;
            }
        }

        public bool DeleteCourse(int courseId)
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                var courseInDb = dbase.CourseT.Where(c => c.Id == courseId).FirstOrDefault();
                courseInDb.IsActive = false;
                dbase.SaveChanges();
                return true;
            }
        }

        public CourseT UpdateCourse(CourseT c)
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                var cInDb = dbase.CourseT.Where(co => co.Id == c.Id).FirstOrDefault();
                dbase.CourseT.Where(co => co.Id == c.Id).FirstOrDefault().Professor = c.Professor;
                dbase.CourseT.Where(co => co.Id == c.Id).FirstOrDefault().Asistant = c.Asistant;
                dbase.CourseT.Where(co => co.Id == c.Id).FirstOrDefault().Name = c.Name;
                dbase.SaveChanges();
                return cInDb;
            }
        }

        public IEnumerable<CourseT> GetCourses()
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                var courses = dbase.CourseT.Where(c => c.IsActive).ToList();
                courses.OrderBy(c => c.Name);
                return courses;
            }
        }

        public IEnumerable<CourseT> GetCoursesByStudy(string study)
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                var courses = dbase.CourseT.Where(c => c.IsActive && c.Study.ToLower() == study.ToLower()).ToList();
                courses.OrderBy(c => c.Name);
                return courses;
            }
        }

        public CourseT GetCourse(int id)
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                var course = dbase.CourseT.Where(c => c.Id == id && c.IsActive).FirstOrDefault();
                return course;
            }
        }

        public IEnumerable<int> GetUserIdsByCourseId(int courseId)
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                var userIds = dbase.CourseUserT.Where(uc => uc.CourseId == courseId).ToList();
                List<int> listOfUserIds = new List<int>();
                foreach (var uc in userIds)
                {
                    listOfUserIds.Add(uc.UserId);
                }
                return listOfUserIds;
            }
        }

        public IEnumerable<string> GetAllStudies()
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                var studies = dbase.CourseT.Select(c => c.Study).Distinct().ToList();
                return studies;
            }
        }
    }
}
