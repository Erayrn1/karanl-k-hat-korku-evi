document.addEventListener("DOMContentLoaded", () => {

    const sections = document.querySelectorAll("section");

    window.showSection = function(id){

        sections.forEach(section=>{
            section.style.display="none";
        });

        const active=document.getElementById(id);

        if(active){
            active.style.display="block";
            window.scrollTo({
                top:0,
                behavior:"smooth"
            });
        }

    }

    showSection("home");

});
