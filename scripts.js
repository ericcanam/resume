// tries to validate reCaptcha request
function sendReCaptcha(e){
    e.preventDefault(); // don't submit that form
    document.getElementById("reCAPTCHA").style.opacity = 0.4;
    
    fetch('https://h9x8ss1w06.execute-api.ca-central-1.amazonaws.com/verify_captcha', {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({"grcr": e.target.elements["g-recaptcha-response"].value /*,
                              "name": e.target.elements["name"].value,
                              "org": e.target.elements["company"].value*/})
    }).then(async response => {
        if(response.ok){
            let info = await response.json();
            // populate email/phone fields
            document.getElementById("phone").innerHTML = info["phone"];
            document.getElementById("email").innerHTML = info["email"];

            // set download PDF link
            // e.target.elements["pdftoken"].value = info["token"];
            document.getElementById("download_pdf_button").setAttribute("href", "https://h9x8ss1w06.execute-api.ca-central-1.amazonaws.com/get_resume?dtoken="+info["token"]);

            // update visibility of screens in contact page
            document.getElementById("reCAPTCHA").style.display = "none";
            document.getElementById("contact-card").style.display = "block";
        }else{
            // whoopsies! show error splash
            document.getElementById("reCAPTCHA").style.display = "none";
            document.getElementById("captcha-error").style.display = "block";
        }
    });
}
