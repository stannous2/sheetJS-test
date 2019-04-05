let arr1 = [];
let arr2 = [];
let array = [];
let cdpStartRow_address;
let cdpStartRow;
let cdpEndRow;
let barricadeStartRow_address;
let barricadeStartRow;
let barricadeEndRow;
let counter = 0;
let isCDP;
let nestedArray = [];
let cdpArray = [];
let barricadeArray = [];
let arrestLogArray = []
let headerArray = ["recoveryType", "Aircraft Type", "xTrack", "Kic", "Kd", "Joff", "Aircraft Mass", "Aircraft Thrust", "Id", "kFactor", "Blanking Plate", "XF", "KicFactor", "KdFactor", "XfFactor", "velocityThreshold", "Shock Absorber", "Cable Span", "KalmanQ11", " KalmanQ22", " KalmanVelocityInit", " KalmanPositionOffset", " KalmanR50", " KalmanR100", " KalmanR150", " CsaExponent", " CsaTimeConstant", " CsaPayoutOffset", " InvOmegaFilterBandwidth", " InvObserverBandwidthGain", " InvObserverDampingGain", " OmegaNotchEnable", " SteeringGain", " CatchThreshold", " BoostEnable", " CatchP", " CatchI", " CatchErrorFilter", " TrackP", " TrackI", " TrackD", " TrackErrorFilter", " TrackLeadFilter", " InitAccelerationGain", " LoadingRate", " CsaVelocityGain", " DesiredAlphaGain", " DesiredAlphaFilter", " TwisterTorqueGain", " CableTensionGain", " MaxRunoutVelocity", " MinRunoutVelocity", " MinRunout", " PressureDetectionEnable", " PressureEnableSpeed", " PressureDisableSpeed", " KFactorGain", " KFactorThreshold", " PressurePowerGain", " PressurePowerThreshold", " PressureEdgeThreshold", " PressureEdgePower", " MaxDumpEnergyMotor", " MaxDumpEnergyBrake", " MaxEnergyXtrack", " MaxEnergyXf", " MinMotorEfficiency", " MaxMotorEfficiency", " OverrideThreshold", " BrakeModelDelay", " BrakeTorqueGain", " BrakePhaseIn", " TorqueThreshold", " PercentTorqueBrake", " SafetynetEnvelope", " SafetynetThreshold", " SafetynetP", " SafetynetI", " SafetynetD", " SafetynetFilter", " SafetynetLeadFilter", " MinDriftCounts", " MaxDriftCounts"]
let strTable = "";

function loadASF() {

  $('#input-ASF').change(function (e) {
    console.log("Getting data...")
    if (inputAsfButton.val()) {
      asfText.html(inputAsfButton.val().match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1])
    } else {
      asfText.html() = "No file chosen yet..."
    }

    getFirstLastRows(e);
    createTable(headerArray)
    getCdpAircraftSettings(e);
    getBarricadeAircraftSettings(e)
   });
  }
 


function getFirstLastRows(e) {

  let reader = new FileReader();
  reader.readAsArrayBuffer(e.target.files[0]);

  reader.onload = function (e) {
    let data = new Uint8Array(reader.result);

    /* read the file */
    let wb = XLSX.read(data, {
      type: 'array'
    }); //parse the file

    let sheet = wb.Sheets[wb.SheetNames[0]]; //get the first worksheet

    /* loop through every cell in the worksheet manually */
    // let range = XLSX.utils.decode_range(sheet['!ref']); //get the range

    let range = XLSX.utils.decode_range("A2:A30"); //get range of first 30 rows of column A

    // console.log('the whole range... ', range)

    for (let R = 1; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {

        /* find the cell object */
        let cell_address = {
          c: C,
          r: R
        };

        /* if an A1-style address is needed, encode the address */
        let cell_ref = XLSX.utils.encode_cell(cell_address);
        // console.log('cell_ref: ', cell_ref)

        let cell = sheet[cell_ref]

        //get the cell ref where its value is 'CDP 1,2,3,4'
        if (cell) {
          if (cell.v === ("CDP 1,2,3,4")) {

            // set the starting row address of CDP
            cdpStartRow_address = {
              c: C,
              r: R + 1
            }

            cdpStartRow = XLSX.utils.encode_cell(cdpStartRow_address); // create new cell ref for CDP start row

            // console.log("cdp start row: ", cdpStartRow)

          }
          if (cell.v === ("Barricade 3,4")) {

            //set starting row address for Barricade
            barricadeStartRow_address = {
              c: C,
              r: R + 1
            } // create a new cell_address obj for barricade

            barricadeStartRow = XLSX.utils.encode_cell(barricadeStartRow_address); // create new cell ref for Barricade start row
            // console.log("barricade start row: ", barricadeStartRow)
          }

        }
        if (!cell) {
          if (counter === 1) {
            // create a new cdpEndRow_address obj
            let cdpEndRow_address = {
              c: C,
              r: R - 1
            }
            cdpEndRow = XLSX.utils.encode_cell(cdpEndRow_address);
          } else if (counter === 2) {
            // create the barricadeEndRow_address obj
            barricadeEndRow_address = {
              c: C,
              r: R - 1
            }
            barricadeEndRow = XLSX.utils.encode_cell(barricadeEndRow_address)
            //set the range to the last row
            range.e.r = barricadeEndRow_address.r
          }
          counter++
        }
      }
    }

    console.log('cdpStartRow ', cdpStartRow)
    console.log('cdpEndRow ', cdpEndRow)

    console.log('barricadeStartRow ', barricadeStartRow)
    console.log('barricadeEndRow ', barricadeEndRow)
  }
}

