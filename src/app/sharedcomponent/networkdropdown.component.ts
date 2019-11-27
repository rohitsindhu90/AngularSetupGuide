import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NetworkService } from '../_services/network.service';
import { Network } from '../_models/network';

@Component({
    selector: 'network-dropdown',
    templateUrl: './networkdropdown.component.html'
})


export class NetworkDropdown implements OnInit {

    /* Networks */
    networkArray: any[];
    networkguid: string;
    @Output() onChangeNetworkEvent: EventEmitter<any> = new EventEmitter<any>();
    
    constructor(private networkService: NetworkService) {
    }

    ngOnInit() {
        this.loadNetwork();
    }

    loadNetwork(): Promise<any> {        

        return this.networkService.getNetworkList().then((data) => {
            this.clearNetworks();
            if (data != null) {
                this.networkArray.push({ label: 'ALL', value: null });
                data.forEach(item => this.networkArray.push({
                    label: item.networkdescription, value: item.networkguid, id: item.id
                }));
            }
        });
    }

    clearNetworks() {
        this.networkArray = [];
        this.networkguid = null;
    }

    OnNetworkChange() {
        var selectedNetwork: Network = new Network();
        selectedNetwork.networkguid = this.networkguid;
        selectedNetwork.id = this.networkArray && this.networkArray.length > 0 ? this.networkArray.filter(x => x.value == (this.networkguid || null))[0].id : null;
        selectedNetwork.networkdescription = this.networkArray && this.networkArray.length > 0 ? this.networkArray.filter(x => x.value == (this.networkguid || null))[0].label : null;

        this.onChangeNetworkEvent.emit(selectedNetwork);     
    }
}