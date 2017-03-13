using DemonstratureCM.DTO;
using DemonstratureDB;
using System.Collections.Generic;
using System;
using System.Linq;
using DemonstratureCM.BM;
using DemonstratureDB.Data;
using DemonstratureBLL.Mappings;
using AutoMapper;

namespace DemonstratureBLL
{
    public class UserLogic
    {
        private IMapper _mapper;
        private UserRepo _userRepo = new UserRepo();
        private CourseRepo _courseRepo = new CourseRepo();
        private CourseUserRepo _courseUserRepo = new CourseUserRepo();
        public UserLogic()
        {            
            AutoMapperConfiguration.RegisterMappings();
            _mapper = AutoMapperConfiguration.Instance;
        }

        public List<MyUserDTO> GetUser()
        {
            try
            {
                var allUsers = _userRepo.GetUser();
                var allUsersMapped = _mapper.Map<List<MyUserDTO>>(allUsers);
                allUsersMapped = allUsersMapped.OrderBy(u => u.LastName).ToList();
                return allUsersMapped;
            }
            catch
            {
                return null;
            }
        }

        public MyUserDTO GetUser(int Id)
        {
            try
            {
                var user = _userRepo.GetUser(Id);
                return _mapper.Map<MyUserDTO>(user);
            }
            catch
            {
                return null;
            }
        }

        public bool DeleteUser(int Id)
        {
            _courseUserRepo.RemoveRangeByUserId(Id);
            return _userRepo.DeleteUser(Id);
        }

        public MyUserDTO GetUser(string username)
        {
            try
            {
                var user = _userRepo.GetUser(username);
                return _mapper.Map<MyUserDTO>(user);
            }
            catch
            {
                return null;
            }
        }

        public List<MyUserDTO> GetUsersByCourseId(int courseId)
        {
            try
            {
                var userIds = _courseRepo.GetUserIdsByCourseId(courseId);
                List<MyUserDTO> listOfUsers = new List<MyUserDTO>();
                if (userIds != null)
                {
                    foreach (var userId in userIds)
                    {
                        var newUser = _userRepo.GetUser(userId);
                        var newUser2 = _mapper.Map<MyUserDTO>(newUser);
                        listOfUsers.Add(newUser2);
                    }
                }
                else
                {
                    return null;
                }
                return listOfUsers;
            }
            catch
            {
                return null;
            }
        }

        public List<CourseUserDTO> GetUserCourses(int userId)
        {
            try
            {
                var result = _userRepo.GetUserCourses(userId);
                return result;
            }
            catch
            {
                return null;
            }
        }
        
        public bool CreateUser(MyUserWithPassBM u)
        {
            try
            {
                MyUserWithPassDTO u2 = new MyUserWithPassDTO();
                u2.Id = u.Id;
                u2.Name = u.Name;
                u2.LastName = u.LastName;
                u2.Username = u.Username;
                u2.Role = u.Role;
                u2.IsActive = true;
                u2.Password = u.Password;
                u2.Courses = u.Courses;
                UserT u3 = _mapper.Map<UserT>(u2);
                //can't have two users with same usernames
                var allUsers = _userRepo.GetUser();
                foreach (UserT ux in allUsers)
                {
                    if (u3.Username == ux.Username)
                    {
                        return false;
                    }
                }
                var result = _userRepo.CreateUser(u3);
                if (result != null && u.Courses != null)
                {
                    try
                    {
                        var u4 = _mapper.Map<MyUserWithPassDTO>(result);
                        UserCourses(u4);
                    }
                    catch
                    {
                        return false;
                    }
                }
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool UpdateUser(MyUserWithPassBM u)
        {
            try
            {
                MyUserWithPassDTO u2 = new MyUserWithPassDTO();
                u2.Id = u.Id;
                u2.Name = u.Name;
                u2.LastName = u.LastName;
                u2.Username = u.Username;
                u2.Role = u.Role;
                u2.IsActive = true;
                u2.Courses = u.Courses;
                if (u.Password != null && u.Password!="")
                {
                    u2.Password = u.Password;
                }
                UserT u3 = _mapper.Map<UserT>(u2);
                //can't have two users with same usernames
                var allUsers = _userRepo.GetUser();
                foreach (UserT ux in allUsers)
                {
                    if (u3.Username == ux.Username && u3.Id != u3.Id)
                    {
                        return false;
                    }
                }
                if (UserCourses(u2))
                {
                    _userRepo.UpdateUser(u3);
                    return true;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }

        public bool CheckIfCorrectPassword(PasswordUpdaterBM pu)
        {
            try
            {
                var user = _userRepo.GetUser(pu.UserId);
                if (user.Password == pu.Password)
                {
                    return true;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }

        public bool UpdateUserPassword(PasswordUpdaterBM pu)
        {
            try
            {
                var user = _userRepo.GetUser(pu.UserId);
                user.Password = pu.Password;
                return _userRepo.UpdateUser(user);
            }
            catch
            {
                return false;
            }
        }

        public bool UserCourses(MyUserWithPassDTO u)
        {
            try
            {
                if (_courseUserRepo.RemoveRangeByUserId(u.Id))
                {
                    if (u.Courses == null)
                    {
                        return true;
                    }
                    foreach (var c in u.Courses)
                    {
                        var uc = new CourseUserDTO();
                        uc.CourseId = c.Id;
                        uc.CourseName = c.Name;
                        uc.UserId = u.Id;
                        var uc2 = _mapper.Map<CourseUserT>(uc);
                        _courseUserRepo.CreateCourseUser(uc2);
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
            return true;
        }

        public MyUserDTO TryLogin(LoginDataBM ld)
        {
            UserT user =_userRepo.TryLogin(ld);
            if (user == null)
            {
                return null;
            }
            else
            {
                return _mapper.Map<MyUserDTO>(user);
            }
        }

        public bool CheckAdmin(LoginDataBM ld)
        {
            return _userRepo.CheckAdmin(ld);
        }
    }
}
