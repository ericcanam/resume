// tries to validate reCaptcha request
function sendReCaptcha(e){
    e.preventDefault(); // don't submit that form

    fetch('https://h9x8ss1w06.execute-api.ca-central-1.amazonaws.com/verify_captcha', {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({"grcr": e.target.elements["g-recaptcha-response"].value})
    }).then(async response => {
        if(response.ok){
            let info = await response.json();
            document.getElementById("phone").innerHTML = info["phone"];
            document.getElementById("email").innerHTML = info["email"];
            document.getElementById("reCAPTCHA").style.display = "none";
            document.getElementById("contact-card").style.display = "block";
        }else{
            document.getElementById("reCAPTCHA").style.display = "none";
            document.getElementById("captcha-error").style.display = "block";
        }
    });
}