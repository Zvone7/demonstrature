﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DemonstratureCM.DTO
{
    public class TermPackageDTO
    {
        public List<TermDTO> row0 { get; set; }
        public List<TermDTO> row1 { get; set; }
        public List<TermDTO> row2 { get; set; }
        public List<TermDTO> row3 { get; set; }
        public string row0Dt { get; set; }
        public string row1Dt { get; set; }
        public string row2Dt { get; set; }
        public string row3Dt { get; set; }
        public bool disableLeft { get; set; }
        public bool disableRight   { get; set; }
        public bool disableUp { get; set; }
        public bool disableDown { get; set; }
        public TermPackageDTO()
        {
            row0 = new List<TermDTO>();
            row1 = new List<TermDTO>();
            row2 = new List<TermDTO>();
            row3 = new List<TermDTO>();
        }
    }
}