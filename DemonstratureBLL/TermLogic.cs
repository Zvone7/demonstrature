using DemonstratureCM.DTO;
using System;
using System.Collections.Generic;

namespace DemonstratureBLL
{
    public class TermLogic
    {
        public List<TermDTO> DummyGenerator(int n)
        {
            var terms = new List<TermDTO>();
            for (int i = 0; i < n; i++)
            {
                var term = new TermDTO();
                term.TermDate = new DateTime().Date;
                term.Id = i;
                term.IdCollegeCourse = 1;
                term.IdUser = 2;
                term.IsAvailable = true;
                terms.Add(term);
            }
            return terms;
        }
    }
}
