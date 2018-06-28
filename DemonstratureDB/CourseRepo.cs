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
		public CourseT CreateCourse(CourseT c)
		{
			try
			{
				using (DatabaseContext dbase = new DatabaseContext())
				{
					var courseInDb = dbase.CourseT.Add(c);
					dbase.SaveChanges();
					return courseInDb;
				}
			}
			catch (Exception e)
			{
				//error creating Course
				return null;
			}
		}

		public bool DeleteCourse(int courseId)
		{
			try
			{
				using (DatabaseContext dbase = new DatabaseContext())
				{
					var courseInDb = dbase.CourseT.Where(c => c.Id == courseId).FirstOrDefault();
					if (courseInDb != null)
					{
						courseInDb.IsActive = false;
						dbase.SaveChanges();
						return true;
					}
					return false;
				}
			}
			catch
			{
				return false;
			}
		}

		public CourseT UpdateCourse(CourseT c)
		{
			try
			{
				using (DatabaseContext dbase = new DatabaseContext())
				{
					var cInDb = dbase.CourseT.Where(co => co.Id == c.Id).FirstOrDefault();
					if (cInDb != null)
					{
						try
						{
							dbase.CourseT.Where(co => co.Id == c.Id).FirstOrDefault().Professor = c.Professor;
							dbase.CourseT.Where(co => co.Id == c.Id).FirstOrDefault().Asistant = c.Asistant;
							dbase.CourseT.Where(co => co.Id == c.Id).FirstOrDefault().Name = c.Name;
							dbase.SaveChanges();
							return cInDb;
						}
						catch
						{
							//error updating Course
							return null;
						}
					}
					else
					{
						return null;
					}
				}
			}
			catch
			{
				//error updating Course
				return null;
			}
		}

		public List<CourseT> GetCourses()
		{
			try
			{
				using (DatabaseContext dbase = new DatabaseContext())
				{
					var courses = dbase.CourseT.Where(c => c.IsActive).ToList();
					courses.OrderBy(c => c.Name);
					return courses;
				}
			}
			catch
			{
				return null;
			}
		}

		public List<CourseT> GetCourses(string study)
		{
			try
			{
				using (DatabaseContext dbase = new DatabaseContext())
				{
					var courses = dbase.CourseT.Where(c => c.IsActive && c.Study.ToLower() == study.ToLower()).ToList();
					courses.OrderBy(c => c.Name);
					return courses;
				}
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
				using (DatabaseContext dbase = new DatabaseContext())
				{
					var course = dbase.CourseT.Where(c => c.Id == id && c.IsActive).FirstOrDefault();
					return course;
				}
			}
			catch
			{
				return null;
			}
		}

		public List<int> GetUserIdsByCourseId(int courseId)
		{
			try
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
			catch (Exception)
			{
				return null;
			}
		}

		public List<string> GetAllStudies()
		{
			try
			{
				using (DatabaseContext dbase = new DatabaseContext())
				{
					var studies = dbase.CourseT.Where(c=>c.IsActive).Select(c => c.Study).Distinct().ToList();
					return studies;
				}
			}
			catch (Exception e)
			{
				return null;
			}
		}
	}

}
