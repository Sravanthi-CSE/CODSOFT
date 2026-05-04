function searchJobs(){

    let input =
    document.getElementById("search").value.toLowerCase();

    let cards =
    document.querySelectorAll(".job-card");

    cards.forEach(card => {

        let text = card.innerText.toLowerCase();

        if(text.includes(input)){
            card.style.display = "block";
        }

        else{
            card.style.display = "none";
        }

    });

}

function submitApplication(event){

    event.preventDefault();

    alert("Application Submitted Successfully!");

}