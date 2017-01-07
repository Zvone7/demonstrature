using DemonstratureCM.DTO;
using DemonstratureDB.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemonstratureDB
{
    public class CourseRepo
    {
        DemonstratureEntities dbase = new DemonstratureEntities();
        public bool CreateCourse(CourseT c)
        {
            try
            {
                dbase.CourseT.Add(c);
                dbase.SaveChanges();
            }
            catch
            {
                //error creating Course
                return false;
            }
            return true;
        }
        public bool DeleteCourse(int courseId)
        {
            try
            {
                var courseToRemove = GetCourse(courseId);
                if (courseToRemove != null)
                {
                    dbase.CourseT.Remove(courseToRemove);
                    dbase.SaveChanges();
                }
                return true;
            }
            catch
            {
                return false;
            }
        }
        public bool UpdateCourse(CourseT c)
        {
            try
            {
                var cInDb=dbase.CourseT.Where(co => co.Id == c.Id).FirstOrDefault();
                if (cInDb != null)
                {
                    try
                    {
                        dbase.CourseT.Where(co => co.Id == c.Id).FirstOrDefault().Professor = c.Professor;
                        dbase.CourseT.Where(co => co.Id == c.Id).FirstOrDefault().Asistant = c.Asistant;
                        dbase.CourseT.Where(co => co.Id == c.Id).FirstOrDefault().Name = c.Name;
                        dbase.SaveChanges();
                    }
                    catch
                    {
                        //error updating Course
                    }
                }
            }
            catch
            {
                //error updating Course
                return false;
            }
            return true;
        }
        public List<CourseT> GetCourse()
        {
            try
            {
                var courses=dbase.CourseT.Where(c => c.Id != 0).ToList();
                courses.OrderBy(c => c.Name);
                return courses;
            }
            catch
            {
                return null;
            }
        }
        public CourseT GetCourse(int id)
        {
            try
            {
                var course = dbase.CourseT.Where(c => c.Id == id).FirstOrDefault();
                return course;
            }
            catch
            {
                return null;
            }
        }
        public List<int> GetUserIdsByCourseId(int courseId)
        {
            var userIds = dbase.CourseUserT.Where(uc => uc.CourseId == courseId).ToList();
            List<int> listOfUserIds = new List<int>();
            foreach(var uc in userIds)
            {
                listOfUserIds.Add(uc.UserId);
            }
            return listOfUserIds;
        }
    }

}
