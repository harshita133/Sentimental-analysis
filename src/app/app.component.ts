import { Component } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http'
import * as XLSX from 'xlsx';
import { ArrayType } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  public progress: number;
  public message: string;
  public excelData: ExcelData[];
  public require: any
  public result: {};
  public combine: {};
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
    //console.log(resArr);
    //resArr.forEach(function (value) {
    //  console.log(value);
    //})
    this.excelData = resArr;

    //var Sentiment = require('sentiment');
    //var sentiment = new Sentiment();
    //var result = sentiment.analyze('a cat is lovely');
    //console.dir(result);

    let resArr2 = this.data.map((e) => {
      let obj2 = {};
      keys.forEach((key, i) => {
        if (key == "CComments") {
          obj2[key] = sentiment.analyze(e[i]);
        }
        //if (key == "CComments") {
        //this.result=sentiment.analyze(e[i]);
        //console.dir(this.result);
        //}
      });
      return obj2;
    });
    this.result = resArr2;
    console.dir(this.result);

    //this.combine = [...this.excelData, ...this.result];
  }
}
interface ExcelData {
  [index: number]: { CId: number; CName: string; CComments: string };
}



