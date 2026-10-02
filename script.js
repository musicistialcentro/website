//////////////////////// Animazione del manifesto
{
    const details = document.getElementById("mio-manifesto");
    const summary = details.querySelector("summary");
    const contenuto = details.querySelector(".manifesto-contenuto");

    summary.addEventListener("click", (evento) => {
        if (!details.open) {
            return;
        }
        evento.preventDefault();

        if (details.classList.contains("in-chiusura")) {
            details.classList.remove("in-chiusura");
            contenuto.style.height = contenuto.scrollHeight + "px";
        } else {
            details.classList.add("in-chiusura");
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
        if (details.classList.contains("in-chiusura")) {
            details.classList.remove("in-chiusura");
            details.open = false;
        } else if (details.open) {
            contenuto.style.height = "auto";
        }
    });

    contenuto.style.height = "0px";
}

//////////////////////// Attiva lo stato :active su iOS
document.addEventListener("touchstart", () => {}, { passive: true });

//////////////////////// Modulo di iscrizione
{
    const modulo = document.getElementById("modulo-iscrizione");
    const consenso = modulo.querySelector('input[name="consenso"]');
    const bottone = modulo.querySelector("button");
    const esito = modulo.querySelector(".esito");

    // Esegue una modifica al modulo animando il cambio di altezza
    function conTransizione(modifica) {
        const altezzaPrima = modulo.offsetHeight;
        modifica();
        const altezzaDopo = modulo.offsetHeight;

        modulo.style.overflow = "hidden";
        const animazione = modulo.animate(
            [{ height: altezzaPrima + "px" }, { height: altezzaDopo + "px" }],
            { duration: 500, easing: "ease-in-out" }
        );
        animazione.onfinish = () => {
            modulo.style.overflow = "";
        };
    }

    bottone.disabled = !consenso.checked;

    consenso.addEventListener("change", () => {
        bottone.disabled = !consenso.checked;
    });

    modulo.addEventListener("submit", async (evento) => {
        evento.preventDefault();
        bottone.disabled = true;
        conTransizione(() => {
            esito.textContent = "Invio in corso...";
        });

        try {
            const risposta = await fetch(modulo.action, {
                method: "POST",
                body: new URLSearchParams(new FormData(modulo)),
            });
            const dati = await risposta.json();

            if (dati.esito === "ok") {
                conTransizione(() => {
                    esito.textContent = "Grazie!\nIscrizione ricevuta.";
                    modulo.classList.add("inviato");
                });
            } else {
                conTransizione(() => {
                    esito.textContent = "Controlla i dati inseriti e riprova.";
                });
            }
        } catch (errore) {
            conTransizione(() => {
                esito.textContent = "Problema di connessione: riprova tra poco.";
            });
        }

        bottone.disabled = !consenso.checked;
    });
}