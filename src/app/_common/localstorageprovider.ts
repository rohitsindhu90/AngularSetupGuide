import { UserDetail } from '../_models/user-detail';

export class LocalStorageProvider {
    public static mostdialllocalstoragename: string = "mostDialled";
    public static premiumlocalstoragename: string = "premiumReport";
    public static chargereportstoragename: string = "chargereport";
    public static euroworldlocalstoragename: string = "euroworld";
    public static dasbhboardstoragename: string = "dashboard";



    public static setLabelStorage(localstoragename: any, descriptiondata: any[]) {
        localStorage.setItem(localstoragename, JSON.stringify(descriptiondata));
    }


    public static removePremiumWithMostDialledLabelStorage() {
        localStorage.removeItem(this.mostdialllocalstoragename);
        localStorage.removeItem(this.premiumlocalstoragename);
        localStorage.removeItem(this.dasbhboardstoragename);

    }

    public static removeEuroWorldLabelStorage() {
        localStorage.removeItem(this.euroworldlocalstoragename);
    }

}