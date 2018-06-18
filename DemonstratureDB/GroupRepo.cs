using DemonstratureDB.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemonstratureDB
{
    public class GroupRepo
    {
        private static readonly log4net.ILog _logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public GroupT CreateGroup(GroupT g)
        {
            try
			{
				using (DatabaseContext dbase = new DatabaseContext())
				{
					dbase.GroupT.Add(g);
					dbase.SaveChanges();
					var groupInDb = dbase.GroupT.Where(gr =>
													gr.CourseId == g.CourseId &&
													gr.OwnerId == g.OwnerId &&
													gr.Name == g.Name).FirstOrDefault();
					return groupInDb;
				}
            }
            catch(Exception e)
            {
                _logger.Info(e);
                return null;
            }
        }
        public bool DeleteGroup(int groupId)
        {
            try
			{
				using (DatabaseContext dbase = new DatabaseContext())
				{
					var groupToDelete = dbase.GroupT.Where(g => g.Id == groupId).FirstOrDefault();
					if (groupToDelete != null)
					{
						var termsToDelete = dbase.TermT.Where(t => t.GroupId == groupId).ToList();
						dbase.TermT.RemoveRange(termsToDelete);
					}
					dbase.GroupT.Remove(groupToDelete);
					dbase.SaveChanges();
					return true;
				}
            }
            catch
            {
                return false;
            }
        }
        public bool UpdateGroup(GroupT g)
        {
            try
			{
				using (DatabaseContext dbase = new DatabaseContext())
				{
					var groupInDB = GetGroup(g.Id);
					dbase.GroupT.Where(gr => gr.Id == g.Id).FirstOrDefault().Name = g.Name;
					dbase.GroupT.Where(gr => gr.Id == g.Id).FirstOrDefault().OwnerId = g.OwnerId;
					dbase.GroupT.Where(gr => gr.Id == g.Id).FirstOrDefault().CourseId = g.CourseId;
					dbase.SaveChanges();
					return true;
				}
            }
            catch
            {
                return false;
            }
        }
        public GroupT GetGroup(int Id)
        {
            try
			{
				using (DatabaseContext dbase = new DatabaseContext())
				{
					var gr = dbase.GroupT.Where(g => g.Id == Id).FirstOrDefault();
					return gr;
				}
            }
            catch
            {
                return null;
            }
        }
        public List<GroupT> GetGroupsByCourseId(int courseId)
		{
			using (DatabaseContext dbase = new DatabaseContext())
			{
				return dbase.GroupT.Where(g => g.CourseId == courseId).OrderBy(g => g.Name).ToList();
			}
        }
    }
}
