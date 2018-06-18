﻿using DemonstratureCM.DTO;
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

		public List<MyUserBm> GetUsers()
		{
			try
			{
				var allUsers = _userRepo.GetUsers();
				var allUsersMapped = _mapper.Map<List<MyUserBm>>(allUsers);
				allUsersMapped = allUsersMapped.OrderBy(u => u.LastName).ToList();
				foreach (var user in allUsersMapped)
				{
					user.Courses = GetUserCourses(user.Id);
				}
				return allUsersMapped;
			}
			catch
			{
				return null;
			}
		}

		public MyUserBm GetUser(int Id)
		{
			try
			{
				var user = _userRepo.GetUser(Id);
				var userMapped = _mapper.Map<MyUserDto>(user);
				userMapped.Courses = GetUserCourses(userMapped.Id);
				return userMapped;
			}
			catch
			{
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

		public List<MyUserBm> GetUsersByCourseId(int courseId)
		{
			try
			{
				var userIds = _courseRepo.GetUserIdsByCourseId(courseId);
				List<MyUserBm> listOfUsers = new List<MyUserBm>();
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
			catch
			{
				return null;
			}
		}

		public List<CourseDto> GetUserCourses(int userId)
		{
			try
			{
				var result = _userRepo.GetUserCourses(userId);
				var courses = _mapper.Map<List<CourseDto>>(result);
				return courses;
			}
			catch
			{
				return null;
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
				return null;
			}
		}

		public MyUserBm CreateUser(MyUserDto newUser)
		{
			try
			{
				var userCheck = _userRepo.GetUser(newUser.Username);
				if (userCheck != null)
				{
					//can't have two users with same usernames
					return null;
				}
				newUser.IsActive = true;
				UserT userMapped = _mapper.Map<UserT>(newUser);
				var result = _userRepo.CreateUser(userMapped);
				var userInDb = _mapper.Map<MyUserDto>(result);
				return userInDb;
			}
			catch
			{
				return null;
			}
		}

		public MyUserBm UpdateUser(MyUserDto userUpdate)
		{
			try
			{
				var userCheck = _userRepo.GetUser(userUpdate.Username);
				if (userCheck != null)
				{
					if (userCheck.Id != userUpdate.Id)
					{
						//can't have two users with same usernames
						return null;
					}
				}

				var newUser = userUpdate;
				newUser.IsActive = true;
				if (userUpdate.Password != null && userUpdate.Password != "")
				{
					newUser.Password = userUpdate.Password;
				}
				UserT userMapped = _mapper.Map<UserT>(newUser);
				var result = _userRepo.UpdateUser(userMapped);
				var userInDb = _mapper.Map<MyUserBm>(result);
				return userInDb;
			}
			catch(Exception e)
			{
				return null;
			}
		}

		public bool CheckIfCorrectPassword(PasswordUpdaterBm pu)
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

		public bool UpdateUserPassword(PasswordUpdaterBm pu)
		{
			try
			{
				var user = _userRepo.GetUser(pu.UserId);
				user.Password = pu.Password;
				if (_userRepo.UpdateUser(user) != null)
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

		public List<CourseT> UpdateUserCourses(MyUserBm u)
		{
			try
			{
				var listOfCourses = new List<CourseT>();
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
					return null;
				}
			}
			catch
			{
				return null;
			}
		}

		public MyUserDto TryLogin(LoginDataBm ld)
		{
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

		public bool CheckAdmin(LoginDataBm ld)
		{
			return _userRepo.CheckAdmin(ld);
		}
	}
}
