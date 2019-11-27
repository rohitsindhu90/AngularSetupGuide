export class SessionStroageProvider{
    private static storagename: string = "DNSName";

    public static setDNSSessionStorage(dns: string) {
        sessionStorage.setItem(this.storagename, dns);
    }

    public static getDNSSessionStorage(): any {
        return sessionStorage.getItem(this.storagename);
    }
    
    public static clearSessionStorage() {
        sessionStorage.removeItem(this.storagename);
    }
}