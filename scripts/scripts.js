// const fs = require('fs')

let cdpStartRow_address;
let cdpStartRow;
let cdpEndRow;
let barricadeStartRow_address;
let barricadeStartRow;
let barricadeEndRow;
let counter = 0;
let countDown = 0;
let asfTmpArray = [];
let asfCdpArray = [];
let asfBarricadeArray = [];
let arrestCdpArray = [];
let arrestBarricadeArray = [];
let arrestmentArray = [];
let headerArray = []
let headerCell = ""
let isHeaderFileLoaded = false;
let isAsfFileLoaded = false;
let isArrestLogFileLoaded = false;

function loadASF() {
 asfFileInput.change(function (e) {
  console.log("Loading ASF file...")
  var f = e.target.files[0];
  let correctAsfFiles = ["AircraftSettingsFile.csv", "AircraftSettingsFile.xlsx"]
  if (!f) {
   alert("Failed to load file")
  } else if (!correctAsfFiles.includes(f.name)) {
   alert(f.name + " is not a valid ASF file.")
  } else {
   asfFilename.html(f.name)
   getFirstLastRowsAsfFile(e);
   getCdpAircraftSettings(e);
   getBarricadeAircraftSettings(e)
   isAsfFileLoaded = true
  }
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
 }
}

function loadArrestmentFile() {
 arrestmentLogFileInput.change(function (e) {
  console.log("Load Arretment Log button is clicked...")

  let fileName = ""
  let files = arrestmentLogFileInput[0].files;
  let countDown = files.length;
  
  
  compareButton.html("Processing...")
  
  for (let i = 0; i < files.length; i++) {
   fileName += files[i].name + ", "
   if (i === files.length - 1) {
    fileName = fileName.replace(/,\s*$/, "")
   }
  }//end of FOR loop

  arrestmentLogFileTextarea.html(fileName)

  for (let i = 0; i < files.length; i++) {
  //  countDown = files.length;
  //  console.log('initial countdown counter ', countDown)
   let reader = new FileReader();
   reader.readAsArrayBuffer(e.target.files[i]);

   reader.onload = function (e) {
    let tmpArray = [];
    let data = new Uint8Array(reader.result);

    /* read the file */
    let wb = XLSX.read(data, {
     type: 'array'
    }); //parse the file

    let sheet = wb.Sheets[wb.SheetNames[0]]; //get the first worksheet

    let cell_range = XLSX.utils.decode_range("AA1:DG1") // get the desired range only

    // these two for loops are to get all cell values in the specified range and store them in an array 
    for (let R = cell_range.s.r; R <= cell_range.e.r; ++R) {
     for (let C = cell_range.s.c; C <= cell_range.e.c; ++C) {

      /* build the cell object */
      let cell_address = {
       c: C,
       r: R
      };

      /* if an A1-style address is needed, encode the address */
      let cell_ref = XLSX.utils.encode_cell(cell_address);
      let cell = sheet[cell_ref]

      if (cell && headerArray.includes(cell.v.toString().trim())) {
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
    if (tmpArray[0] === 0){
      arrestmentArray.unshift(tmpArray)
    }else if (tmpArray[0] === 1){
      arrestmentArray.push(tmpArray)
    }
    
    console.log('arrestmentArray length ', arrestmentArray.length)
    console.log('arrestmentArray ', arrestmentArray)
    
    countDown--;
    // compareButton.html(countDown)
    console.log('counting down counter ', countDown)
    
    if (countDown === 0) {
     compareButton.prop('disabled', false) // enable the compareBtn when parsing is completed
     compareButton.html("Compare")
     isArrestLogFileLoaded = true;
     console.log('isArrestLogFileLoaded ', isArrestLogFileLoaded)
    } 
   } //end of function reader.onload()
  }// end of files length FOR loop
 })
} //end of function loadArrestmentFile()

function compareItems() {
 console.log('inside compareItems function...')

 for (i = 0; i < arrestmentArray.length; i++) {
  if (arrestmentArray[i][0] === 0) {
   headerCell = "CDP"
   getComparisonResults(asfCdpArray, arrestmentArray, headerCell)
  } else if (arrestmentArray[i][0] === 1.0) {
    headerCell = "Bar"
   getComparisonResults(asfBarricadeArray, arrestmentArray, headerCell)
  }
 }
}

function getComparisonResults(asfArray, arrestmentArray, headerCell) {
 let arrestRow
 let arrestDataCell = "Arrest Data"
 let asfRow
 let asfDataCell = "ASF Data"
 let diffCell = "Difference"
 let diffRow
 let diff = 0

 createTable(headerArray, headerCell)

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

function createTable(arrHeader, headerCell) {
  let headerRow

  for (let i = 1; i < arrHeader.length; i++) {
   headerCell += "<td>" + arrHeader[i] + "</td>"
  };
  headerRow = "<tr><td>" + headerCell + "</td></tr>"
  $("table tbody").append(headerRow)
 }
 
function getASFColumnHeaders() {
 loadColumnHeaderFileButton.change(function (e) {

  var f = e.target.files[0];
  if (!f) {
   alert("Failed to load file")
  } else if (!f.type.match('text.*')) {
   alert(f.name + " is not a valid text file.")
  } else {
   let fileName = $('#inputColHeaderFile')[0].files[0].name
   columnHeaderFilename.html(fileName)
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
    isHeaderFileLoaded = true
   }
   r.readAsText(f);
  }
 })
}