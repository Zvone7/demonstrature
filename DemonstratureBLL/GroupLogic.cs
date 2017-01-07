﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DemonstratureCM.DTO;
using DemonstratureDB;
using AutoMapper;
using DemonstratureBLL.Mappings;
using DemonstratureDB.Data;

namespace DemonstratureBLL
{
    public class GroupLogic
    {
        private IMapper _mapper;
        private GroupRepo _groupRepo = new GroupRepo();
        public GroupLogic()
        {
            AutoMapperConfiguration.RegisterMappings();
            _mapper = AutoMapperConfiguration.Instance;
        }

        public GroupDTO CreateGroup(GroupDTO g)
        {
            var g2 = _mapper.Map<GroupT>(g);
            if (g2.OwnerId == 0) { g2.OwnerId = null; }
            g2=_groupRepo.CreateGroup(g2);
            g = _mapper.Map<GroupDTO>(g2);
            return g;
        }

        public bool DeleteGroup(int groupId)
        {
            return _groupRepo.DeleteGroup(groupId);
        }

        public bool UpdateGroup(GroupDTO g)
        {
            var g2 = _mapper.Map<GroupT>(g);
            if (g2.OwnerId == 0) { g2.OwnerId = null; }
            return _groupRepo.UpdateGroup(g2);            
        }

        public GroupDTO GetGroup(int Id)
        {
            var g=_groupRepo.GetGroup(Id);
            var g2 = _mapper.Map<GroupDTO>(g);
            return g2;
        }

        public List<GroupDTO> GetGroupsByCourseId(int courseId)
        {
            var groups = _groupRepo.GetGroupsByCourseId(courseId);
            var groups2 = _mapper.Map<List<GroupDTO>>(groups);
            groups2=groups2.OrderBy(g=>g.Name).ToList();
            return groups2;
        }
    }
}