import { Component, ViewChild } from '@angular/core';

import { DataTableDirective } from 'angular-datatables';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import  *  as  data  from  './../assets/data/MOCK_DATA.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'qnap';
  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;    
  dtOptions: DataTables.Settings = {};
  fileInfo:any=[];
  formated_data :any=[];
  filterForm: FormGroup;
  filterVal:any;
 
  constructor(private fb: FormBuilder ){}
  ngOnInit(){
    let fileInformation:any = data;
    this.fileInfo = fileInformation.default; 
    
    this.filterForm = this.fb.group({
      filterVal: null
    });

    this.dataTableCall();
  }

  public dataTableCall(filterVal: any = '', closed_files: any = '') {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
      searching: false,
      lengthChange: false,
      serverSide: true,
      processing: true,
      order: [],
      columnDefs: [
        {
          "targets": 'nosort',
          "orderable": false
        }
      ],
      ajax: (dataTablesParameters: any, callback:any) => {         
        this.formated_data = this.filterfileData(dataTablesParameters);
          
        callback({
          recordsTotal: 200 ,
          recordsFiltered: 200,
          data: []
        }); 
      },
      columns: [{ data: 'id' }, { data: 'first_name' }, { data: 'last_name' }, { data: 'email' }
        , { data: 'gender' }, { data: 'ip_address' }, { data: 'timestamp' }]
    };
  }

  filterfileData(dataparam){
    let start=0;
    let length = dataparam.length;

    let filterData = this.fileInfo.splice(start, length);
    return filterData;
  }


  onchangeFilter($event) { 
    let filterVal = $event.srcElement.value; 
    console.log(filterVal, " filterVal ");
    
    if(filterVal != ''){
      this.formated_data = this.formated_data.find(item => (item.id === filterVal || item.first_name === filterVal || item.last_name === filterVal || item.email === filterVal || item.gender === filterVal));
      
      console.log(this.formated_data, " this.formated_data ");
      
      if(this.formated_data && this.formated_data.length>0){
        this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.draw();
        });
      }
    } else {
      this.formated_data = this.fileInfo;
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });
    }
    
    
    
  }
}
