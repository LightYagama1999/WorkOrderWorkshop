function doPost(e) {
  try {
    var data = e.parameter.fileContent;
    var filename = e.parameter.filename;
    var data2 = e.parameter.fileContent2;
    var filename2 = e.parameter.filename2;
    var data3 = e.parameter.fileContent3;
    var filename3 = e.parameter.filename3;
    var data4 = e.parameter.fileContent4;
    var filename4 = e.parameter.filename4;
    var email = e.parameter.email;
    var nama = e.parameter.nama;
    var result = uploadFileToGoogleDrive(
      data,
      filename,
      data2,
      filename2,
      data3,
      filename3,
      data4,
      filename4,
      nama,
      email,
      e
    );

    return ContentService.createTextOutput(
      JSON.stringify({
        "Laporan Kerja Telah Terkirim": "Terima Kasih",
        data: {
          file1: result.fileUrl1,
          file2: result.fileUrl2,
          file3: result.fileUrl3,
          file4: result.fileUrl4,
        },
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // kembali ke sini jika error
    Logger.log(error);
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", error: error })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// new property service GLOBAL
var SCRIPT_PROP = PropertiesService.getScriptProperties();

// see: https://developers.google.com/apps-script/reference/properties/

/**
 * pilih sheet
 */
function setup() {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  SCRIPT_PROP.setProperty("myScriptKey", doc.getId());
}

/**
 * record_data adalah insert data yang diterima dari submisi HTML form
 * e adalah data yang diterima dari POST
 * fileUrl1 dan fileUrl2 adalah URL dari file yang diunggah ke Google Drive
 */
function record_data(e, fileUrl1, fileUrl2, fileUrl3, fileUrl4) {
  try {
    var doc = SpreadsheetApp.openById(
      "1b0mWDp0RjG0NBFoXaDoGe1zMM4YEwX6EgB6-SmcvJaw"
    );
    var sheet = doc.getSheetByName("Data"); // pilih sheet respon
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1; // dapatkan baris selanjutnya
    var row = [new Date()]; // element pertama pada baris harus selalu diawali dengan timestamp
    // loop through the header columns
    for (var i = 1; i < headers.length; i++) {
      // start pada 1 untuk menghindari kolom timestamp
      if (
        headers[i].length > 0 &&
        (headers[i] === "file" ||
          headers[i] === "file2" ||
          headers[i] === "file3" ||
          headers[i] === "file4")
      ) {
        if (headers[i] === "file") {
          row.push(fileUrl1); // tambah data ke baris
        } else if (headers[i] === "file2") {
          row.push(fileUrl2); // tambah data ke baris
        } else if (headers[i] === "file3") {
          row.push(fileUrl3); // tambah data ke baris
        } else if (headers[i] === "file4") {
          row.push(fileUrl4); // tambah data ke baris
        }
      } else if (headers[i].length > 0) {
        row.push(e.parameter[headers[i]]); // tambah data ke baris
      }
    }
    // more efficient to set values as [][] array than individually
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
  } catch (error) {
    Logger.log(error);
  }
}

function uploadFileToGoogleDrive(
  data,
  filename,
  data2,
  filename2,
  data3,
  filename3,
  data4,
  filename4,
  nama,
  email,
  e
) {
  try {
    var dropbox = "Foto Laporan Kerja Workshop";
    var folder,
      folders = DriveApp.getFoldersByName(dropbox);
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(dropbox);
    }

    var contentType = data.substring(5, data.indexOf(";"));
    var bytes = Utilities.base64Decode(
      data.substr(data.indexOf("base64,") + 7)
    );
    var blob = Utilities.newBlob(bytes, contentType, filename);
    var file1 = folder.createFile(blob);
    var fileUrl1 = file1.getUrl();

    var contentType2 = data2.substring(5, data2.indexOf(";"));
    var bytes2 = Utilities.base64Decode(
      data2.substr(data2.indexOf("base64,") + 7)
    );
    var blob2 = Utilities.newBlob(bytes2, contentType2, filename2);
    var file2 = folder.createFile(blob2);
    var fileUrl2 = file2.getUrl();

    var contentType3 = data3.substring(5, data3.indexOf(";"));
    var bytes3 = Utilities.base64Decode(
      data3.substr(data3.indexOf("base64,") + 7)
    );
    var blob3 = Utilities.newBlob(bytes3, contentType3, filename3);
    var file3 = folder.createFile(blob3);
    var fileUrl3 = file3.getUrl();

    var contentType4 = data4.substring(5, data4.indexOf(";"));
    var bytes4 = Utilities.base64Decode(
      data4.substr(data4.indexOf("base64,") + 7)
    );
    var blob4 = Utilities.newBlob(bytes4, contentType4, filename4);
    var file4 = folder.createFile(blob4);
    var fileUrl4 = file4.getUrl();

    record_data(e, fileUrl1, fileUrl2, fileUrl3, fileUrl4);

    return {
      fileUrl1: fileUrl1,
      fileUrl2: fileUrl2,
      fileUrl3: fileUrl3,
      fileUrl4: fileUrl4,
    };
  } catch (f) {
    Logger.log(f);
    throw f;
  }
}
