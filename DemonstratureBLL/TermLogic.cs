using DemonstratureCM.DTO;
using System;
using System.Collections.Generic;

namespace DemonstratureBLL
{
    public class TermLogic
    {
        public TermLogic()
        {
            
        }
        public bool getRandom()
        {
            Random gen = new Random();
            int prob = gen.Next(100);
            return prob < 20;
        }
        public TermDTO[][] GetAllTerms(int numOfTerms, int numOfGroups)
        {
            TermDTO[][] allTerms = new TermDTO[numOfTerms][];
            DateTime[] fieldOfDates = { new DateTime(2016, 8, 1), new DateTime(2016, 8, 2),
                                            new DateTime(2016, 8, 3), new DateTime(2016, 8, 4),
                                            new DateTime(2016, 8, 5), new DateTime(2016, 8, 6),
                                            new DateTime(2016, 8, 7), new DateTime(2016, 8, 8)
                                        };
            string[] listOfTermOwners = { "Luka Lukić", "Filip Filipić", "Matej Matejić",
                                            "Ivana Ivanić", "Tomislav Tomislavić", "Josip Josipič",
                                            "Ivan Ivanić", "Marija Marijanić", "Ana Anić",
                                            "Zvonimir Zvonimirić" };
            for (int j = 0; j < numOfTerms; j++)
            {
                Random gen = new Random();
                //10 termina
                TermDTO[] listOfTerms = new TermDTO[numOfGroups];
                for (int i = 0; i < numOfGroups; i++)
                {
                    var randNum = i + j;
                    if (randNum > 9) { randNum -= i; }
                    var term = new TermDTO();
                    term.TermDate = fieldOfDates[j];
                    term.Id = 1;
                    term.IdCollegeCourse = 1;
                    term.IdUser = i + 1;
                    term.UserPerson = new UserLogic().CreateNewUser(listOfTermOwners[randNum].Split(' ')[0], listOfTermOwners[randNum].Split(' ')[1], "Demonstrator");
                    term.IsAvailable = getRandom();
                    term.Group = new GroupLogic().CreateGroup("LV-" + (i + 1).ToString(), term.UserPerson);
                    listOfTerms[i] = term;
                }
                allTerms[j] = listOfTerms;
            }
            return allTerms;
        }
    }
}
