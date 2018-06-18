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
		private static readonly log4net.ILog _logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

		public List<UserT> GetUser()
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
					return dbase.UserT.Where(u => u.Id == Id).FirstOrDefault();
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
					dbase.UserT.Remove(userToRemove);
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
					return dbase.UserT.Where(u => u.Username == username).FirstOrDefault();
				}
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
				using (DatabaseContext dbase = new DatabaseContext())
				{
					var userCoursesIds = dbase.CourseUserT.Where(cu => cu.UserId == userId).ToList();
					var allUserCourses = new List<CourseUserDTO>();
					foreach (var uci in userCoursesIds)
					{
						CourseUserDTO x = new CourseUserDTO
						{
							UserId = uci.UserId,
							CourseId = uci.CourseId
						};
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
		public bool UpdateUser(UserT u)
		{
			try
			{
				using (DatabaseContext dbase = new DatabaseContext())
				{
					var userToEdit = dbase.UserT.Where(us => us.Id == u.Id).FirstOrDefault();
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
			}
			catch//(Exception e)
			{

			}
			return false;
		}
		public UserT TryLogin(LoginDataBM lg)
		{
			try
			{
				using (DatabaseContext dbase = new DatabaseContext())
				{
					var user = dbase.UserT.Where(u => u.Username == lg.Username && u.Password == lg.Password).FirstOrDefault();
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
		public bool CheckAdmin(LoginDataBM ld)
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
