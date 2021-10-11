function ParseJson(results){
    var Data = {};
    var data = results.data;
    if(data.length > 0){
        if(ValidJson(data[0])){
            for(i=0;i<data.length;i++){
                var DSE = data["New DSE"];
                var WEEK = data["Weekday Route"];
                if(typeof(Data[DSE]) == undefined)
                    Data[DSE] = [];
                
                
            }
        }
    }
    return Data;
}

function ValidJson(JsonData){

    if(JsonData.hasOwnProperty("Weekday Route") && JsonData.hasOwnProperty("New DSE") && JsonData.hasOwnProperty("New DSE") && JsonData.hasOwnProperty("New DSE")){
        return true;
    }

    return false;
}