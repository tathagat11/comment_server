 function GetData() {

            var SelVal = $('#OptionSelect option:selected').val();
            var SelRoute = $('.RouteOption:checked').val();
            if (SelRoute == "Delivery") {

                switch (SelVal) {


                }
            } else if (SelRoute == "Sales") {
                switch (SelVal) {
   case "1":  var Data =[
    {
      "lat": 6.076116,
      "lng": 116.187184,
      "Cluster": 1,
      "Id": "TragadCPDDSE1-TragadCPDDSE1"
    },
    {
      "lat": 6.0938399,
      "lng": 116.1993818,
      "Cluster": 1,
      "Id": "TragadCPDDSE1-TragadCPDDSE1"
    },
    {
      "lat": 6.0772818,
      "lng": 116.1862622,
      "Cluster": 2,
      "Id": "TragadCPDDSE2-TragadCPDDSE2"
    },
    {
      "lat": 6.076277,
      "lng": 116.18697,
      "Cluster": 2,
      "Id": "TragadCPDDSE2-TragadCPDDSE2"
    }
  ];  break;  

                   
    }

            }

            return Data;
        }