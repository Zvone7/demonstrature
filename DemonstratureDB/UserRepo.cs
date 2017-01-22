using DemonstratureCM.BM;
using DemonstratureCM.DTO;
using DemonstratureDB.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemonstratureDB
{
    public class UserRepo
    {
        DemonstratureEntities dbase = new DemonstratureEntities();
        public List<UserT> GetUser()
        {
            try
            {
                var allUsers = dbase.UserT.Where(u => u.IsActive == true).ToList();
                return allUsers;
            }
            catch
            {
                return null;
            }
        }
        public UserT GetUser(int Id)
        {
            try
            {
                return dbase.UserT.Where(u => u.Id == Id).FirstOrDefault();
            }
            catch
            {
                return null;
            }
        }
        public bool DeleteUser(int Id)
        {
            try
            {
                var userToRemove= dbase.UserT.Where(u => u.Id == Id).FirstOrDefault();
                dbase.UserT.Remove(userToRemove);
                dbase.SaveChanges();
            }
            catch
            {
                return false;
            }
            return true;
        }
        public UserT GetUser(string username)
        {
            try
            {
                return dbase.UserT.Where(u => u.Username == username).FirstOrDefault();
            }
            catch
            {
                return null;
            }
        }
        public List<CourseUserDTO> GetUserCourses(int userId)
        {
            var userCoursesIds = dbase.CourseUserT.Where(cu => cu.UserId == userId).ToList();
            var allUserCourses = new List<CourseUserDTO>();
            foreach(var uci in userCoursesIds)
            {
                CourseUserDTO x = new CourseUserDTO();
                x.UserId = uci.UserId;
                x.CourseId = uci.CourseId;
                var course = new CourseRepo().GetCourse(x.CourseId);
                if (course != null)
                {
                    x.CourseName = course.Name;
                }
                else
                {
                    return null;
                }
                allUserCourses.Add(x);
            }
            return allUserCourses;
        }
        public UserT CreateUser(UserT u)
        {
            try
            {
                dbase.UserT.Add(u);
                dbase.SaveChanges();
                return u;
            }
            catch
            {
                return null;
            }
        }
        public bool UpdateUser(UserT u)
        {
            try
            {
                var userToEdit=dbase.UserT.Where(us => us.Id == u.Id).FirstOrDefault();
                if (userToEdit != null)
                dbase.UserT.Where(us => us.Id == u.Id).FirstOrDefault().Name = u.Name;
                dbase.UserT.Where(us => us.Id == u.Id).FirstOrDefault().Username = u.Username;
                dbase.UserT.Where(us => us.Id == u.Id).FirstOrDefault().LastName = u.LastName;
                dbase.UserT.Where(us => us.Id == u.Id).FirstOrDefault().Role = u.Role;
                if (u.Password != null)
                {
                    dbase.UserT.Where(us => us.Id == u.Id).FirstOrDefault().Password = u.Password;
                }
                dbase.SaveChanges();
                return true;
            }
            catch//(Exception e)
            {

            }
            return false;
        }
        public bool TryLogin(LoginDataBM lg)
        {
            try
            {
                var user = dbase.UserT.Where(u => u.Username == lg.Username && u.Password == lg.Password).FirstOrDefault();
                if (user != null)
                {
                    return true;
                }
                else
                {
                    return false; 
                }
            }
            catch
            {
                return false;
            }
        }
        public bool CheckAdmin(LoginDataBM ld)
        {
            try
            {
                var user = dbase.UserT.Where(u => u.Username == ld.Username && u.Password == ld.Password).FirstOrDefault();
                if (user != null)
                {
                    if (user.Role == "A")
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }
            }
            catch
            {
                return false;
            }
        }
    }
}
