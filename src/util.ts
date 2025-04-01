
export const serverUrl = "https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net";

export type TeamSearchRes = {
    data:{
        abbreviation:string;
        city:string;
        conference:string;
        division:string;
        full_name:string;
        id:number;
        name:string;
    }[];
};

async function searchTeams(){
    let res = await fetch(serverUrl+"/teams",{
        method:"GET"
    });

    if(res.ok){
        let data = await res.json() as TeamSearchRes;
        console.log(data);
    }
    else{
        alert("error code: "+res.status);
    }
}

export function wait(delay:number){
    return new Promise<void>(resolve=>{
        setTimeout(()=>{
            resolve();
        },delay);
    });
}