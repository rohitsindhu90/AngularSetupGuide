import { UtilityMethod } from '../_common/utility-method';
import * as $ from 'jquery';
declare let Chart: any;
import { GlobalEventsManager } from 'primengdevng8/api';

export class ChartHelper {
    //public static graphColor: any[] = ["#00E9D3", "#823EFF", "#EA773D", "#314AFF", "#06FF76", "#E61165", "#3385ff", "#8533ff", "#9999ff", "#00cc44", "#ff3333", "#00cc44", "#990000", "#ffff33", "#c888fe", "#ff9933", "#b147c2"];
    public static graphColor: any[] = ["#00E9D3", "#823EFF", "#EA773D", "#3385ff", "#DEB887", "#E61165", "#C0C0C0", "#F9DBD1", "#9999ff", "#556B2F", "#ff3333", "#00cc44", "#990000", "#FFFF97", "#c888fe", "#FFF8DC", "#778899"];
    public static getChartOptions(charttype: ChartType, legend: boolean = true, displayCurrency: boolean = true, toolTip: boolean = false,
        stepSize: number = 0, legendposition: string = "bottom", labelCondition: boolean = false, stacked: boolean = false,
        handleClick: any = null, fontSize?: number, isCurrenyRoundOff: boolean = false, cursorOnlabel: boolean = false): any {
        //bar chart option object used
        //var fontSize: number = 16;
        var options = {};
        if (charttype == ChartType.bar) {

            options = {
                responsive: true,
                legend: {
                    display: legend,
                    //labels: { fontColor: "white" },
                    position: legendposition

                },
                //this event is to extend the default event to display data with currency symbol
                scales: {
                    yAxes: [{
                        stacked: stacked,
                        ticks: {
                            fontSize: fontSize,
                            //fontColor: "white",
                            beginAtZero: true,
                            stepSize: stepSize,
                            userCallback: function (label: number, index: any, labels: number[]) {
                                // when the floored value is the same as the value we have a whole number
                                //if (Math.floor(label) === label || stepSize==1) {
                                return isCurrenyRoundOff ? label.toFixed(2)
                                    : (displayCurrency ? UtilityMethod.formatCurrencyExtended(Number(label)) : label.toLocaleString());
                                //}

                            },
                        },

                        gridLines: {
                            //display: false,
                            //color: "#3b596f"
                            display: true,
                            color: "#e3e6e8"
                        }
                    }],
                    xAxes: [{
                        stacked: stacked,
                        cursor: "pointer",
                        ticks: {
                            fontSize: fontSize,
                            autoSkip: false,
                            //fontColor: "white"
                            cursor: "pointer",
                        },
                        gridLines: {
                            display: false,
                            color: "#3b596f"
                        },

                    }]
                },
                onClick: function (evt: any) {
                    if (handleClick != null && handleClick != undefined) {
                        handleClick(evt, this.chart.controller);
                    }
                },
                onHover: function (e: any) {
                    // alert("on Hover Fire");
                },
                mouseover: function (e: any) {
                    // alert("Mouse Over Fired");
                },
                onMouseover: function (e: any) {
                    // alert("On Mouse Over Fired");
                },
                //this event is to extend the default event to display data with currency symbol
                tooltips: {
                    enabled: toolTip,
                    callbacks: {
                        label: function (tooltipItems: any, data: any) {
                            if (toolTip) {
                                return data.datasets[tooltipItems.datasetIndex].label + ' : ' + tooltipItems.yLabel.toLocaleString();
                            }
                        }
                    }

                },
                hover: {
                    animationDuration: 0,
                    cursor: 'pointer',
                    onHover: function (e: any) {
                        if (cursorOnlabel) {
                            e.target.style.cursor = 'pointer';
                        }

                    },
                },
                // this event is not display label on bar 
                animation: {
                    onComplete: function () {
                        if (!toolTip) {
                            var chartInstance = this.chart,
                                ctx = chartInstance.ctx;
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
                            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                            ctx.fillStyle = Chart.defaults.global.defaultFontColor;

                            this.data.datasets.forEach(function (dataset: any, i: any) {

                                var meta = chartInstance.controller.getDatasetMeta(i);
                                if (!meta.hidden) {
                                    meta.data.forEach(function (bar: any, index: any) {

                                        var scale_max = bar._yScale.maxHeight;
                                        var data = dataset.data[index];
                                        if ((labelCondition && Number(data) > 0) || !labelCondition) {

                                            data = isCurrenyRoundOff ? data.toFixed(2)
                                                : (displayCurrency ? UtilityMethod.formatCurrencyExtended(Number(data)) : data);
                                            var y_pos = bar._model.y - 5;
                                            if ((scale_max - bar._model.y) / scale_max >= 0.93)
                                                y_pos = bar._model.y + 20;
                                            ctx.fillText(data, bar._model.x, y_pos);
                                        }
                                    });
                                }
                            });
                        }
                    }
                },

            };
        }
        else if (charttype == ChartType.pie) {

            options = {

                legend: {
                    labels: {
                        //fontColor: "white",
                        generateLabels: function (chart: any) {
                            var data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map(function (label: any, i: any) {
                                    var meta = chart.getDatasetMeta(0);
                                    let ds = data.datasets[0];
                                    let arc = meta.data[i];
                                    let custom = arc && arc.custom || {};
                                    let getValueAtIndexOrDefault = Chart.helpers.getValueAtIndexOrDefault;
                                    let arcOpts = chart.options.elements.arc;
                                    let fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
                                    let stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
                                    var bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);

                                    //We get the value of the current label
                                    var value = chart.config.data.datasets[arc._datasetIndex].data[arc._index];
                                    return {
                                        // Instead of `text: label,`
                                        // We add the value to the string
                                        text: label + " (" + UtilityMethod.formatCurrencyExtended(parseFloat(value)) + ")",
                                        fillStyle: fill,
                                        strokeStyle: stroke,
                                        lineWidth: bw,
                                        hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
                                        index: i
                                    };
                                });
                            } else {
                                return [];
                            }
                        }

                    },
                    display: legend,
                    position: legendposition,

                },
                // this event is to extend the default event to display data with currency symbol
                tooltips: {
                    enabled: toolTip,
                    callbacks: {
                        label: function (tooltipItem: any, data: any) {
                            var allData = data.datasets[tooltipItem.datasetIndex].data;
                            var tooltipLabel = data.labels[tooltipItem.index];
                            var tooltipData = allData[tooltipItem.index];
                            //var total = 0;
                            //for (var i in allData) {
                            //    total += allData[i];
                            //}
                            //var tooltipPercentage = Math.round((tooltipData / total) * 100);
                            var tooltiptext = tooltipLabel + " (" + UtilityMethod.formatCurrencyExtended(parseFloat(tooltipData)) + ")";
                            return tooltiptext;
                        }
                    }
                },
                hover: {
                    animationDuration: 0
                }


            };
        }
        else if (charttype == ChartType.line) {
            options = {
                legend: {
                    display: legend,
                    //labels: { fontColor: "white" },
                    position: legendposition
                },
                //this event is to extend the default event to display data with currency symbol
                scales: {
                    yAxes: [{
                        ticks: {
                            fontSize: fontSize,
                            //fontColor: "white",
                            beginAtZero: true,
                            userCallback: function (label: number, index: any, labels: number[]) {
                                // when the floored value is the same as the value we have a whole number
                                if (Math.floor(label) === label) {
                                    return UtilityMethod.formatCurrencyExtended(label);
                                }

                            },
                        }, gridLines: {
                            display: true,
                            color: "#3b596f"
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontSize: fontSize,
                            //fontColor: "white"
                        },
                        gridLines: {
                            display: true,
                            color: "#3b596f"
                        }
                    }]
                },
                onClick: function (evt: any) {
                    if (handleClick != null && handleClick != undefined) {
                        handleClick(evt, this.chart.controller);
                    }
                },
                //this event is to extend the default event to display data with currency symbol
                tooltips: {
                    enabled: toolTip,
                    callbacks: {
                        label: function (tooltipItem: any, data: any) {
                            return data.datasets[tooltipItem.datasetIndex].label + ' : ' + UtilityMethod.formatCurrencyExtended(tooltipItem.yLabel);
                        }
                    }
                },
                hover: {
                    animationDuration: 0
                },
            };
        }
        return options;
    }

    public static getInvoiceSummaryCustomToolTipwithFormulaChartOptions(charttype: ChartType, legend: boolean = true, displayCurrency: boolean = true, toolTip: boolean = false, stacked: boolean): any {
        //bar chart option object used

        var options = {};
        if (charttype == ChartType.bar) {
            options = {
                legend: {
                    display: legend,
                    //labels: { fontColor: "white" },
                    position: 'bottom'
                },
                //this event is to extend the default event to display data with currency symbol
                scales: {
                    yAxes: [{
                        stacked: stacked,
                        ticks: {
                            //fontColor: "white",
                            beginAtZero: true,
                            userCallback: function (label: number, index: any, labels: number[]) {
                                // when the floored value is the same as the value we have a whole number
                                if (Math.floor(label) === label) {

                                    return displayCurrency ? UtilityMethod.formatCurrencyExtended(label) : label;
                                }

                            },
                        },
                        gridLines: {
                            display: true,
                            color: "#e3e6e8"
                            //color: "#3b596f"
                        }
                    }],
                    xAxes: [{
                        //ticks: {
                        //    fontColor: "white"
                        //},
                        gridLines: {
                            display: false,
                            color: "#3b596f"
                        }
                    }]
                },

                // this event is to extend the default event to display data with currency symbol
                tooltips: {
                    enabled: toolTip,

                    mode: 'index',
                    intersect: true,
                    //xPadding: 25,
                    //yPadding: 20,
                    //bodySpacing: 2,
                    //caretSize: 10,
                    //cornerRadius: 8,
                    //intersect: true,
                    //position: 'nearest',
                    callbacks: {
                        title: function (tooltipItems: any, data: any) {
                            var xLabel = "";
                            if (tooltipItems.length > 0) {
                                xLabel = tooltipItems[0].xLabel;
                            }
                            else {
                                xLabel = tooltipItems.xLabel;
                            }
                            var tooltipText = "";
                            let invoicecostlabel = "Invoice Cost", servicechargelabel = "Service Charge", usagechargelabel = "Usage Charge", otherchargelabel = "Other Charge";
                            //tooltipText = xLabel +" ";
                            if (xLabel == invoicecostlabel) {
                                tooltipText = "Total Spend";
                            }
                            if (xLabel == servicechargelabel) {
                                tooltipText = servicechargelabel + " + Service Credit";
                            }
                            if (xLabel == usagechargelabel) {
                                tooltipText = "Usage Cost + Usage Credit";
                            }
                            if (xLabel == otherchargelabel) {
                                tooltipText = otherchargelabel + " + Other Credits";
                            }
                            return tooltipText;

                        },
                        label: function (tooltipItems: any, data: any) {
                            var label = data.datasets[tooltipItems.datasetIndex].label;
                            var ylable = displayCurrency ? UtilityMethod.formatCurrencyExtended(tooltipItems.yLabel) : tooltipItems.yLabel;
                            var xLabel = tooltipItems.xLabel;
                            var tooltipText = "";
                            tooltipText = label + " : ";
                            return tooltipText + ylable;

                        }

                    }

                },

                hover: {
                    animationDuration: 0
                },
                // this event is not dislay label on bar 
                animation: {
                    onComplete: function () {
                        //if ("1"=="2") {
                        var chartInstance = this.chart,
                            ctx = chartInstance.ctx;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';
                        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                        ctx.fillStyle = Chart.defaults.global.defaultFontColor;
                        var _this = this;
                        this.data.datasets.forEach(function (dataset: any, i: any) {
                            var meta = chartInstance.controller.getDatasetMeta(i);
                            var label = dataset.label;
                            if ((_this.data.datasets.length - 1) == i) {
                                meta.data.forEach(function (bar: any, index: any) {
                                    // if (label == "EE") {
                                    let total: number = 0;
                                    /* let v1 = _this.data.datasets[0].data[index];
                                     let v2 = _this.data.datasets[1].data[index];
                                     let v3 = _this.data.datasets[2].data[index];*/


                                    _this.data.datasets.forEach(function (set: any, ii: any) {
                                        let instance = chartInstance.controller.getDatasetMeta(ii);
                                        if (instance.hidden != true) {
                                            total = total + parseFloat(set.data[index]);
                                        }

                                    });
                                    var scale_max = bar._yScale.maxHeight;
                                    //data = parseFloat(v1) + parseFloat(v2) + parseFloat(v3); //dataset.data[index];
                                    let data = UtilityMethod.formatCurrencyExtended(Number(total));
                                    var y_pos = bar._model.y - 5;
                                    if ((scale_max - bar._model.y) / scale_max >= 0.91)
                                        y_pos = bar._model.y + 20;
                                    ctx.fillText(data, bar._model.x, y_pos);
                                    //}
                                });
                            }
                        });
                        //}
                    }
                },

            };
        }

        return options;
    }
    public static MockData: any = {
        labels: [
            "DATA",
            "ROAMED DATA",
            "ROAMED OUT",
            "INTERNATIONAL",
            "INTERNATIONAL SMS",
            "ROAMED INCOMING SMS",
            "NATIONAL",
            "SAME NETWORK",
            "CROSS NET",
            "DIRECTORY ENQUIRIES",
            "SMS OUT",
            "PREMIUM SMS",
            "VOICE MAIL",
            "PREMIUM SERVICE",
            "ROAMED RECEIVED",
            "PERSONAL NUMBER",
            "MMS OUT",
            "NON-GEOGRAPHIC",
            "WITHIN COMPANY"
        ],
        datasets: [
            {
                data: [
                    "0.00",
                    "0.00",
                    "0.44",
                    "2.61",
                    "0.00",
                    "0.00",
                    "0.77",
                    "0.00",
                    "0.19",
                    "0.00",
                    "0.38",
                    "0.66",
                    "0.00",
                    "0.49",
                    "0.00",
                    "0.33",
                    "0.82",
                    "0.24",
                    "0.00"
                ]
            }
        ]
    };

    public static ChartColor(color: string): any {
        Chart.defaults.global.defaultFontColor = color;
        Chart.defaults.global.tooltipFillColor = "rgba(0,0,0,0.8)";
        Chart.defaults.global.tooltipFillColor = color;

        GlobalEventsManager.onChartDefaultChangeEvent.emit(color);
    }

}

export enum ChartType {
    bar = 1,
    pie = 2,
    line = 3
}



