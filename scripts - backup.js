var cell1, cell2;
var cell_addresses = ['A1', 'A2']
var objArray1 = [];
var objArray2 = [];
let array;

// $('#input-excel').change(function(e) {
//     var reader = new FileReader();
//     reader.readAsArrayBuffer(e.target.files[0]);

//     reader.onload = function(e) {
//         var data = new Uint8Array(reader.result);

//         /* read the file */
//         var wb = XLSX.read(data, {
//             type: 'array'
//         }); //parse the file
//         var sheet = wb.Sheets[wb.SheetNames[0]]; //get the first worksheet
//         console.log('sheet', sheet)
//             // cell1 = sheet['A1', 'A2'];
//             // console.log("A1 value: ", cell1.v)

//         /* loop through every cell manually */
//         var range = XLSX.utils.decode_range(sheet['!ref']); //get the range
//         for (var R = range.s.r; R <= range.e.r; ++R) {
//             for (var C = range.s.c; C <= range.e.c; ++C) {

//                 /* find the cell object */
//                 // console.log('Row : ' + R);
//                 // console.log('Column : ' + C);
//                 var cell_address = {
//                     c: C,
//                     r: R
//                 };

//                 /* if an A1-style address is needed, encode the address */
//                 var cell_ref = XLSX.utils.encode_cell(cell_address);
//                 var cell_value = sheet[cell_ref]

//                 // console.log("cell_ref", cell_ref) // i.e. cell A1 or B3
//                 // console.log("cell_value", cell_value.v)// i.e. cell value

//                 objArray1.push(cell_value.v)
//             }
//         }
//         console.log(objArray1)
//     }
// });

// $('#input-excel1').change(function(e) {
//     var reader = new FileReader();
//     reader.readAsArrayBuffer(e.target.files[0]);


//     reader.onload = function(e) {
//         var data = new Uint8Array(reader.result);

//         /* read the file */
//         var wb = XLSX.read(data, {
//             type: 'array'
//         }); //parse the file
//         var sheet = wb.Sheets[wb.SheetNames[0]]; //get the first worksheet
//         console.log('sheet', sheet)

//         // cell2 = sheet['A1', 'A2'];
//         // console.log("A1 value: ", cell2.v)

//         /* loop through every cell manually */
//         var range = XLSX.utils.decode_range(sheet['!ref']); //get the range
//         for (var R = range.s.r; R <= range.e.r; ++R) {
//             for (var C = range.s.c; C <= range.e.c; ++C) {

//                 /* find the cell object */
//                 // console.log('Row : ' + R);
//                 // console.log('Column : ' + C);
//                 var cell_address = {
//                     c: C,
//                     r: R
//                 };

//                 /* if an A1-style address is needed, encode the address */
//                 var cell_ref = XLSX.utils.encode_cell(cell_address);
//                 var cell_value = sheet[cell_ref]

//                 // console.log("cell_ref", cell_ref) // i.e. cell A1 or B3
//                 // console.log("cell_value", cell_value.v)// i.e. cell value

//                 objArray2.push(cell_value.v)
//             }
//         }
//         console.log(objArray2)
//     }
// });

function readExcelFile(id) {
    
    $(id).change(function(e) {
        var reader = new FileReader();
        reader.readAsArrayBuffer(e.target.files[0]);


        reader.onload = function(e) {
            var data = new Uint8Array(reader.result);

            /* read the file */
            var wb = XLSX.read(data, {
                type: 'array'
            }); //parse the file
            var sheet = wb.Sheets[wb.SheetNames[0]]; //get the first worksheet
            console.log('sheet', sheet)

            // cell2 = sheet['A1', 'A2'];
            // console.log("A1 value: ", cell2.v)

            /* loop through every cell manually */
            var range = XLSX.utils.decode_range(sheet['!ref']); //get the range
            for (var R = range.s.r; R <= range.e.r; ++R) {
                for (var C = range.s.c; C <= range.e.c; ++C) {

                    /* find the cell object */
                    // console.log('Row : ' + R);
                    // console.log('Column : ' + C);
                    var cell_address = {
                        c: C,
                        r: R
                    };

                    /* if an A1-style address is needed, encode the address */
                    var cell_ref = XLSX.utils.encode_cell(cell_address);
                    var cell_value = sheet[cell_ref]

                    // console.log("cell_ref", cell_ref) // i.e. cell A1 or B3
                    // console.log("cell_value", cell_value.v)// i.e. cell value

                    console.log("incoming id: ", id)
                    // debugger
                    if (id == "#input-excel1"){
                        objArray1.push(cell_value.v);
                        array = objArray1;
                    } else {
                        objArray2.push(cell_value.v);
                        array = objArray2;
                    }
                }
            }
            console.log(array);
        }
    });
}

$('#compareButton').on('click', function() {
    compareItems(objArray1, objArray2)
})


function compareItems(arr1, arr2) {
    console.log('inside compareObj function...')
        // debugger
    arr1.forEach(function(item, index) {
        if (arr1[index] === arr2[index]) {
            console.log(arr1[index] + ", " + arr2[index]);
            console.log('it is matched!!!');
        } else {
            console.log(arr1[index] + ", " + arr2[index]);
            console.log('its not matched!!');
        }
    })
}