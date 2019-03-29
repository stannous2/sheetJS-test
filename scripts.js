let arr1 = [];
let arr2 = [];
let array = [];
let cdpStartRow;
let cdpEndRow;
let barricadeStartRow;
let barricadeEndRow;
let counter = 0;

function loadASF() {

 $('#input-ASF').change(function (e) {
  console.log("Getting data...")
  if (inputAsfButton.val()) {
   asfText.html(inputAsfButton.val().match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1])
  } else {
   asfText.html() = "No file chosen yet..."
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

   /* loop through every cell in the worksheet manually */
   // let range = XLSX.utils.decode_range(sheet['!ref']); //get the range
   // let smallerRange = "A2:DE40"
   let range = XLSX.utils.decode_range("A2:A30");

   console.log('the whole range... ', range)

   for (let R = 1; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {

     /* find the cell object */
     let cell_address = {
      c: C,
      r: R
     };

     /* if an A1-style address is needed, encode the address */
     let cell_ref = XLSX.utils.encode_cell(cell_address);
     console.log('cell_ref: ', cell_ref)

     let cell = sheet[cell_ref]

     //get the cell ref where its value contains 'CDP 1,2,3,4'
     if (cell) {
      if (cell.v === ("CDP 1,2,3,4")) {
       console.log('cell ref ', C, R)
       let cdpStartRow_address = {
        c: C,
        r: R + 1
       } // create a new cell_address obj
       console.log('cdpStartRow_address', cdpStartRow_address)
       cdpStartRow = XLSX.utils.encode_cell(cdpStartRow_address); // create new cell ref for CDP start row

       console.log("cdp start row: ", cdpStartRow)

      }
      
      
      if (cell.v === ("Barricade 3,4")) {
       console.log('cell ref ', C, R)
       let cdpEndRow_cell_address = {
        c: C,
        r: R - 1
       } // create a new cell_address obj
       console.log('cdpEndRow_cell_address', cdpEndRow_cell_address)
       cdpEndRow = XLSX.utils.encode_cell(cdpEndRow_cell_address); // create new cell ref for CDP start row

       console.log("cdp end row: ", cdpEndRow)

       let barricadeStartRow_address = {
        c: C,
        r: R + 1
       } // create a new cell_address obj for barricade
       console.log('barricadeStartRow_address for ', barricadeStartRow_address)
       barricadeStartRow = XLSX.utils.encode_cell(barricadeStartRow_address); // create new cell ref for CDP start row
       console.log("barricade start row: ", barricadeStartRow)
      }

     }
     debugger
      if(typeof cell === "undefined"){
       console.log('cell ref for empty row... ', C, R)
       
       if (counter === 1){
        let cdpEndRow_address = {
         c: C,
         r: R - 1
        } // create a new cell_address obj
        console.log('cdpEndRow_address ', cdpEndRow_address)
       } else if(counter === 2){
        let barricadeEndRow_address = {
         c: C,
         r: R - 1
        } // create a new cell_address obj
        console.log('barricadeEndRow_address ', barricadeEndRow_address)
        range.e.r = barricadeEndRow_address.r
       }
       counter++
      }
     }
   }

   console.log("entire worksheet: ", array)

   let desired_range = "E2:CA2" // define desired range
   let cell_range = XLSX.utils.decode_range(desired_range) // get the desired range only
   console.log("specific_range: ", cell_range)


   for (let R = cell_range.s.r; R <= cell_range.e.r; ++R) {
    for (let C = cell_range.s.c; C <= cell_range.e.c; ++C) {

     /* find the cell object */
     let cell_address = {
      c: C,
      r: R
     };

     /* if an A1-style address is needed, encode the address */
     let cell_ref = XLSX.utils.encode_cell(cell_address);

     let cell = sheet[cell_ref]
     arr1.push(cell.v)

    }
   }
   console.log("array 1: ", arr1)
  }
 });
}

function loadArrestmentFile() {

 $('#input-arrestLog').change(function (e) {
  console.log("Getting data...")
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

   /* loop through every cell in the worksheet manually */
   //  let range = XLSX.utils.decode_range(sheet['!ref']); //get the range

   let desired_range = "E2:CA2" // define desired range
   let cell_range = XLSX.utils.decode_range(desired_range) // get the desired range only
   console.log("specific_range: ", cell_range)


   for (let R = cell_range.s.r; R <= cell_range.e.r; ++R) {
    for (let C = cell_range.s.c; C <= cell_range.e.c; ++C) {

     /* find the cell object */
     let cell_address = {
      c: C,
      r: R
     };

     /* if an A1-style address is needed, encode the address */
     let cell_ref = XLSX.utils.encode_cell(cell_address);

     let cell = sheet[cell_ref]
     arr2.push(cell.v)
    }
   }
   console.log("array 2: ", arr2)
  }
 });
}

function compareItems(arr1, arr2) {
 console.log('inside compareObj function...')
 // debugger
 arr1.forEach(function (item, index) {
  if (arr1[index] === arr2[index]) {
   console.log(arr1[index] + ", " + arr2[index]);
   console.log('it is matched!!!');
  } else {
   console.log(arr1[index] + ", " + arr2[index]);
   console.log('its not matched!!');
  }
 })
}