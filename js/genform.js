textareaElement = document.getElementById("text-to-copy");

genform.addEventListener("submit", function(event){
    event.preventDefault();
    generate('security.plist', [
        "contact", "encryption", "acknowledgments", "preferredLanguages", "policy", "hiring"
    ]);

    scrollToStepTwo()
});

function generate(filename, field_array){
    var text = `
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
    <dict>
    `;
    
    // Converts camel case like 'abcDefGhi' into
    // the format 'Abc-Def-Ghi'
    function camelToHyphen(camelCaseWord) {
        var components = camelCaseWord.split(/(?=[A-Z])/) // abcDef => [abc, Def]

        return components.map(function (component) {
          return component[0].toUpperCase() + component.slice(1) // ABC => Abc
        }).join('-')
    }

    field_array.forEach(function(e){
        console.log(e)
        var inputs = document.getElementById(e).querySelector(".list-of-inputs")

        inputs.querySelectorAll("input").forEach(function(child) {
            if(child.value.length > 0){
                text += "\t<key>" + camelToHyphen(e) + "</key> \n" + "\t<string>" + child.value + "</string>\n";
            }
        });
    });

    text += `
    </dict>
    </plist>
    `;

    textareaElement.value = text;

    if (document.queryCommandSupported("copy")) {
        document.getElementById("copy-button").removeAttribute("disabled")
    }
}

function addAlternative(button) {
    var list = button.parentElement.parentElement.parentElement.querySelector(".list-of-inputs")
    
    var newInput = document.createElement("INPUT")
    newInput.setAttribute("placeholder", "Another possible alternative")
    newInput.setAttribute("class", "input")

    var newInputControl = document.createElement("DIV")
    newInputControl.setAttribute("class", "control is-expanded")
    newInputControl.appendChild(newInput)

    var removeButton = document.createElement("BUTTON")
    removeButton.setAttribute("type", "button")
    removeButton.setAttribute("class", "button is-danger")
    removeButton.textContent = "Remove"
    
    var removeButtonControl = document.createElement("DIV")
    removeButtonControl.setAttribute("class", "control")
    removeButtonControl.appendChild(removeButton)

    var overallField = document.createElement("LI")
    overallField.setAttribute("class", "field is-grouped")
    overallField.appendChild(newInputControl)
    overallField.appendChild(removeButtonControl)

    removeButton.addEventListener("click", function() {
        // not using Element.remove() to maintain support
        // with Internet Explorer
        overallField.parentNode.removeChild(overallField)
    })

    list.appendChild(overallField)
    newInput.focus()
}

function copyTextarea(){
    textareaElement.select();
    document.execCommand("copy");

    window.getSelection().empty();
    showNotification();
}

function scrollToStepTwo() {
  var stepTwo = document.getElementById("step-two")

  if (stepTwo.scrollIntoView) {
      stepTwo.scrollIntoView({behavior: "smooth", block: "start"})
  } else {
      location.hash = "step-two"
  }
}

notification = document.getElementById("txt-notification");

function removeNotification(){
    function hide(){
        notification.classList.remove("visible");
        notification.removeEventListener("transitionend ", hide);
    };

    notification.classList.remove("opaque");
    notification.addEventListener("transitionend", hide)
}

function showNotification(){
    notification.classList.add("visible");
    setTimeout(function(){
        // doesn't work when called on the same tick
        notification.classList.add("opaque");
    });
}
