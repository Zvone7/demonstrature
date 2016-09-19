using DemonstratureCM.DTO;
using DemonstratureDB;
using System.Collections.Generic;
using System;

namespace DemonstratureBLL
{
    public class UserLogic
    {
        List<MyUserDTO> allUsers = new List<MyUserDTO>();
        int _userCount = 10;
        public UserLogic()
        {            
            for (int i = 0; i < _userCount; i++)
            {
                var newUser = new MyUserDTO();
                newUser.UserName = "iprezime" + (i + 1).ToString();
                newUser.FullName = "ime" + (i + 1).ToString() + " prezime";
                newUser.ID = i;
                if (i % 5 == 0) { newUser.Role = "Assistant"; }
                else { newUser.Role = "Student"; }
                allUsers.Add(newUser);
            }            
        }
        public List<MyUserDTO> GetAllUsers()
        {
            
            return allUsers;
        }

        

        public void Test()
        {
        }
    }
}
