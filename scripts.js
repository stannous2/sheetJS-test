let arr1 = [];
let arr2 = [];
let array;




function loadASF() {

 $('#input-ASF').change(function (e) {
  console.log("Getting data...")
  if(inputAsfButton.val()){
   asfText.html(inputAsfButton.val().match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1])
  }else {
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
   let range = XLSX.utils.decode_range(sheet['!ref']); //get the range

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
  if(inputLogButton.val()){
   arrestlogText.html(inputLogButton.val().match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1])
  }else {
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