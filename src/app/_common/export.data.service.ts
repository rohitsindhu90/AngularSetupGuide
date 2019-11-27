import { Injectable } from '@angular/core';

@Injectable({
    providedIn:'root'
})
export class ExportDataService {

    ExportToCSV(modelData: any, filename: string) {

        var csvData = this.ConvertToCSV(modelData);
        var blob = new Blob([csvData], { type: 'text/csv' });
        var currentDate = new Date().toDateString();
        // if browser is IE then save the file as blob, tested on IE10 and IE11
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename + currentDate + '.csv')
        }
        else {
            var a = document.createElement("a");
            if (a.download !== undefined) {
                a.setAttribute('style', 'display:none;');
                document.body.appendChild(a);
                var url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = filename + currentDate + '.csv';
                a.click();
            }
        }

    }


    // convert Json to CSV data in Angular2
    private ConvertToCSV(objArray: any) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in objArray[0]) {
            //Now convert each value to string and comma-separated
            row += index + ',';
        }
        row = row.slice(0, -1);
        //append Label row with line break
        str += row + '\r\n';

        //1st loop is to extract each row
        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','

                if (Array.isArray(array[i][index])) {
                    var innerline = '';
                    var innerArray = array[i][index];
                    var t = 0;
                    for (var j in innerArray) {
                        innerline += ' ';
                        var response = innerArray[j];
                        innerline += t > 0 ? "|" + response : response;
                        t++;
                    }
                    if (innerline != null && innerline != "")
                        line += innerline + ',';
                }
                else {
                    line += array[i][index];
                }

            }

            str += line + '\r\n';
        }

        return str;
    }

}