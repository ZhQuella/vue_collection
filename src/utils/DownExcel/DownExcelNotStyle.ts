import DownExcel from "./DownExcel";
import * as XLSX from "xlsx";

import type { WritingOptions, WorkSheet } from "xlsx";
import type { Workbook } from "types/downExcel";

class DownExcelNotStyle extends DownExcel{ 

  private tableHeader: any[] = [];
  private outMarge: any = {};

  constructor({ header = [] }: any) {
    super();
    this.tableHeader = header;
    this.outMarge = {
      startCell: -1,
      basisRow: 0,
      basisCell: 0,
      maxRow: 0
    };
  }

  public down(fileName: string, tableData: any[]):void { 
    const { tableHeader, outMarge } = this;
    let maxLevel = this.maxLevel(tableHeader);
    const mergeInfo = this.resetMergeHeaderInfo(tableHeader, maxLevel, outMarge, []);
    const lastChild = this.getLastChild(tableHeader);
    //  下面的都不行，有问题
    const headCsv = this.getHeadCsv(tableHeader, lastChild, maxLevel, mergeInfo);
    const dataCsv = this.getDataCsv(tableData, lastChild);
    const allCsv = this.margeCsv(headCsv, dataCsv);
    const cscSeet = this.csv2sheet(allCsv);
    cscSeet['!merges'] = mergeInfo;
    let blob = this.sheet2blob(cscSeet);
    this.openDownloadDialog(blob,`${fileName}.xlsx`);
  }

  sheet2blob(sheet: WorkSheet, sheetName?: string):Blob {
    //  导出文件类型
    sheetName = sheetName || 'sheet1';
    var workbook:Workbook  = {
      SheetNames: [sheetName],
      Sheets: {}
    };
    workbook.Sheets[sheetName] = sheet;
    var wopts: WritingOptions = {
      bookType: "xlsx",
      bookSST: false,
      type: 'binary'
    };
    var wbout = XLSX.write(workbook, wopts);
    var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
    // 字符串转ArrayBuffer
    function s2ab(s: string) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }
    return blob;
  };

  openDownloadDialog(url: any, saveName: string): void {
    if(typeof url == 'object' && url instanceof Blob){
      url = URL.createObjectURL(url); // 创建blob地址
    }
    var aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || '';
    var event;
    if(window.MouseEvent) event = new MouseEvent('click');
    else
    {
      event = document.createEvent('MouseEvents');
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
  }

  getDataCsv(data: any[], lastChild: any[]): string{
    let result = [];
    for(let j = 0, ele; ele = data[j++];){
      let value = [];
      for(let i = 0, item; item = lastChild[i++];){
        value.push(ele[item.field] || "-");
      };
      result.push(value);
    }
    result = result.map((el) => {
      return el.join("^");
    });
    return result.join("~");
  }

  getHeadCsv(tableHeader: any[], lastChild: any[], maxLevel: number, mergeInfo: any[]): string{
    let csvArr = [];
    let csv = "";
    for(let i = 0; i < (maxLevel + 1); i++){
      let item = [];
      for(let j = 0; j < lastChild.length; j++){
        item.push(null);
      }
      csvArr.push(item);
    }
    for(let i = 0; i < mergeInfo.length; i++){
      let info = mergeInfo[i];
      const { s, item } = info;
      const { c, r } = s;
      const { title } = item;
      csvArr[r][c] = title;
    }
    csvArr = csvArr.map((el) => {
      return el.join("^");
    });
    return csvArr.join("~");
  }

  margeCsv(headCsv: string, dataCsv: string){
    return `${headCsv}~${dataCsv}`;
  }

  csv2sheet(csv: string):WorkSheet {
    const _csv:string[] = csv.split('~');
    //  缓存
    let arr:string[][] = [];
    //  剪切未数组
    _csv.forEach((el:string) => {
      //  剪切数据并添加答题arr
      let arrItem:string[] = el.split("^");
      arr.push(arrItem);
    });
    //  调用方法
    return XLSX.utils.aoa_to_sheet(arr);
  }

  resetMergeHeaderInfo(tableHeader: any[], maxLevel: number, outMarge: any, result: any[]): any[]{
    this.tagHeadIn();
    this.tagMaxLevel(tableHeader);
    for(let i = 0; i < tableHeader.length; i++){
      let item = tableHeader[i];
      //  纵向跨度
      const { maxLen } = item;
      //  横向跨度
      let lastChild = this.getLastChild(item.children || []);
      //  s :  开始  e : 结束
      //  c : 列（横向）  
      //  r ： 行（纵向）
      let s: any = {};
      let e: any = {};
      if(!item.children){
        if(item.isOut){
          outMarge.startCell += 1;
          outMarge.basisCell += 1;
          s.r = 0;
          e.r = maxLevel;
          s.c = outMarge.startCell;
          e.c = outMarge.startCell;
          result.push({ s, e, item });
        }
        else{
          let r = maxLevel - (outMarge.basisRow + maxLen);
          r = Math.max(r, 0);
          s.c = outMarge.basisCell;
          e.c = outMarge.basisCell;
          s.r = outMarge.basisRow;
          e.r = r + outMarge.basisRow + maxLen;
          result.push({ s, e, item });
          outMarge.basisCell += 1;
        }
      };
      if(item.children){
        if(item.isOut){
          s.r = 0;
          e.r = 0;
          outMarge.startCell += 1;
          s.c = outMarge.startCell;
          outMarge.startCell += lastChild.length - 1;
          e.c = outMarge.startCell;
          result.push({ s, e, item });
        }else{
          s.c = outMarge.basisCell;
          e.c = outMarge.basisCell + lastChild.length - 1;
          s.r = outMarge.basisRow;
          e.r = outMarge.basisRow;
          result.push({ s, e, item });
        }
        outMarge.basisRow += 1;
        this.resetMergeHeaderInfo(item.children, maxLevel, outMarge, result);
      };
    };
    outMarge.basisRow -= 1;
    return result;
  }

  tagHeadIn(){
    const { tableHeader } = this;
    tableHeader.forEach((el) => {
      el.isOut = true;
      return el;
    })
  }

  tagMaxLevel(tableHeader: any[]){
    const maxLevel = this.maxLevel(tableHeader, false);
    tableHeader.forEach((el) => {
      if(!el.children){
        el.maxLen = maxLevel;
      }
      else{
        this.tagMaxLevel(el.children);
        el.maxLen = maxLevel;
      }
    });
  }

  maxLevel(arr: any[], isSetFloor: boolean = true): number {
    let floor = -1;
    let max = -1;
    function each (data: any[], floor: number) {
      data.forEach(e => {
        max = Math.max(floor, max);
        isSetFloor && (e.floor = (floor + 1));
        if (e.children) {
          each(e.children, floor + 1)
        }
      })
    }
    each(arr,0)
    return max;
  }

  getLastChild (arr: any[], result: any[] = []){
    for(let i = 0,item; item = arr[i++];){
      if(!item.children){
        result.push(item);
      }else{
        result = this.getLastChild(item.children, result);
      }
    }
    return result;
  }

};

export default DownExcelNotStyle;
