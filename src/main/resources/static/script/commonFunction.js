
const setDefault = (elements) =>{
    elements.forEach(element => {
        element.style.border = "1px solid #ced4da";
       /* when using bootstrap
        element.classList.remove("is-valid");
        element.classList.remove("is-invalid");*/

    });
}

// ajax - GET --- define function for get service request
const getServiceRequest = (url) => {

    let getServiceResponce = [];

    $.ajax ({
        url: url, // the URL to which the request is sent
        type: 'GET', //the HTTP method to use for the request (GET, POST, etc.)
        contentType: 'json',
        async: false,
        success: function (response) {
            //code to execute if the request succeeds
            console.log('Success:', response);
            getServiceResponce = response;
        },
        error: function (xhr, status, error){
            //code to execute if the request fails
            console.log('Error:', error);
           
        }
     });

     return getServiceResponce;
}

// define function for post, put, delete service request
const getHTTPServiceRequest = (url, method, data) => {

    let getServiceResponce = [];

    $.ajax ({
        url: url, // the URL to which the request is sent
        type: method, //the HTTP method to use for the request (GET, POST, etc.)
        contentType: 'application/json',
        data: JSON.stringify(data),
        async: false,
        success: function (response) {
            //code to execute if the request succeeds
            console.log('Success:', response);
            getServiceResponce = response;
        },
        error: function (xhr, status, error){
            //code to execute if the request fails
            console.log('Error:', error);
           
        }
     });

     return getServiceResponce;
}

//
function generateColorCodes(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    colors.push(color);
  }
  return colors;
}

//set date & time fpr print
function setCurrentDateTime() {
    const now = new Date();
    const options = {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: true
    };
    document.getElementById('currentDateTime').textContent = 'Date :' + now.toLocaleString('en-US', options);
}