function getCdpAircraftSettings(e) {
  let reader = new FileReader();
  reader.readAsArrayBuffer(e.target.files[0]);

  reader.onload = function (e) {
    let data = new Uint8Array(reader.result);

    /* read the file */
    let wb = XLSX.read(data, {
      type: 'array'
    }); //parse the file

    let sheet = wb.Sheets[wb.SheetNames[0]]; //get the first worksheet

    cdp_range = cdpStartRow + ":CN13"
    // console.log('cdp_range ', cdp_range)
    let range = XLSX.utils.decode_range(cdp_range); //get all columns of row 13

    for (let R = cdpStartRow_address.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {

        /* find the cell object */
        let cell_address = {
          c: C,
          r: R
        };

        /* if an A1-style address is needed, encode the address */
        let cell_ref = XLSX.utils.encode_cell(cell_address);
        let cell = sheet[cell_ref]

        // if (cell && cell.v !== 250 && cell.v !== 375 && cell.v !== 7) {
        if (cell && cell_address.c !== 1 && cell_address.c !== 11 && cell_address.c !== 13 && cell_address.c !== 20) {
          (nestedArray).push(cell.v)
        } else if (!cell) {
          // create a new cdpEndRow_address obj
          let cdpEndCell_address = {
            c: C - 1,
            r: R
          }
          cdpEndCell = XLSX.utils.encode_cell(cdpEndCell_address);
          range.e.c = cdpEndCell_address.c;
        }
      }
      cdpArray.push(nestedArray);
      nestedArray = [];
    }
    console.log('cdpArray... ', cdpArray)
  }
}

function getBarricadeAircraftSettings(e) {
  let reader = new FileReader();
  reader.readAsArrayBuffer(e.target.files[0]);

  reader.onload = function (e) {
    let data = new Uint8Array(reader.result);

    /* read the file */
    let wb = XLSX.read(data, {
      type: 'array'
    }); //parse the file

    let sheet = wb.Sheets[wb.SheetNames[0]]; //get the first worksheet

    barricade_range = barricadeStartRow + ":CN" + (barricadeEndRow_address.r + 1);
    let range = XLSX.utils.decode_range(barricade_range); //get all columns of row 13

    for (let R = barricadeStartRow_address.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {

        /* find the cell object */
        let cell_address = {
          c: C,
          r: R
        };

        /* if an A1-style address is needed, encode the address */
        let cell_ref = XLSX.utils.encode_cell(cell_address);

        let cell = sheet[cell_ref]

        if (cell && cell_address.c !== 1 && cell_address.c !== 11 && cell_address.c !== 13 && cell_address.c !== 20) {

          (nestedArray).push(cell.v)
        } else if (!cell) {
          // create a new cdpEndRow_address obj
          let barricadeEndCell_address = {
            c: C - 1,
            r: R
          }
          cdpEndCell = XLSX.utils.encode_cell(barricadeEndCell_address);
          range.e.c = barricadeEndCell_address.c;
        }
      }

      barricadeArray.push(nestedArray);
      nestedArray = [];
    }
    console.log('barricadeArray... ', barricadeArray)
  }
}

