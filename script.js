/*
   Animazione del manifesto:
   apertura e chiusura morbida del <details>
*/
{
const details = document.getElementById("mio-manifesto");
const summary = details.querySelector("summary");
const contenuto = details.querySelector(".manifesto-contenuto");
let inChiusura = false;

summary.addEventListener("click", (evento) => {
    if (!details.open) {
        return;
    }
    evento.preventDefault();

    if (inChiusura) {
        inChiusura = false;
        contenuto.style.height = contenuto.scrollHeight + "px";
    } else {
        inChiusura = true;
        contenuto.style.height = contenuto.offsetHeight + "px";
        contenuto.offsetHeight;
        contenuto.style.height = "0px";
    }
});

details.addEventListener("toggle", () => {
    if (details.open) {
        contenuto.style.height = "0px";
        contenuto.offsetHeight;
        contenuto.style.height = contenuto.scrollHeight + "px";
    }
});

contenuto.addEventListener("transitionend", () => {
    if (inChiusura) {
        inChiusura = false;
        details.open = false;
    } else if (details.open) {
        contenuto.style.height = "auto";
    }
});

contenuto.style.height = "0px";
}