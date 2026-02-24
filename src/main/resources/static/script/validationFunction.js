//common validator ------datapattern is the only thing will change
const textValidator = (element, dataPattern, object, property) => {
    const elemenValue = element.value;
    const regExp = new RegExp(dataPattern);
    const ob = window[object];

    if (elemenValue != "") {
        if (regExp.test(elemenValue)) {
            element.style.border = "2px solid green";
            ob[property] = elemenValue;
        } else {
            element.style.border = "2px solid red";
            ob[property] = null;
        }
    } else {
        if (element.required) {
            element.style.border = "2px solid red";
            ob[property] = null;
        } else {
            element.style.border = "1px solid #ced4da";
            ob[property] = "";
        }
    }
}

//validator for date of birth (without special conditions-- ex: age restrictions)
const dateElementValidator = (element, object, property) => {
    const elemenValue = element.value;
    const ob = window[object];

    if (elemenValue != "") {
        element.style.border = "2px solid green";
        ob[property] = elemenValue;
    } else {
        element.style.border = "2px solid red";
        ob[property] = null;
    }

}

// static validator (do not change--static--Ex: civil status --married / single)
const selectStaticElementValidator = (element, object, property) => {
    const elemenValue = element.value;
    const ob = window[object];

    if (elemenValue != "") {
        element.style.border = "2px solid green";
        ob[property] = elemenValue;
    } else {
        element.style.border = "2px solid red";
        ob[property] = null;
    }
}

// dynamic validator
const selectDyanamicElementValidator = (element, object, property) => {
    const elemenValue = element.value;
    const ob = window[object];

    if (elemenValue != "") {
        element.style.border = "2px solid green";
        ob[property] = JSON.parse(elemenValue);
    } else {
        element.style.border = "2px solid red";
        ob[property] = null;
    }
}

// validate image file validator
const imageFileValidator = (fileElement, object, property, previewElement) => {

    if (fileElement.value != "") {

        let file = fileElement.files[0]

        let fileReader = new FileReader();

        fileReader.onload =(e)=>{
            previewElement.src = e.target.result;
            window[object][property]=btoa(e.target.result);
        }

        fileReader.readAsDataURL(file);

    }

}