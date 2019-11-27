// let globalize = require("globalize");

// export class Globalize {

//     static dateParser(dateString: string): Date {
//         return globalize.dateParser()(dateString);
//     }


//     /*    options
//      { skeleton: "GyMMMd" })
//     "Nov 30, 2010 AD"
    
//     { date: "medium" }
//     "Nov 1, 2010"
    
//     { time: "medium" })
//     "5:55:00 PM"
    
//     { datetime: "medium" })
//     "Nov 1, 2010, 5:55:00 PM"
//         */
//     static dateFormatter(dateInput: Date, options?: any): string {
//         return globalize.dateFormatter(options)(dateInput);
//     }

//     static currencyFormat(numberInput: number) {
//         return globalize.currencyFormatter('GBP')(numberInput);
//     }
// }