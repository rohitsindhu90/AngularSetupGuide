
export class ClientTransactionSummaryGridModel {

    totalorders: number;
    totalchanges: number;
    totalcarerequests: number;
    totalrequests: number;
}



export class ClientTransactionDetailGridModel {

     companyname: string;
     newconnectionorderrequest: number;
     hardwareorderrequest: number;
     changerequest: number;
     carerequest: number;
}


export class ClientTransactionModel{

    clienttrasacntionsummaryviewmodel: ClientTransactionSummaryGridModel[];
    clienttrasacntiondetailviewmodel: ClientTransactionDetailGridModel[];
}