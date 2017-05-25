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
        DemonstratureEntities dbase = new DemonstratureEntities();
        public GroupT CreateGroup(GroupT g)
        {
            try
            {                
                dbase.GroupT.Add(g);
                dbase.SaveChanges();
                var groupInDb = dbase.GroupT.Where(gr => 
                                                gr.CourseId == g.CourseId && 
                                                gr.OwnerId == g.OwnerId && 
                                                gr.Name == g.Name).FirstOrDefault();
                return groupInDb;
            }
            catch(Exception e)
            {
                return null;
            }
        }
        public bool DeleteGroup(int groupId)
        {
            try
            {
                var groupToDelete = dbase.GroupT.Where(g => g.Id == groupId).FirstOrDefault();
                dbase.GroupT.Remove(groupToDelete);
                dbase.SaveChanges();
                return true;
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
                var groupInDB = GetGroup(g.Id);
                dbase.GroupT.Where(gr=>gr.Id==g.Id).FirstOrDefault().Name = g.Name;
                dbase.GroupT.Where(gr => gr.Id == g.Id).FirstOrDefault().OwnerId = g.OwnerId;
                dbase.GroupT.Where(gr => gr.Id == g.Id).FirstOrDefault().CourseId = g.CourseId;
                dbase.SaveChanges();
                return true;
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
                var gr=dbase.GroupT.Where(g => g.Id == Id).FirstOrDefault();
                return gr;
            }
            catch
            {
                return null;
            }
        }
        public List<GroupT> GetGroupsByCourseId(int courseId)
        {
            return dbase.GroupT.Where(g => g.CourseId == courseId).OrderBy(g=>g.Name).ToList();
        }
    }
}
