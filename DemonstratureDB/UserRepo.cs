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
        DemonstratureEntities dbase = new DemonstratureEntities();
        public List<UserT> GetUser()
        {
            var allUsers = dbase.UserT.Where(u => u.IsActive==true).ToList();
            return allUsers;
        }
        public UserT GetUser(int Id)
        {
            return dbase.UserT.Where(u => u.Id == Id).FirstOrDefault();
        }
        public UserT GetUser(string username)
        {
            return dbase.UserT.Where(u => u.Username == username).FirstOrDefault();
        }
        public bool AddUser(UserT u)
        {
            dbase.UserT.Add(u);
            dbase.SaveChanges();
            return false;
        }
        public bool EditUser(UserT u)
        {
            try
            {
                var userToEdit=dbase.UserT.Where(us => us.Id == u.Id).FirstOrDefault();
                if (userToEdit != null)
                    userToEdit = u;
                dbase.SaveChanges();
            }
            catch(Exception e)
            {

            }
            return false;
        }
    }
}
