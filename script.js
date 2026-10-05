//////////////////////// Animazione del manifesto (pagina principale)
function animazioneManifesto() {
    const details = document.getElementById("mio-manifesto");
    if (!details) {
        return;
    }
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
animazioneManifesto();

//////////////////////// Attiva lo stato :active su iOS
document.addEventListener("touchstart", () => {}, { passive: true });

//////////////////////// Invio di un modulo allo script Google (usata da tutti i moduli)
function attivaModulo(modulo, opzioni) {
    const bottone = modulo.querySelector("button");
    const esito = modulo.querySelector(".esito");
    const puoInviare = opzioni.puoInviare || (() => true);

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

    bottone.disabled = !puoInviare();

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
                    esito.textContent = opzioni.messaggioOk;
                    modulo.classList.add("inviato");
                });
            } else {
                conTransizione(() => {
                    esito.textContent = opzioni.messaggioErrore;
                });
            }
        } catch (errore) {
            conTransizione(() => {
                esito.textContent = "Problema di connessione: riprova tra poco.";
            });
        }

        bottone.disabled = !puoInviare();
    });
}

//////////////////////// Modulo di iscrizione (pagina principale)
function moduloIscrizione() {
    const modulo = document.getElementById("modulo-iscrizione");
    if (!modulo) {
        return;
    }

    const consenso = modulo.querySelector('input[name="consenso"]');
    const bottone = modulo.querySelector("button");

    consenso.addEventListener("change", () => {
        bottone.disabled = !consenso.checked;
    });

    attivaModulo(modulo, {
        puoInviare: () => consenso.checked,
        messaggioOk: "Grazie!\nIscrizione ricevuta.\nControlla la tua casella email.",
        messaggioErrore: "Controlla i dati inseriti e riprova.",
    });
}
moduloIscrizione();

//////////////////////// Pagina di disiscrizione
function paginaDisiscrizione() {
    const richiesta = document.getElementById("richiesta-disiscrizione");
    const conferma = document.getElementById("conferma-disiscrizione");
    if (!richiesta || !conferma) {
        return;
    }

    // Se la pagina è stata aperta dal link personale, l'indirizzo contiene email e codice
    const parametri = new URLSearchParams(location.search);
    const email = parametri.get("email");
    const codice = parametri.get("codice");

    if (email && codice) {
        richiesta.hidden = true;
        conferma.hidden = false;
        conferma.querySelector(".email-da-cancellare").textContent = email;
        conferma.elements.email.value = email;
        conferma.elements.codice.value = codice;
    }

    attivaModulo(richiesta, {
        messaggioOk: "Fatto!\nSe l'indirizzo è iscritto, riceverai a breve un'email con il link per confermare.",
        messaggioErrore: "Controlla l'indirizzo email e riprova.",
    });

    attivaModulo(conferma, {
        messaggioOk: "Iscrizione annullata.\nCi dispiace vederti andare!",
        messaggioErrore: "Il link non è valido: richiedi una nuova email di conferma.",
    });
}
paginaDisiscrizione();