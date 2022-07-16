export const blobToDataURI = (blob) => {
  return new Promise((resolve, reject) => {
      var reader = new FileReader();

      reader.onload = (e) => {
      var data = e.target.result;
      resolve(data);
      };
      reader.readAsDataURL(blob);
  });
}

export const dataURItoBlob = (dataURI) => {
  var byteString = window.atob(dataURI.split(',')[1]);
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }
  
  var blob = new Blob([ab], {type: mimeString});

  return blob;
}