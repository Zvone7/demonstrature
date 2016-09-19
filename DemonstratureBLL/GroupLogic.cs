using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DemonstratureCM.DTO;

namespace DemonstratureBLL
{
    public class GroupLogic
    {
        public GroupDTO CreateGroup(string name, string owner)
        {
            var g = new GroupDTO();
            g.Id = 0;
            g.Name = name;
            g.Owner = owner;
            return g;
        }
    }
}
