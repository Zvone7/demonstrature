#include <stdio.h>
#include <stdlib.h>

int main(){
	FILE *f = fopen("output.html", "w");
	if (f == NULL)
	{
	    printf("Error opening file!\n");
	    exit(1);
	}	
	
	fprintf(f,"@model DemonstratureAPI.Models.MyUserWithReturnUrl");
	fprintf(f,"\n@{");
	fprintf(f,"\n\tLayout = \"~/Views/Shared/_Layout.cshtml\";");
	fprintf(f,"\n}");
	fprintf(f,"\n@{");
	fprintf(f,"\n\tViewBag.Title = \"Tablica demonstratura\";");
	fprintf(f,"\n}");
	
	fprintf(f,"\n");
	fprintf(f,"\n");
	
	fprintf(f,"\n<link rel=\"stylesheet\" href=\"//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css\">");
	fprintf(f,"\n<script src=\"~/Scripts/jquery-2.2.3.js\"></script>");
	fprintf(f,"\n<script src=\"~/Scripts/knockout-3.4.2.js\"></script>");
	fprintf(f,"\n<script src=\"~/Scripts/knockout.mapping-latest.js\"></script>");
	fprintf(f,"\n<script src=\"~/Scripts/require.js\"></script>");
	fprintf(f,"\n<script src=\"~/Scripts/Pages/TableKO.js\"></script>");	
	
	fprintf(f,"\n");
	fprintf(f,"\n");
	
	fprintf(f,"<button id=\"test\">tipka</button>");
	
	fprintf(f,"\n");
	fprintf(f,"\n");
	
	// table 
	fprintf(f,"<div class=\"rTable\">\n");
	for(int i=0;i<6;i++){		
		fprintf(f,"\t");
		fprintf(f,"<div class=\"rTableRow\">\n");
		//first row
		if(i==0){	
			fprintf(f,"\t\t");
			fprintf(f,"<div class=\"leftNavigation\"></div>\n");
			for(int j=0;j<6;j++){
				fprintf(f,"\t\t");
				fprintf(f,"<div class=\"upperNavigation\">");
				if(j==0){
					fprintf(f,"\n\t\t\t");
					fprintf(f,"<div class=\"arrowLeft\" id=\"arrowLeft\" data-bind=\"\tclick: leftClicked,");
					fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcss:{");
					fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'arrowLeftDisabled': disableLeft(),");
					fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'arrowLeft':!disableLeft()");
					fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t} \">\n");
					fprintf(f,"\t\t\t\t\t");
						fprintf(f,"<i class=\"fa fa-arrow-left fa-lg\" aria-hidden=\"true\"></i>\n");
					fprintf(f,"\t\t\t");
					fprintf(f,"</div>\n");	
					fprintf(f,"\t\t");				
				}
				else if(j==5){
					fprintf(f,"\n\t\t\t");					
					fprintf(f,"<div class=\"arrowRight\" id=\"arrowRight\" data-bind=\"\tclick: rightClicked,");
					fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcss:{");
					fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'arrowRightDisabled': disableRight(),");
					fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'arrowRight':!disableRight()");
					fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t} \">\n");
					fprintf(f,"\t\t\t\t\t");
						fprintf(f,"<i class=\"fa fa-arrow-right fa-lg\" aria-hidden=\"true\"></i>\n");
					fprintf(f,"\t\t\t");
					fprintf(f,"</div>\n");
					fprintf(f,"\t\t");					
				}
				//fprintf(f,"\t\t\t");
				fprintf(f,"</div>\n");
			}		
		}
		//second row
		else if(i==1){	
			// leftNavigation		
			fprintf(f,"\t\t");
			fprintf(f,"<div class=\"leftNavigation\">");
					fprintf(f,"\n\t\t\t");
					fprintf(f,"<div class=\"arrowUp\" id=\"arrowUp\" data-bind=\"\tclick: upClicked,");
					fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcss:{");
					fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'arrowUpDisabled': disableUp(),");
					fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'arrowUp':!disableUp()");
					fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t} \">\n");
					fprintf(f,"\t\t\t\t");
						fprintf(f,"<i class=\"fa fa-arrow-up fa-lg\" aria-hidden=\"true\"></i>\n");
					fprintf(f,"\t\t\t");
					fprintf(f,"</div>\n");	
					fprintf(f,"\t\t");
			fprintf(f,"</div>\n");
			// firstCell
			fprintf(f,"\t\t\t");
			fprintf(f,"<div class=\"firstCell\">\n");
			fprintf(f,"\t\t\t\t");
            fprintf(f,"<select class=\"selecter univStudies\" id=\"selectStudy\" data-bind=\"\toptions: Studies,\n");
			fprintf(f,"\t\t\t\t\t");
			fprintf(f,"\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\toptionsText: 'Name',\n");
			fprintf(f,"\t\t\t\t\t");
			fprintf(f,"\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvalue: 'Id',\n");
			fprintf(f,"\t\t\t\t");
			fprintf(f,"\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\toptionsCaption: 'Odaberite studij'\"></select>\n");
			fprintf(f,"\t\t\t\t");
            fprintf(f,"<br />\n");
			fprintf(f,"\t\t\t\t");
            fprintf(f,"<select class=\"selecter univCourse\" id=\"selectCourse\" data-bind=\"\toptions: CoursesActive,\n");
			fprintf(f,"\t\t\t\t\t");
			fprintf(f,"\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\toptionsText: 'Name',\n");
			fprintf(f,"\t\t\t\t\t");
			fprintf(f,"\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvalue: 'Id',\n");
			fprintf(f,"\t\t\t\t");
			fprintf(f,"\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\toptionsCaption: 'Odaberite kolegij'\"></select>\n");
			fprintf(f,"\t\t\t");
        	fprintf(f,"</div>\n");
        	// tableHeading        	
        	for(int j=0;j<5;j++){
		        fprintf(f,"\t\t\t<div class=\"rTableHeading\">\n");
		            fprintf(f,"\t\t\t\t<label class=\"label_t groupName\" \tid=\"groupName%d\" \tdata-bind=\"text: Terms0()[%d].Term().Group().Name\">grupa</label><br>\n",j,j);
		            fprintf(f,"\t\t\t\t<label class=\"label_t groupOwner\" \tid=\"groupOwner%d\" \tdata-bind=\"text: Terms0()[%d].Term().Group().Owner().Name\">demonstrator</label><br>\n",j,j);
		        fprintf(f,"\t\t\t</div>\n");        		
			}
		}
		//third row
		//fourth row
		//fifth row
		//sixth row
		//seventh row
		else{
			// leftNavigation
			
			if(i==5){			
				fprintf(f,"\t\t");
				fprintf(f,"<div class=\"leftNavigation\">\n");
					fprintf(f,"\t\t\t\t<div>\n");
						fprintf(f,"\n\t\t\t\t");
						fprintf(f,"<div class=\"arrowDown\" id=\"arrowarrowDown\" data-bind=\"\tclick: downClicked,");
						fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcss:{");
						fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'arrowDownDisabled': disableDown(),");
						fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'arrowDown':!disableDown()");
						fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t} \">\n");
						fprintf(f,"\t\t\t\t\t");
							fprintf(f,"<i class=\"fa fa-arrow-down fa-lg\" aria-hidden=\"true\"></i>\n");
						fprintf(f,"\t\t\t\t");
						fprintf(f,"</div>\n");	
						fprintf(f,"\t\t\t");
					fprintf(f,"</div>\n");							
					fprintf(f,"\t\t");
				fprintf(f,"</div>\n");	
			}
			else{
				fprintf(f,"\t\t<div class=\"leftNavigation\"></div>\n");				
			}
			
			// date
			fprintf(f,"\t\t<div class=\"firstColumn\">\n");
			 fprintf(f,"\t\t\t<label class=\"label_t date\" id=\"date%d\" data-bind=\"text: Terms%d()[0].Term().TermDate\">datum</label>\n",i-2,i-2);
			fprintf(f,"\t\t</div>\n");	
				
			//cells
        	for(int j=0;j<5;j++){
        		// div tableCell
		        fprintf(f,"\t\t<div class=\"rTableCell\" data-bind=\" css: { ");
				fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t 'rTableCell0':  Terms%d()[%d].CellState()==0, ", i-2, j);
				fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t 'rTableCell1':  Terms%d()[%d].CellState()==1, ", i-2, j);
				fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t 'rTableCell2':  Terms%d()[%d].CellState()==2,  ", i-2, j);
				fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t 'rTableCell3':  Terms%d()[%d].CellState()==3, ", i-2, j);
				fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t 'rTableCellX':  Terms%d()[%d].CellState()!=0 && ", i-2, j, i-2, j);
				fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t Terms%d()[%d].CellState()!=1 && ", i-2, j);
				fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t Terms%d()[%d].CellState()!=2 && ", i-2, j);
				fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t Terms%d()[%d].CellState()!=3 ", i-2, j);
				fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t }\">\n");
				
				// label demoName
				fprintf(f,"\t\t\t<div id=\"termOwner%d%d\" class=\"label_t demoName\" data-bind=\"text: Terms%d()[%d].Term().User().Name\">demonstrator</div><br>\n",i-2,j,i-2,j);
				
				// button takeTerm
				fprintf(f,"\t\t\t<button id=\"buttonTakeTerm%d%d\" class=\"tableButton\" data-bind=\"text: defaultTextButtonTake, css:\t{ ", i-2, j, i-2, j);
				fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'takeTerm':Terms%d()[%d].ButtonTakeState(),", i-2,j);
				fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'takeTermDisabled': !Terms%d()[%d].ButtonTakeState()",i-2,j);
				fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t}\"></button>\n");
				
				// button skipTerm
				fprintf(f,"\t\t\t<button id=\"buttonSkipTerm%d%d\" class=\"tableButton\" data-bind=\"text: defaultTextButtonSkip, css:\t{ ", i-2, j, i-2, j);
				fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'skipTerm':Terms%d()[%d].ButtonSkipState(),", i-2,j);
				fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'skipTermDisabled': !Terms%d()[%d].ButtonSkipState()",i-2,j);
				fprintf(f,"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t}\"></button>\n");
				
				// select searchDemonstrator
				fprintf(f,"\t\t\t<select id=\"search%d%d\" class=\"\" data-bind=\"\toptions: Demonstrators,\n",i-2,j);
				fprintf(f,"\t\t\t\t\t\t\t\t\t\t\t\t\t\toptionsText: 'Name',\n");
				fprintf(f,"\t\t\t\t\t\t\t\t\t\t\t\t\t\tvalue: 'Id',\n");
				fprintf(f,"\t\t\t\t\t\t\t\t\t\t\t\t\t\toptionsCaption: 'Odaberite demonstratora',\n");
				fprintf(f,"\t\t\t\t\t\t\t\t\t\t\t\t\t\tcss:{\n",i-2,j);
				fprintf(f,"\t\t\t\t\t\t\t\t\t\t\t\t\t\t'searchStudent':Terms%d()[%d].DemoPickerState(),\n",i-2,j);
				fprintf(f,"\t\t\t\t\t\t\t\t\t\t\t\t\t\t'searchStudentDisabled':!Terms%d()[%d].DemoPickerState()\n",i-2,j);
				fprintf(f,"\t\t\t\t\t\t\t\t\t\t\t\t\t\t}\">\n");
				fprintf(f,"\t\t\t</select>\n");
		        fprintf(f,"\t\t</div>\n");        		
        	}			
		}		
		fprintf(f,"\t");
		fprintf(f,"</div>\n");
	}
	fprintf(f,"</div>");
	fclose(f);
}

