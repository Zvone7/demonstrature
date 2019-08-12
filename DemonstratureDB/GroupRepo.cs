using DemonstratureDB.Data;
using System.Collections.Generic;
using System.Linq;

namespace DemonstratureDB
{
    public class GroupRepo
    {
        public GroupT CreateGroup(GroupT g)
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                var groupInDb = dbase.GroupT.Add(g);
                dbase.SaveChanges();
                return groupInDb;
            }
        }

        public bool DeleteGroup(int groupId)
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                var groupToDelete = dbase.GroupT.Where(g => g.Id == groupId).FirstOrDefault();
                var termsToDelete = dbase.TermT.Where(t => t.GroupId == groupId).ToList();
                dbase.TermT.RemoveRange(termsToDelete);
                dbase.GroupT.Remove(groupToDelete);
                dbase.SaveChanges();
                return true;
            }
        }

        public GroupT UpdateGroup(GroupT g)
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                var groupInDB = dbase.GroupT.Where(gr => gr.Id == g.Id).FirstOrDefault();
                groupInDB.Name = g.Name;
                groupInDB.OwnerId = g.OwnerId;
                groupInDB.CourseId = g.CourseId;
                dbase.SaveChanges();
                return groupInDB;
            }
        }

        public GroupT GetGroup(int Id)
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                var gr = dbase.GroupT.Where(g => g.Id == Id).FirstOrDefault();
                return gr;
            }
        }

        public IEnumerable<GroupT> GetGroupsByCourseId(int courseId)
        {
            using (DatabaseContext dbase = new DatabaseContext())
            {
                return dbase.GroupT.Where(g => g.CourseId == courseId).OrderBy(g => g.Name).ToList();
            }
        }
    }
}
