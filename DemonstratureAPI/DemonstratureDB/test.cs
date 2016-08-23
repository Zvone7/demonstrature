using DemonstratureDB.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemonstratureDB
{
    public class test
    {
        TestEntities dbase = new TestEntities(); 
        public List<Table_1> test1()
        {
            var result = dbase.Table_1.Select(t => t).ToList();
            return result;
        }
    }
}
