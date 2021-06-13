const fadeAlert = () => {
    var content = document.getElementById('alertBox')
    var hello = ''
    console.log(content)
    if (content.innerHTML !== "") {
        setTimeout(() => {
            document.getElementById('alertBox').innerHTML = ''
        }, 2000)
    }
};

fadeAlert();

