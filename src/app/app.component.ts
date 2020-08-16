import { Component } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http'
import * as XLSX from 'xlsx';
import { ArrayType } from '@angular/compiler/src/output/output_ast';


import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent {
  title = 'app';
  public progress: number;
  public message: string;
  public excelData: ExcelData[];
  public require: any
  public result: {};
  public countpos: number;
  public countneg: number;
  public countneutral: number;
  constructor(private http: HttpClient) { }
  data = [];
  onFileChange(evt: any) {
    //debugger
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length == 1) {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        console.log(wb);
        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        /* save data */
        this.data = <any>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      };
      reader.readAsBinaryString(target.files[0]);
    }
  }

  uploadfile() {
    var Sentiment = require('sentiment');
    var sentiment = new Sentiment();
    let keys = this.data.shift();
    let resArr = this.data.map((e) => {
      let obj = {};
      keys.forEach((key, i) => {
        obj[key] = e[i];
        //if (key == "CComments") {
          //this.result=sentiment.analyze(e[i]);
          //console.dir(this.result);
        //}
      });
      return obj;
    });
    this.excelData = resArr;

    
    this.countpos = 0;
    this.countneg = 0;
    this.countneutral = 0;
    let resArr2 = this.data.map((e) => {
      let obj2 = {};
      keys.forEach((key, i) => {
        if (key == "COMMENTSLONG") {
          obj2[key] = sentiment.analyze(e[i]);
          if (obj2[key].score > 0) {
            obj2[key].score = "positive";
            this.countpos = this.countpos + 1;
          }
          else {
            if (obj2[key].score < 0) {
              obj2[key].score = "negative";
              this.countneg = this.countneg + 1;
            }
            else {
              obj2[key].score = "neutral";
              this.countneutral = this.countneutral + 1;
            }
          }

            obj2[key].comparative = obj2[key].comparative;
            
        }
      });
      return obj2;
    });
    this.result = resArr2;
    console.dir(this.result);
   



    am4core.useTheme(am4themes_animated);
    let chart = am4core.create("chartdiv", am4charts.PieChart);

// Add data
chart.data = [ {
  "country": "Positive",
  "litres": this.countpos
}, {
    "country": "Negative",
    "litres": this.countneg
}, {
  "country": "Neutral",
  "litres": this.countneutral
}];

// Add and configure Series
let pieSeries = chart.series.push(new am4charts.PieSeries());
pieSeries.dataFields.value = "litres";
pieSeries.dataFields.category = "country";
pieSeries.slices.template.stroke = am4core.color("#fff");
pieSeries.slices.template.strokeWidth = 2;
pieSeries.slices.template.strokeOpacity = 1;

// This creates initial animation
pieSeries.hiddenState.properties.opacity = 1;
pieSeries.hiddenState.properties.endAngle = -90;
pieSeries.hiddenState.properties.startAngle = -90;



    

  }
}
interface ExcelData {
  [index: number]: {
    RID: string; COLTREFERENCE: string; COMPANYNAME: string; OCN: string; TICKETTYPE: string;
    TICKETSTATUS: string; URGENCY: string; FIRSTNAME: string; LASTNAME: string;
    EMAILADDR: string; AUID: string; TODOCD: string; COMMENTSLONG: string
  };
}



