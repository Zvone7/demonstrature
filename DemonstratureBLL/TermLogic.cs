using DemonstratureCM.DTO;
using System;
using System.Collections.Generic;

namespace DemonstratureBLL
{
    public class TermLogic
    {
        TermDTO[][] allTerms = new TermDTO[6][];
        public TermLogic()
        {
            DateTime[] fieldOfDates = { new DateTime(2016, 8, 1), new DateTime(2016, 8, 2),
                                        new DateTime(2016, 8, 3), new DateTime(2016, 8, 4),
                                        new DateTime(2016, 8, 5), new DateTime(2016, 8, 6) };
            for (int j = 0; j < fieldOfDates.Length; j++)
            {
                //10 termina
                Random gen = new Random();
                string[] listOfTermOwners = { "Luka Lukić", "Filip Filipić", "Matej Matejić", "Ivana Ivanić", "Tomislav Tomislavić", "Josip Josipič", "Ivan Ivanić", "Marija Marijanić", "Ana Anić", "Zvonimir Zvonimirić" };
                TermDTO[] listOfTerms = new TermDTO[10];
                for (int i = 0; i < 10; i++)
                {
                    var randNum = i + j;
                    if (randNum > 9) { randNum -= i; }
                    var term = new TermDTO();
                    term.TermDate = fieldOfDates[j];
                    term.Id = 1;
                    term.IdCollegeCourse = 1;
                    term.IdUser = i + 1;
                    term.UserFullName = listOfTermOwners[randNum];
                    term.IsAvailable = getRandom();
                    term.Group = new GroupLogic().CreateGroup("LV-" + (i + 1).ToString(), listOfTermOwners[randNum]);
                    listOfTerms[i] = term;
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
        public TermDTO[][] GetAllTerms()
        {
            return allTerms;
        }
    }
}
