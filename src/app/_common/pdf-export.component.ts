import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { Globalize } from '../_common/globalizejs';
import { AppSettingService } from '../_common/appsetting.service';
import { UtilityMethod } from './utility-method';
declare let jsPDF: any;
declare let html2canvas: any;
//var $ = require('jquery');
@Injectable()
export class jsPdf {
    filename: string;
    defaultXValue: number = 8;
    defaultYValue: number = 10;
    x: number;
    y: number;
    pdf: any;
    constructor(private http: HttpClient,private appSettingService: AppSettingService) {

    }

    SetupPdf(pageConfig: PDfConfig): any {

        this.x = this.defaultXValue;
        this.y = this.defaultYValue;

        //pdf configuration
        this.pdf = new jsPDF(pageConfig.orientation, 'mm', [pageConfig.pageWidth, pageConfig.pageHeight]);


        //adding bg to the page if any
        this.addBackgroundToPDF();

        this.filename = pageConfig.title + '.pdf';

        //Setting PDF Properties
        this.pdf.setProperties({
            title: pageConfig.title,
            subject: pageConfig.subject,
            author: pageConfig.author,
            keywords: pageConfig.keywords,
            creator: pageConfig.creator
        });

        this.pdf.page = 1;
        return this.pdf;
    }

    addBackgroundToPDF() {
        this.pdf.setFontSize(12);
        //pdf.setFillColor(220, 37, 20, 0);
        //pdf.setTextColor(255, 255, 255);
        //pdf.setTextColor(0, 0, 0);
        //pdf.rect(0, 0, this.pageA4Size.x, this.pageA4Size.y, "F");

    }

    //used this method to add new page based on element position
    pdfpageBreak(adjustment: number = 10): number {
        //check if question which we are going to print on pdf is having graph 
        //in case of garph we need page size 80 available 
        //if (restypeid != QuestionResponseType.text) {
        //    pagebreakLength = pagebreakLength + 80;
        //}
        let _pdf = this.pdf;
        if (this.y >= _pdf.internal.pageSize.height - adjustment) {
            this.y = this.addNewPage();
        }
        return this.y;
    }

    footerText() {
        let _pdf = this.pdf;
        _pdf.setFontSize(7);
        var footertext = "page " + _pdf.page;
        this.centerAlignText(footertext, 8, 'bold', 0, false, null, true);
    }

    headerText() {
        let _pdf = this.pdf;
        _pdf.setFontSize(9);
        _pdf.setFontType('italic');
        var headerText = 'Report Date:' + UtilityMethod.formatDateExtended(new Date());
        _pdf.text((_pdf.internal.pageSize.width - 55), 5, headerText);
    }

    centerAlignText(text: string, fontSize: number = 10, fontType: string = 'bold', adjustment = 0, linebreak: boolean = false, lineheight: number = 8, footer: boolean = false): number
    {
        let _pdf = this.pdf;
        let _x = this.defaultXValue;
        let _y = this.y;
        var _text = text.trim();
        var defaultFontSize = _pdf.internal.getFontSize();

        var textWidth = _pdf.getStringUnitWidth(_text) * (fontSize) / _pdf.internal.scaleFactor;
        var textOffset = (_pdf.internal.pageSize.width - (textWidth + this.defaultXValue)) / 2;

        //setting font size to info
        _pdf.setFontSize(fontSize);
        _pdf.setFontType(fontType);

        _pdf.text(textOffset - adjustment, (footer ? _pdf.internal.pageSize.height - 4 : _y), _text);
        if (linebreak) {
            _y = this.dottedLine(_y + 2, _pdf.internal.pageSize.width - this.defaultXValue, _y + 2, _pdf.internal.pageSize.width - (this.defaultXValue * 2));

        }
        //resetting to default font
        _pdf.setFontSize(defaultFontSize);
        _pdf.setFontType("normal");

        return this.y = _y + lineheight;
    }

    dottedLine(yFrom: number, xTo: number, yTo: number, segmentLength: number): number {
        let _pdf = this.pdf;
        let xFrom = this.x;

        // Calculate line length (c)
        var a = Math.abs(xTo - xFrom);
        var b = Math.abs(yTo - yFrom);
        var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

        // Make sure we have an odd number of line segments (drawn or blank)
        // to fit it nicely
        var fractions = c / segmentLength;
        var adjustedSegmentLength = (Math.floor(fractions) % 2 === 0) ? (c / Math.ceil(fractions)) : (c / Math.floor(fractions));

        // Calculate x, y deltas per segment
        var deltaX = adjustedSegmentLength * (a / c);
        var deltaY = adjustedSegmentLength * (b / c);
        var curX = xFrom, curY = yFrom;
        while (curX <= xTo && curY <= yTo) {

            _pdf.setDrawColor(0, 0, 0);
            _pdf.line(curX, curY, curX + deltaX, curY + deltaY);
            curX += 2 * deltaX;
            curY += 2 * deltaY;
        }

        return this.y;
    }

    addNewPage(): number {
        this.footerText();
        this.pdf.addPage();
        this.pdf.page++;
        this.addBackgroundToPDF();
        return this.y = this.defaultYValue;
    }

    addTextToPdf(text: string, fontType:string="normal", lineheight: number = 7): number {
        let _x = this.defaultXValue;
        let _y = this.y;
        let _pdf = this.pdf;
        _pdf.setFontSize(12);
        _pdf.setFontType(fontType);
        var splitText = _pdf.splitTextToSize(text, (_pdf.internal.pageSize.width) - 60);
        //loop thru each line and output while increasing the vertical space
        for (var c = 0, stlength = splitText.length; c < stlength; c++) {
            var sText = splitText[c];
            if (sText) {
                _pdf.text(_x, _y, sText);
                _y = _y + lineheight;
                this.y = _y;
                _y = this.pdfpageBreak(lineheight+5);
            }
        }
        return this.y = _y;
    }

    resetXValue(): number {
        return this.x = this.defaultXValue;
    }

    resetYValue(): number
    {
        return this.y = this.defaultYValue;
    }

    Save() {
        this.pdf.save(this.filename);
    }

    addRect(x: number, y: number, x2: number, y2: number)
    {
        this.pdf.rect(x, y - 2, x2 + 2, y2 + 2, "F");
    }

    addCommsManagerLogo()
    {
        let logowidth = 50;
        let logoheight = 26;
        this.pdf.addImage(this.appSettingService.pdflogo, 'PNG', this.x, 3, logowidth, logoheight, null, "slow");
        //update x vaiable
        this.y = this.y + logoheight + 5;
    }



}

export class PDfConfig {
    title: string;
    subject: string;
    author: string;
    keywords: string;
    creator: string;
    orientation: string;
    pageWidth: number;
    pageHeight: number;

}
