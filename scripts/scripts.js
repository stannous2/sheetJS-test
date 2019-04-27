// const fs = require('fs')

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
let isCDP = true;
let asfTmpArray = [];
let asfCdpArray = [];
let asfBarricadeArray = [];
let arrestCdpArray = [];
let arrestBarricadeArray = [];
let tmpArray = [];
let arrestmentArray = [];
// let headerArray = ["recoveryType", "Aircraft Type", "xTrack", "Kic", "Kd", "Joff", "Aircraft Mass", "Aircraft Thrust", "Id", "kFactor", "Blanking Plate", "XF", "KicFactor", "KdFactor", "XfFactor", "velocityThreshold", "Shock Absorber", "Cable Span", "KalmanQ11", " KalmanQ22", " KalmanVelocityInit", " KalmanPositionOffset", " KalmanR50", " KalmanR100", " KalmanR150", " CsaExponent", " CsaTimeConstant", " CsaPayoutOffset", " InvOmegaFilterBandwidth", " InvObserverBandwidthGain", " InvObserverDampingGain", " OmegaNotchEnable", " SteeringGain", " CatchThreshold", " BoostEnable", " CatchP", " CatchI", " CatchErrorFilter", " TrackP", " TrackI", " TrackD", " TrackErrorFilter", " TrackLeadFilter", " InitAccelerationGain", " LoadingRate", " CsaVelocityGain", " DesiredAlphaGain", " DesiredAlphaFilter", " TwisterTorqueGain", " CableTensionGain", " MaxRunoutVelocity", " MinRunoutVelocity", " MinRunout", " PressureDetectionEnable", " PressureEnableSpeed", " PressureDisableSpeed", " KFactorGain", " KFactorThreshold", " PressurePowerGain", " PressurePowerThreshold", " PressureEdgeThreshold", " PressureEdgePower", " MaxDumpEnergyMotor", " MaxDumpEnergyBrake", " MaxEnergyXtrack", " MaxEnergyXf", " MinMotorEfficiency", " MaxMotorEfficiency", " OverrideThreshold", " BrakeModelDelay", " BrakeTorqueGain", " BrakePhaseIn", " TorqueThreshold", " PercentTorqueBrake", " SafetynetEnvelope", " SafetynetThreshold", " SafetynetP", " SafetynetI", " SafetynetD", " SafetynetFilter", " SafetynetLeadFilter", " MinDriftCounts", " MaxDriftCounts"]
let headerArray = []
let strTable = "";

function loadASF() {

  $('#input-ASF').change(function (e) {
    console.log("Getting data...")
    if (inputAsfButton.val()) {
      asfText.html(inputAsfButton.val().match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1])
    } else {
      asfText.html() = "No file chosen yet..."
    }

    getFirstLastRowsAsfFile(e);
    getCdpAircraftSettings(e);
    getBarricadeAircraftSettings(e)
  });
}

function getFirstLastRowsAsfFile(e) {

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

    for (let R = 1; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {

        /* find the cell object */
        let cell_address = {
          c: C,
          r: R
        };

        /* if an A1-style address is needed, encode the address */
        let cell_ref = XLSX.utils.encode_cell(cell_address);

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
          }
          if (cell.v === ("Barricade 3,4")) {

            //set starting row address for Barricade
            barricadeStartRow_address = {
              c: C,
              r: R + 1
            } // create a new cell_address obj for barricade

            barricadeStartRow = XLSX.utils.encode_cell(barricadeStartRow_address); // create new cell ref for Barricade start row
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
          (asfTmpArray).push(cell.v)
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
      asfCdpArray.push(asfTmpArray);
      asfTmpArray = [];
    }
    // console.log('asfCdpArray... ', asfCdpArray)
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

          (asfTmpArray).push(cell.v)
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

      asfBarricadeArray.push(asfTmpArray);
      asfTmpArray = [];
    }
    // console.log('asfBarricadeArray... ', asfBarricadeArray)
  }
}

