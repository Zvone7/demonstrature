using DemonstratureDB.Data;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DemonstratureDB
{
    public class GroupRepo
    {
        private readonly log4net.ILog _logger;

        public GroupRepo(log4net.ILog logger)
        {
            _logger = logger;
        }

        public GroupT CreateGroup(GroupT g)
        {
            try
            {
                using (DatabaseContext dbase = new DatabaseContext())
                {
                    var groupInDb = dbase.GroupT.Add(g);
                    dbase.SaveChanges();
                    return groupInDb;
                }
            }
            catch (Exception e)
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

        public GroupT UpdateGroup(GroupT g)
        {
            try
            {
                using (DatabaseContext dbase = new DatabaseContext())
                {
                    var groupInDB = dbase.GroupT.Where(gr => gr.Id == g.Id).FirstOrDefault();
                    if (groupInDB != null)
                    {
                        groupInDB.Name = g.Name;
                        groupInDB.OwnerId = g.OwnerId;
                        groupInDB.CourseId = g.CourseId;
                        dbase.SaveChanges();
                        return groupInDB;
                    }
                    return null;
                }
            }
            catch (Exception e)
            {
                return null;
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
