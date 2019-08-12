﻿using DemonstratureCM.BM;
using DemonstratureDB.Data;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DemonstratureDB
{
    public class UserRepo
    {
        private readonly log4net.ILog _logger;

        public UserRepo(log4net.ILog logger)
        {
            _logger = logger;
        }

        public List<UserT> GetUsers()
        {
            try
            {
                using (DatabaseContext dbase = new DatabaseContext())
                {
                    var allUsers = dbase.UserT.Where(u => u.IsActive == true).ToList();
                    return allUsers;
                }
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
                using (DatabaseContext dbase = new DatabaseContext())
                {
                    return dbase.UserT.Where(u => u.Id == Id && u.IsActive).FirstOrDefault();
                }
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
                using (DatabaseContext dbase = new DatabaseContext())
                {
                    var userToRemove = dbase.UserT.Where(u => u.Id == Id).FirstOrDefault();
                    userToRemove.IsActive = false;
                    dbase.SaveChanges();
                }
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
                using (DatabaseContext dbase = new DatabaseContext())
                {
                    return dbase.UserT.Where(u => u.Username == username && u.IsActive).FirstOrDefault();
                }
            }
            catch
            {
                return null;
            }
        }

        public List<CourseT> GetUserCourses(int userId)
        {
            try
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
            catch (Exception)
            {
                return null;
            }
        }

        public UserT CreateUser(UserT u)
        {
            try
            {
                using (DatabaseContext dbase = new DatabaseContext())
                {
                    dbase.UserT.Add(u);
                    dbase.SaveChanges();
                    return u;
                }
            }
            catch
            {
                return null;
            }
        }

        public UserT UpdateUser(UserT u)
        {
            try
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
            catch//(Exception e)
            {

            }
            return null;
        }

        public bool UpdateUserPassword(int userId, string salt, string password)
        {
            try
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
            catch (Exception e)
            {
                return false;
            }
        }

        public UserT TryLogin(LoginDataBm lg)
        {
            try
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
            catch (Exception e)
            {
                _logger.Info(e);
                return null;
            }
        }

        public bool CheckAdmin(LoginDataBm ld)
        {
            try
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
            catch
            {
                return false;
            }
        }
    }
}