function loadArrestmentFile() {
 $('#input-arrestLog').change(function (e) {
  console.log("Load Arretment Log button is clicked...")
  
    if (inputLogButton.val()) {
      arrestlogText.html(inputLogButton.val().match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1])
    } else {
      arrestlogText.html() = "No file chosen yet..."
    }

    let reader = new FileReader();
    reader.readAsArrayBuffer(e.target.files[0]);

    reader.onload = function (e) {
      let data = new Uint8Array(reader.result);

      /* read the file */
      let wb = XLSX.read(data, {
        type: 'array'
      }); //parse the file

      let sheet = wb.Sheets[wb.SheetNames[0]]; //get the first worksheet
      
      // let desired_range = "A1:DZ1" // define desired range

      let cell_range = XLSX.utils.decode_range("A1:DZ1") // get the desired range only
      // console.log("specific_range: ", cell_range)

      for (let R = cell_range.s.r; R <= cell_range.e.r; ++R) {
        for (let C = cell_range.s.c; C <= cell_range.e.c; ++C) {

          /* build the cell object */
          let cell_address = {
            c: C,
            r: R
          };

          /* if an A1-style address is needed, encode the address */
          let cell_ref = XLSX.utils.encode_cell(cell_address);
          // console.log('cell_ref before adding 1', cell_ref)

          let cell = sheet[cell_ref]

          if (cell && headerArray.includes(cell.v)) {
            // console.log('cell value.. ', cell.v)
            let headerValue_address = {
              c: C,
              r: R + 1
            }

            let headerValue = XLSX.utils.encode_cell(headerValue_address)
            // console.log('headerValue ', headerValue)

            let cellValue = sheet[headerValue]
            arrestLogArray.push(cellValue.v)
            // console.log('cellValue ', cellValue.v)

          } else if (!cell) {
            // console.log('empty cell...')
          }
        }
      }
       console.log('Arrest Log array ', arrestLogArray)
      //  console.log('aircraft type: ', arrestLogArray[1])
      //  console.log('isCDP prior...', isCDP)

      if (arrestLogArray[0] === 0) {
        isCDP = true;
      } else if (arrestLogArray[0] === 1) {
        isCDP = false;
      }
      console.log('arrest mode ', isCDP)
    }
  });
}

function compareItems() {
  console.log('inside compareObj function...')
  
  let asfArray = [];
  let aircraftType = arrestLogArray[1];
  let arrestRow
  let arrestDataCell = "Arrest Data"
  let asfRow
  let asfDataCell  = "ASF Data"
  
  // if (isCDP) {
  //   for (let i = 0; i < cdpArray.length; i++) {
  //     if (cdpArray[i][0] === aircraftType) {
  //       asfArray = cdpArray[i];
  //     }
  //   }
  // } else {
  //   for (let i = 0; i < barricadeArray.length; i++) {
  //     if (barricadeArray[i][0] === aircraftType) {
  //       asfArray = barricadeArray[i];
  //     }
  //   }
  // }

  if (isCDP) {
   for (let i = 0; i < cdpArray.length; i++) {
     if (cdpArray[i][0] === aircraftType) {
       asfArray = cdpArray[i];
     } else if (barricadeArray[i][0] === aircraftType) {
       asfArray = barricadeArray[i];
     }
   }
 }
 debugger
 for (i = 0; i < asfArray.length; i++){
  asfDataCell += "<td>" + asfArray[i] + "</td>"
 }
  asfRow =  "<tr><td>" + asfDataCell + "</td></tr>"
  $("table tbody").append(asfRow)

  for (let i = 1; i < arrestLogArray.length; i++) {
   arrestDataCell += "<td>" + arrestLogArray[i] + "</td>"
    if (asfArray[i] === arrestLogArray[i]) {
      let diff = asfArray[i] - arrestLogArray[i];      
      console.log(asfArray[i] + " - " + arrestLogArray[i] + ' = ' + diff);
      
    } else {
      let diff = asfArray[i] - arrestLogArray[i];
      console.log(asfArray[i] + " - " + arrestLogArray[i] + ' = ' + diff);
    }
   }
   debugger
   arrestRow = "<tr><td>" + arrestDataCell + "</td></tr>"
   $("table tbody").append(arrestRow)
  
}

function createTable(arrHeader){
 let headerCell = ""
 let headerRow 
 for(let i = 1; i < arrHeader.length; i++) {
 headerCell += "<td>" + arrHeader[i] + "</td>"
 };
 headerRow = "<tr><td>" + headerCell + "</td></tr>"
 $("table tbody").append(headerRow)
}
