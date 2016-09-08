using DemonstratureCM.DTO;
using DemonstratureDB;
using System.Collections.Generic;
using System;

namespace DemonstratureBLL
{
    public class UserLogic
    {
        List<MyUserDTO> allUsers = new List<MyUserDTO>();
        TermDTO[][] allTerms = new TermDTO[6][];
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
            //DateTime today = new DateTime(2016, 8, 25);
            DateTime[] fieldOfDates = { new DateTime(2016, 8, 1), new DateTime(2016, 8, 5),
                                        new DateTime(2016, 8, 7), new DateTime(2016, 8, 9),
                                        new DateTime(2016, 8, 10), new DateTime(2016, 8, 11) };
            for(int j = 0; j < fieldOfDates.Length; j++)
            {                
                //10 termina
                string[] listOfTermOwners = { "Luka", "Filip", "Matej", "Ivana", "Tomislav", "Josip", "Ivan", "Marija", "Ana", "Zvonimir" };
                TermDTO[] listOfTerms = new TermDTO[10];
                for (int i = 0; i < 10; i++)
                {
                    var term = new TermDTO();
                    term.Date = fieldOfDates[j];
                    term.Id = 1;
                    term.IdCollegeCourse = 1;
                    term.IdUser = i+1;
                    term.UserFullName = listOfTermOwners[i];
                    term.IsAvailable = getRandom();
                    listOfTerms[i]=term;
                }
                allTerms[j] = listOfTerms;
            }
        }
        public bool getRandom()
        {
            Random gen = new Random();
            int prob = gen.Next(100);
            return prob < 20;
        }
        public List<MyUserDTO> GetAllUsers()
        {
            
            return allUsers;
        }

        public TermDTO[][] GetAllTerms()
        {
            return allTerms;
        }

        public void Test()
        {
            var result=new test().test1();
        }
    }
}
