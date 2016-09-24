using DemonstratureCM.DTO;
using DemonstratureDB;
using System.Collections.Generic;
using System;
using DemonstratureCM.BM;
using DemonstratureDB.Data;
using DemonstratureBLL.Mappings;
using AutoMapper;

namespace DemonstratureBLL
{
    public class UserLogic
    {

        private IMapper _mapper;
        private UserRepo _userR = new UserRepo();
        List<MyUserDTO> allUsers = new List<MyUserDTO>();
        int _count = 10;
        public UserLogic()
        {
            for (int i = 0; i < _count; i++)
            {
                var newUser = new MyUserDTO();
                newUser.Username = "iprezime" + (i + 1).ToString();
                newUser.FullName = "ime" + (i + 1).ToString() + " prezime";
                newUser.Id = i;
                if (i % 5 == 0) { newUser.Role = "Assistant"; }
                else { newUser.Role = "Student"; }
                allUsers.Add(newUser);
            }
            AutoMapperConfiguration.RegisterMappings();
            _mapper = AutoMapperConfiguration.Instance;
        }
        public List<MyUserDTO> GetAllUsers()
        {
            return allUsers;
        }
        public MyUserDTO CreateNewUser(string name, string lastName, string role)
        {
            var newUser = new MyUserDTO();
            newUser.Username = name.ToLower()[0] + lastName.ToLower();
            newUser.FullName = name + " " + lastName;
            newUser.Id = 0;
            newUser.Role = role;
            return newUser;
        }

        public List<MyUserDTO> GetUser()
        {
            var allUsers = _userR.GetUser();
            var allUsersMapped = _mapper.Map<List<MyUserDTO>>(allUsers);
            return allUsersMapped;
        }
        public MyUserDTO GetUser(int Id)
        {
            var user = _userR.GetUser(Id);
            return _mapper.Map<MyUserDTO>(user);
        }
        public MyUserDTO GetUser(string username)
        {
            var user = _userR.GetUser(username);
            return _mapper.Map<MyUserDTO>(user);
        }

        public bool AddCreateUser(MyUserBM u)
        {
            bool isSuccessfullChange = false;
            if (u.Id == 0)
            {
                isSuccessfullChange = _userR.AddUser(_mapper.Map<UserT>(u));
            }
            else
            {
                isSuccessfullChange = _userR.EditUser(_mapper.Map<UserT>(u));
            }
            //TO DO - college courses access
            return isSuccessfullChange;
        }
    }
}
