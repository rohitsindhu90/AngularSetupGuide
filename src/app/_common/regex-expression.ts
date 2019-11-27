export class RegexExpression {
    //number with single . and max 5 decimal places 
    // Can be used for Validation 
    // Can't use with key events
    static decimal: RegExp = /^[0-9]+(\.[0-9]{1,2})?$/;
    static mobilenumber: RegExp = /^(07)[0-9]{9}$/;
    static simnumber: RegExp = /^(89441)[0-9]{14,15}$/;
    static multipleEmailAddress: RegExp = /^(([a-zA-Z0-9_\-\.\']+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,6}|[0-9]{1,3})(\]?)(\s*;\s*|\s*$))*$/;
    // static numeric: RegExp = /^[0-9]{1,25}$/;
    static PACNumber: RegExp = /^[a-zA-Z]{3}[0-9]{6}$/;
    static mobilenumberWithZero: RegExp = /^(0)[0-9]{10}$/;
    static recipientnumber: RegExp = /^[0-9]{1,25}$/;

    static numberWithZero15Digit: RegExp = /^(0)[0-9]{14}$/;
    static numberWith15Digit: RegExp = /^[0-9]+$/;
    static timeFormat: RegExp = /^(\d{ 1, 2 }): (\d{ 2 }) (?:: (\d{ 2 }))?$/;
    static onlyNumber: RegExp = /^\d+$/;
    static dateRegex: RegExp = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
    static dnsName: RegExp = /^[a-zA-Z0-9]+$/;
    static simnumberCTNUpdate: RegExp = /^\d+$/;
    static emailRegex: RegExp = /^[\w._-]+[+]?[\w\'._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    static password8CharRegex = /^(?=.*[A-Z])(?=.*?[0-9]).{8,}/;
   // static password14CharRegex = /^(?=.*[A-Z])(?=.*?[0-9])(?=.*[@#$%^&+=]).{14,}/;
   static password14CharRegex = /^(?=.*[A-Z])(?=.*?[0-9])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).{14,}/;
   
}
