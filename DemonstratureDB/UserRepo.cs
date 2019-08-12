using DemonstratureCM.BM;
using DemonstratureDB.Data;
using System.Collections.Generic;
using System.Linq;

namespace DemonstratureDB
{
    public class UserRepo
    {
        public IEnumerable<UserT> GetUsers()
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                var allUsers = dbase.UserT.Where(u => u.IsActive == true).ToList();
                return allUsers;
            }
        }

        public UserT GetUser(int Id)
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                return dbase.UserT.Where(u => u.Id == Id && u.IsActive).FirstOrDefault();
            }
        }

        public bool DeleteUser(int Id)
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                var userToRemove = dbase.UserT.Where(u => u.Id == Id).FirstOrDefault();
                userToRemove.IsActive = false;
                dbase.SaveChanges();
            }
            return true;
        }

        public UserT GetUser(string username)
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                return dbase.UserT.Where(u => u.Username == username && u.IsActive).FirstOrDefault();
            }
        }

        public IEnumerable<CourseT> GetUserCourses(int userId)
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                var allUserCourses = new List<CourseT>();
                var userCourses = dbase.CourseUserT.Where(cu => cu.UserId == userId).ToList();
                foreach (var uci in userCourses)
                {
                    var courseT = new CourseRepo().GetCourse(uci.CourseId);
                    if (courseT != null)
                    {
                        allUserCourses.Add(courseT);
                    }
                }
                return allUserCourses;
            }
        }

        public UserT CreateUser(UserT u)
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                dbase.UserT.Add(u);
                dbase.SaveChanges();
                return u;
            }
        }

        public UserT UpdateUser(UserT u)
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                var userToEdit = dbase.UserT.Where(us => us.Id == u.Id && u.IsActive).FirstOrDefault();
                if (userToEdit != null)
                {
                    dbase.UserT.Where(us => us.Id == u.Id).FirstOrDefault().Name = u.Name;
                    dbase.UserT.Where(us => us.Id == u.Id).FirstOrDefault().Username = u.Username;
                    dbase.UserT.Where(us => us.Id == u.Id).FirstOrDefault().LastName = u.LastName;
                    dbase.UserT.Where(us => us.Id == u.Id).FirstOrDefault().Role = u.Role;
                }
                dbase.SaveChanges();
                return userToEdit;
            }
        }

        public bool UpdateUserPassword(int userId, string salt, string password)
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                var userInDb = dbase.UserT.Where(u => u.Id == userId).FirstOrDefault();
                if (userInDb != null)
                {
                    userInDb.Password = password;
                    userInDb.Salt = salt;
                    dbase.SaveChanges();
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        public UserT TryLogin(LoginDataBm lg)
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                var user = dbase.UserT.Where(u => u.Username == lg.Username && u.Password == lg.Password && u.IsActive).FirstOrDefault();
                if (user != null)
                {
                    return user;
                }
                else
                {
                    return null;
                }
            }
        }

        public bool CheckAdmin(LoginDataBm ld)
        {
            using (DatabaseContext dbase = new DatabaseContext())
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
        }
    }
}