function loadArrestmentFile() {
  inputLogFile.change(function (e) {
    console.log("Load Arretment Log button is clicked...")
    // console.log('header array dynamic ', headerArray)
    debugger
    var files = inputLogFile[0].files;
    for (let i = 0; i < files.length; i++) {
      $("#arrestLogFileName").append(files[i].name + ", ")

      if (inputLogFile.val()) {
        arrestlogText.html("")
        arrestlogText.append(files[i].name + ", ")
      }

      let reader = new FileReader();
      reader.readAsArrayBuffer(e.target.files[i]);

      reader.onload = function (e) {
        let data = new Uint8Array(reader.result);

        /* read the file */
        let wb = XLSX.read(data, {
          type: 'array'
        }); //parse the file

        let sheet = wb.Sheets[wb.SheetNames[0]]; //get the first worksheet

        let cell_range = XLSX.utils.decode_range("AA1:DG1") // get the desired range only
        debugger
        let tempHeaderArr = []
        // these two for loops are to get all cell values in the specified range and store them in an array 
        for (let R = cell_range.s.r; R <= cell_range.e.r; ++R) {
          for (let C = cell_range.s.c; C <= cell_range.e.c; ++C) {

            /* build the cell object */
            let cell_address = {
              c: C,
              r: R
            };

            let value 
            /* if an A1-style address is needed, encode the address */
            let cell_ref = XLSX.utils.encode_cell(cell_address);
            let cell = sheet[cell_ref]

            value = cell.v.toString().trim()
            // tempHeaderArr.push(cell.v)
            // tempHeaderArr = tempHeaderArr.map(function (ele) {
            //   return ele.trim()
            // })
            // console.log ('tempHeaderArr ', tempHeaderArr)
            // console.log ('value ', value)



            if (cell && headerArray.includes(value)) {
              let headerValue_address = {
                c: C,
                r: R + 1
              }
              
              let headerValue = XLSX.utils.encode_cell(headerValue_address)
              let cellValue = sheet[headerValue]
              tmpArray.push(cellValue.v)
              
            }
          } // end of for loop
        } // end of for loop

        arrestmentArray.push(tmpArray)
        tmpArray = []
        console.log('arrestment array... ', arrestmentArray)
        // console.log('CDP arrest mode? ', isCDP)
        debugger
        if (i === files.length - 1) {
          $('#compareButton').prop('disabled', false) // enable the compareBtn when parsing is completed
        }
      } //end of function reader.onload()

    }
  });
} //end of function loadArrestmentFile()

function compareItems() {
  console.log('inside compareObj function...')

  debugger

  for (i = 0; i < arrestmentArray.length; i++) {
    if (arrestmentArray[i][0] === 0) {
      console.log('it is cdp arrestment... ')
      getComparisonResults(asfCdpArray, arrestmentArray)
    } else if (arrestmentArray[i][0] === 1) {
      getComparisonResults(asfBarricadeArray, arrestmentArray)
    }
  }
}

function getComparisonResults(asfArray, arrestmentArray) {
  let arrestRow
  let arrestDataCell = "Arrest Data"
  let asfRow
  let asfDataCell = "ASF Data"
  let diffCell = "Difference"
  let diffRow
  let diff = 0
  createTable(headerArray)
  for (j = 0; j < asfArray.length; j++) {
    if (arrestmentArray[i][1] === asfArray[j][0]) {
      for (k = 0; k < asfArray[j].length; k++) {
        asfDataCell += "<td>" + asfArray[j][k].toFixed(1) + "</td>"
        arrestDataCell += "<td>" + arrestmentArray[i][k + 1].toFixed(1) + "</td>"

        diff = Math.abs((asfArray[j][k] - arrestmentArray[i][k + 1]).toFixed(1));

        if (diff > 0.2) {
          diffCell += "<td bgcolor=yellow>" + diff + "</td>"
        } else {
          diffCell += "<td bgcolor=green>" + diff + "</td>"
        }
      }
      asfRow = "<tr><td>" + asfDataCell + "</td></tr>"
      $("table tbody").append(asfRow)

      arrestRow = "<tr><td>" + arrestDataCell + "</td></tr>"
      $("table tbody").append(arrestRow)

      diffRow = "<tr><td>" + diffCell + "</td></tr>"
      $("table tbody").append(diffRow)
    }
  }
  $("table tbody").append("<tr height=50px></tr>")
}

function createTable(arrHeader) {
  let headerCell = ""
  let headerRow
  for (let i = 1; i < arrHeader.length; i++) {
    headerCell += "<td>" + arrHeader[i] + "</td>"
  };
  headerRow = "<tr><td>" + headerCell + "</td></tr>"
  $("table tbody").append(headerRow)
}

function getASFColumnHeaders() {
 inputColumnHeaderFile.change(function (e) {

  var f = e.target.files[0];
  if (!f) {
   alert("Failed to load file")
  } else if (!f.type.match('text.*')) {
   alert(f.name + " is not a valid text file.")
  } else {
   let r = new FileReader();
   r.onload = function (e) {
    let contents = e.target.result;

    headerArray = contents.toString().replace(/\s+/g, ' ').split(",")
    headerArray = headerArray.map(function (el) {
      return el.trim();
    });
    
    let forDeletion = ["Min Runout", "Maximum Runout", "Cross Wind Limit", "Aircraft Name"]
    headerArray = headerArray.filter(item => !forDeletion.includes(item))
    headerArray.unshift("recoveryType")

    console.log('trimmed array ', headerArray)
   }
   r.readAsText(f);

  }
 })
}