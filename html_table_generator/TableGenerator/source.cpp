#include <stdio.h>
#include <stdlib.h>

int main(){
	FILE *f = fopen("output.txt", "w");
	if (f == NULL)
	{
	    printf("Error opening file!\n");
	    exit(1);
	}	
	fprintf(f,"<div class=\"rTable\">\n");
	for(int i=0;i<6;i++){		
		fprintf(f,"\t");
		fprintf(f,"<div class=\"rTableRow\">\n");
		//first row
		if(i==0){	
			fprintf(f,"\t\t");
			fprintf(f,"<div class=\"leftNavigation\"></div>\n");
			for(int j=0;j<6;j++){
				fprintf(f,"\t\t\t");
				fprintf(f,"<div class=\"upperNavigation\">");
				if(j==0){
					fprintf(f,"\n\t\t\t\t");
					fprintf(f,"<div class=\"arrowLeft\" id=\"arrowLeft\" data-bind=\"click: leftClicked, css:{'arrowLeftDisabled': disableLeft(), 'arrowLeft':!disableLeft()} \">\n");
					fprintf(f,"\t");fprintf(f,"\t");fprintf(f,"\t");fprintf(f,"\t");fprintf(f,"\t");
					fprintf(f,"<i class=\"fa fa-arrow-left fa-lg\" aria-hidden=\"true\"></i>\n");
					fprintf(f,"\t");fprintf(f,"\t");fprintf(f,"\t");fprintf(f,"\t");
					fprintf(f,"</div>\n");					
				}
				else if(j==5){
					fprintf(f,"\n\t\t\t\t");
					fprintf(f,"<div class=\"arrowRight\" id=\"arrowRight\" data-bind=\"click: rightClicked, css:{'arrowRightDisabled': disableRight(), 'arrowRight':!disableRight()} \">\n");
					fprintf(f,"\t");fprintf(f,"\t");fprintf(f,"\t");fprintf(f,"\t");fprintf(f,"\t");
					fprintf(f,"<i class=\"fa fa-arrow-right fa-lg\" aria-hidden=\"true\"></i>\n");
					fprintf(f,"\t");fprintf(f,"\t");fprintf(f,"\t");fprintf(f,"\t");
					fprintf(f,"</div>\n");	
					
				}
				fprintf(f,"\t\t\t");
				fprintf(f,"</div>\n");
			}		
		}
		//second row
		else if(i==1){	
			// leftNavigation		
			fprintf(f,"\t\t\t");
			fprintf(f,"<div class=\"leftNavigation\">\n");
			fprintf(f,"\t\t\t\t");
			fprintf(f,"<div class=\"arrowUp\" id=\"arrowUp\" data-bind=\"click: upClicked, css:{'arrowUpDisabled': disableUp(), 'arrowUp':!disableUp()} \">\n");
			fprintf(f,"\t");fprintf(f,"\t");fprintf(f,"\t");fprintf(f,"\t");fprintf(f,"\t");
			fprintf(f,"<i class=\"fa fa-arrow-up fa-lg\" aria-hidden=\"true\"></i>\n");
			fprintf(f,"\t");fprintf(f,"\t");fprintf(f,"\t");fprintf(f,"\t");
			fprintf(f,"</div>\n");					
			fprintf(f,"\t\t\t");
			fprintf(f,"</div>\n");
			// firstCell
			fprintf(f,"\t\t\t");
			fprintf(f,"<div class=\"firstCell\">\n");
			fprintf(f,"\t\t\t\t");
            fprintf(f,"<select class=\"selecter univStudies\" id=\"selectStudy\" data-bind=\"options: Studies,\n");
			fprintf(f,"\t\t\t\t\t");
			fprintf(f,"optionsText: 'Name',\n");
			fprintf(f,"\t\t\t\t\t");
			fprintf(f,"value: 'Id',\n");
			fprintf(f,"\t\t\t\t");
			fprintf(f,"optionsCaption: 'Odaberite studij'\"></select>\n");
			fprintf(f,"\t\t\t\t");
            fprintf(f,"<br />\n");
			fprintf(f,"\t\t\t\t");
            fprintf(f,"<select class=\"selecter univCourse\" id=\"selectCourse\" data-bind=\"options: CoursesActive,\n");
			fprintf(f,"\t\t\t\t\t");
			fprintf(f,"optionsText: 'Name',\n");
			fprintf(f,"\t\t\t\t\t");
			fprintf(f,"value: 'Id',\n");
			fprintf(f,"\t\t\t\t");
			fprintf(f,"optionsCaption: 'Odaberite kolegij'\"></select>\n");
			fprintf(f,"\t\t\t");
        	fprintf(f,"</div>\n");
        	// tableHeading        	
        	for(int j=0;j<5;j++){
		        fprintf(f,"\t\t\t<div class=\"rTableHeading\">\n");
		            fprintf(f,"\t\t\t\t<label class=\"label_t groupName\" id=\"groupName%d\" data-bind=\"text: Terms0()[%d].Term().Group().Name\">grupa</label><br>\n",j,j);
		            fprintf(f,"\t\t\t\t<label class=\"label_t groupOwner\" id=\"groupOwner%d\" data-bind=\"text: Terms0()[%d].Term().Group().Owner().Name\">demonstrator</label><br>\n",j,j);
		        fprintf(f,"\t\t\t</div>\n");        		
			}
		}
		//third row
		//fourth row
		//fifth row
		//sixth row
		else if(i>1 && i<5){
			// leftNavigation
			fprintf(f,"\t\t\t<div class=\"leftNavigation\"></div>\n");
			
			// date
			fprintf(f,"\t\t\t<div class=\"firstColumn\">\n");
			 fprintf(f,"\t\t\t\t<label class=\"label_t date\" id=\"date%d\" data-bind=\"text: Terms%d()[0].Term().TermDate\">datum</label>\n",i-2,i-2);
			fprintf(f,"\t\t\t</div>\n");	
				
			//cells
        	for(int j=0;j<5;j++){
		        fprintf(f,"\t\t\t<div class=\"rTableCell\"  data-bind=\"css: { 'rTableCell0' :  Terms%d()[%d].CellState()==0, 'rTableCell1':  Terms%d()[%d].CellState()==1, 'rTableCell2':  Terms%d()[%d].CellState()==2, 'rTableCellX':  Terms%d()[%d].CellState()!=0 && Terms%d()[%d].CellState()!=1 && Terms%d()[%d].CellState()!=2 }\">\n", i-2, j, i-2, j, i-2, j, i-2, j, i-2, j, i-2, j);
				fprintf(f,"\t\t\t\t<div class=\"label_t demoName\" id=\"termOwner%d%d\" data-bind=\"text: Terms%d()[%d].Term().User().Name\">demonstrator</div><br>\n",i-2,j,i-2,j);
				fprintf(f,"\t\t\t\t<button id=\"buttonTakeTerm%d%d\" class=\"tableButton takeTerm\" data-bind=\"text: defaultTextButtonTake\"></button>\n",i-2,j);
				fprintf(f,"\t\t\t\t<button id=\"buttonSkipTerm%d%d\" class=\"tableButton skipTerm\" data-bind=\"text: defaultTextButtonSkip\"></button><br>\n",i-2,j);
				fprintf(f,"\t\t\t\t<select class=\"search-student\" id=\"search%d%d\" data-bind=\"options: Demonstrators,\n",i-2,j);
				fprintf(f,"\t\t\t\toptionsText: 'Name',\n");
				fprintf(f,"\t\t\t\tvalue: 'Id',\n");
				fprintf(f,"\t\t\t\toptionsCaption: 'Odaberite demonstratora'\"></select>\n");
		        fprintf(f,"\t\t\t</div>\n");        		
        	}			
		}
		//seventh row
		else if(i==5){	
			// leftNavigation		
			fprintf(f,"\t\t\t");
			fprintf(f,"<div class=\"leftNavigation\">\n");
			fprintf(f,"\t\t\t\t<div>\n");
			fprintf(f,"\t\t\t\t");
			fprintf(f,"<div class=\"arrowDown\" id=\"arrowDown\" data-bind=\"click: downClicked, css:{'arrowDownDisabled': disableDown(), 'arrowDown':!disableDown()} \">\n");
			fprintf(f,"\t");fprintf(f,"\t");fprintf(f,"\t");fprintf(f,"\t");fprintf(f,"\t");
			fprintf(f,"<i class=\"fa fa-arrow-down fa-lg\" aria-hidden=\"true\"></i>\n");
			fprintf(f,"\t");fprintf(f,"\t");fprintf(f,"\t");fprintf(f,"\t");
			fprintf(f,"</div>\n");			
			fprintf(f,"\t\t\t");
			fprintf(f,"</div>\n");							
			fprintf(f,"\t\t\t");
			fprintf(f,"</div>\n");					
			
			// date
			fprintf(f,"\t\t\t<div class=\"firstColumn\">\n");
			 fprintf(f,"\t\t\t\t<label class=\"label_t date\" id=\"date%d\" data-bind=\"text: Terms%d()[0].Term().TermDate\">datum</label>\n",i-2,i-2);
			fprintf(f,"\t\t\t</div>\n");		
			
			// cells
        	for(int j=0;j<5;j++){
        		fprintf(f,"\t\t\t<div class=\"rTableCell\"  data-bind=\"css: { 'rTableCell0' :  Terms%d()[%d].CellState()==0, 'rTableCell1':  Terms%d()[%d].CellState()==1, 'rTableCell2':  Terms%d()[%d].CellState()==2, 'rTableCellX':  Terms%d()[%d].CellState()!=0 && Terms%d()[%d].CellState()!=1 && Terms%d()[%d].CellState()!=2 }\">\n", i-2, j, i-2, j, i-2, j, i-2, j, i-2, j, i-2, j);
				fprintf(f,"\t\t\t\t<div class=\"label_t demoName\" id=\"termOwner%d%d\" data-bind=\"text: Terms%d()[%d].Term().User().Name\">demonstrator</div><br>\n",i-2,j,i-2,j);
				fprintf(f,"\t\t\t\t<button id=\"buttonTakeTerm%d%d\" class=\"tableButton takeTerm\" data-bind=\"text: defaultTextButtonTake\"></button>\n",i-2,j);
				fprintf(f,"\t\t\t\t<button id=\"buttonSkipTerm%d%d\" class=\"tableButton skipTerm\" data-bind=\"text: defaultTextButtonSkip\"></button><br>\n",i-2,j);
				fprintf(f,"\t\t\t\t<select class=\"search-student\" id=\"search%d%d\" data-bind=\"options: Demonstrators,\n",i-2,j);
				fprintf(f,"\t\t\t\toptionsText: 'Name',\n");
				fprintf(f,"\t\t\t\tvalue: 'Id',\n");
				fprintf(f,"\t\t\t\toptionsCaption: 'Odaberite demonstratora'\"></select>\n");
		        fprintf(f,"\t\t\t</div>\n");        		
        	}
			
		}
		fprintf(f,"\t");
		fprintf(f,"</div>\n");
	}
	fprintf(f,"</div>");
	fclose(f);
}

