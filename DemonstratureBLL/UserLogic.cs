using AutoMapper;
using DemonstratureCM.BM;
using DemonstratureCM.DTO;
using DemonstratureDB;
using DemonstratureDB.Data;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DemonstratureBLL
{
    public class UserLogic
    {
        private readonly IMapper _mapper;
        private readonly UserRepo _userRepo;
        private readonly CourseRepo _courseRepo;
        private readonly CourseUserRepo _courseUserRepo;
        private readonly log4net.ILog _logger;
        public UserLogic(IMapper mapper, UserRepo userRepo, CourseRepo courseRepo, CourseUserRepo courseUserRepo, log4net.ILog logger)
        {
            _mapper = mapper;
            _userRepo = userRepo;
            _courseRepo = courseRepo;
            _courseUserRepo = courseUserRepo;
            _logger = logger;
        }

        public List<MyUserBm> GetUsers()
        {
            var allUsersMapped = new List<MyUserBm>();
            try
            {
                var allUsers = _userRepo.GetUsers();
                allUsersMapped = _mapper.Map<List<MyUserBm>>(allUsers);
                allUsersMapped = allUsersMapped.OrderBy(u => u.LastName).ToList();
                foreach (var user in allUsersMapped)
                {
                    user.Courses = GetUserCourses(user.Id);
                }
                return allUsersMapped;
            }
            catch (Exception e)
            {
                _logger.Error($"Error getting all users.", e);
                return allUsersMapped;
            }
        }

        public MyUserBm GetUser(int id)
        {
            try
            {
                var user = _userRepo.GetUser(id);
                var userMapped = _mapper.Map<MyUserDto>(user);
                userMapped.Courses = GetUserCourses(userMapped.Id);
                return userMapped;
            }
            catch (Exception e)
            {
                _logger.Error($"Error getting user with id {id}", e);
                return null;
            }
        }

        public MyUserBm GetUser(string username)
        {
            try
            {
                var user = _userRepo.GetUser(username);
                var userMapped = _mapper.Map<MyUserBm>(user);
                userMapped.Courses = GetUserCourses(userMapped.Id);
                return userMapped;
            }
            catch (Exception e)
            {
                _logger.Error($"Error getting user with username {username}", e);
                return null;
            }
        }

        public bool DeleteUser(int id)
        {
            try
            {
                _courseUserRepo.RemoveRangeByUserId(id);
                return _userRepo.DeleteUser(id);
            }
            catch (Exception e)
            {
                _logger.Error($"Error deleting user with id {id}", e);
                return false;
            }
        }

        public List<MyUserBm> GetUsersByCourseId(int courseId)
        {
            List<MyUserBm> listOfUsers = new List<MyUserBm>();
            try
            {
                var userIds = _courseRepo.GetUserIdsByCourseId(courseId);
                if (userIds != null)
                {
                    foreach (var userId in userIds)
                    {
                        var user = _userRepo.GetUser(userId);
                        var userMapped = _mapper.Map<MyUserBm>(user);
                        listOfUsers.Add(userMapped);
                    }
                    foreach (var user in listOfUsers)
                    {
                        user.Courses = GetUserCourses(user.Id);
                    }
                }
                else
                {
                    return null;
                }
                return listOfUsers;
            }
            catch (Exception e)
            {
                _logger.Error($"Error getting users for course id {courseId}", e);
                return listOfUsers;
            }
        }

        public List<CourseDto> GetUserCourses(int userId)
        {
            var courses = new List<CourseDto>();
            try
            {
                var result = _userRepo.GetUserCourses(userId);
                courses = _mapper.Map<List<CourseDto>>(result);
                return courses;
            }
            catch (Exception e)
            {
                _logger.Error($"Error getting courses for user id {userId}", e);
                return courses;
            }
        }

        public MyUserBm CreateOrUpdateUser(MyUserDto user)
        {
            try
            {
                MyUserBm userInDb = null;
                if (user.Id != 0)
                {
                    userInDb = UpdateUser(user);
                }
                else
                {
                    userInDb = CreateUser(user);
                }
                user.Id = userInDb.Id;
                var courses = UpdateUserCourses(user);
                userInDb.Courses = _mapper.Map<List<CourseDto>>(courses);
                return userInDb;
            }
            catch (Exception e)
            {
                _logger.Error($"Error updating user with id {user.Id}", e);
                return null;
            }
        }

        public MyUserBm CreateUser(MyUserDto user)
        {
            try
            {
                var userCheck = _userRepo.GetUser(user.Username);
                if (userCheck != null)
                {
                    //can't have two users with same usernames
                    return null;
                }
                user.IsActive = true;
                string newSalt = BCrypt.Net.BCrypt.GenerateSalt();
                string newPasswordHashed = BCrypt.Net.BCrypt.HashPassword(user.Password, newSalt);
                user.Password = newPasswordHashed;
                user.Salt = newSalt;

                UserT userMapped = _mapper.Map<UserT>(user);
                var result = _userRepo.CreateUser(userMapped);
                var userInDb = _mapper.Map<MyUserDto>(result);
                return userInDb;
            }
            catch (Exception e)
            {
                _logger.Error($"Error creating user with username {user.Username}", e);
                return null;
            }
        }

        public MyUserBm UpdateUser(MyUserDto user)
        {
            try
            {
                var userCheck = _userRepo.GetUser(user.Username);
                if (userCheck != null)
                {
                    if (userCheck.Id != user.Id)
                    {
                        //can't have two users with same usernames
                        return null;
                    }
                }

                var newUser = user;
                newUser.IsActive = true;
                UserT userMapped = _mapper.Map<UserT>(newUser);
                var result = _userRepo.UpdateUser(userMapped);
                var userInDb = _mapper.Map<MyUserBm>(result);
                if (user.Password != null && user.Password != "")
                {
                    var pu = new PasswordUpdaterBm();
                    pu.OldPassword = "";
                    pu.NewPassword = user.Password;
                    UpdateUserPassword(pu, userInDb.Id, true);
                }
                return userInDb;
            }
            catch (Exception e)
            {
                _logger.Error($"Error updating user with id {user.Id}", e);
                return null;
            }
        }

        public bool UpdateUserPassword(PasswordUpdaterBm pu, int userId, bool isBeingUpdatedByAdmin = false)
        {
            try
            {
                var user = _userRepo.GetUser(userId);
                if (user != null)
                {
                    if (userId != 0)
                    {
                        if (!isBeingUpdatedByAdmin)
                        {
                            var ld = new LoginDataBm
                            {
                                Password = pu.OldPassword,
                                ReturnUrl = "",
                                Username = user.Username
                            };

                            if (TryLogin(ld) == null)
                            {
                                return false;
                            }
                        }
                        string newSalt = BCrypt.Net.BCrypt.GenerateSalt();
                        string newPasswordHashed = BCrypt.Net.BCrypt.HashPassword(pu.NewPassword, newSalt);
                        return _userRepo.UpdateUserPassword(user.Id, newSalt, newPasswordHashed);
                    }
                    else
                    {
                        _logger.Info("Invalid user - id 0.");
                        return false;
                    }
                }
                _logger.Info($"User  with id {userId} not found.");
                return false;
            }
            catch (Exception e)
            {
                _logger.Error($"Error updating password for user id {userId}", e);
                return false;
            }
        }

        public List<CourseT> UpdateUserCourses(MyUserBm u)
        {
            var listOfCourses = new List<CourseT>();
            try
            {
                if (_courseUserRepo.RemoveRangeByUserId(u.Id))
                {
                    if (u.Courses == null)
                    {
                        return listOfCourses;
                    }
                    foreach (var c in u.Courses)
                    {
                        var course = _courseRepo.GetCourse(c.Id);
                        if (course != null)
                        {
                            var uc = new CourseUserT
                            {
                                CourseId = c.Id,
                                UserId = u.Id
                            };
                            var uc2 = _mapper.Map<CourseUserT>(uc);
                            if (_courseUserRepo.CreateCourseUser(uc2))
                            {
                                listOfCourses.Add(course);
                            }
                        }
                    }
                    return listOfCourses;
                }
                else
                {
                    _logger.Error($"Error removing range of user courses for user id {u.Id}");
                    return listOfCourses;
                }
            }
            catch (Exception e)
            {
                _logger.Error($"Error updating user courses for user id {u.Id}", e);
                return listOfCourses;
            }
        }

        public MyUserDto TryLogin(LoginDataBm ld)
        {
            try
            {
                var userInDb = _userRepo.GetUser(ld.Username);
                if (userInDb != null)
                {
                    var oldPasswordHashed = BCrypt.Net.BCrypt.HashPassword(ld.Password, userInDb.Salt);
                    ld.Password = oldPasswordHashed;
                }

                UserT user = _userRepo.TryLogin(ld);
                if (user == null)
                {
                    return null;
                }
                else
                {
                    return _mapper.Map<MyUserDto>(user);
                }
            }
            catch (Exception e)
            {
                _logger.Error($"Error logging in.", e);
                return null;
            }
        }

        public bool CheckAdmin(LoginDataBm ld)
        {
            try
            {
                return _userRepo.CheckAdmin(ld);
            }
            catch (Exception e)
            {
                _logger.Error($"Error when checking username {ld.Username} for admin rights.", e);
                return false;
            }
        }
    }
}
