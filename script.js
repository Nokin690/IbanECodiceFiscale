// ========== FUNZIONI COMUNI ==========

// Mostra la sezione selezionata e nasconde le altre
function mostraSezione(sezione) {
    document.querySelectorAll('.contenuto').forEach(el => {
        el.classList.remove('attivo');
    });
    document.getElementById(sezione).classList.add('attivo');
}

// ========== CODICE FISCALE ==========

const pulisciStringa = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z]/gi, "").toUpperCase();

function estraiConsonanti(str) {
    return str.replace(/[AEIOU]/gi, '');
}

function estraiVocali(str) {
    return str.replace(/[^AEIOU]/gi, '');
}

function parteCognome(cognome) {
    cognome = pulisciStringa(cognome);
    let cons = estraiConsonanti(cognome);
    let voc = estraiVocali(cognome);
    return (cons + voc + "XXX").substring(0, 3);
}

function parteNome(nome) {
    nome = pulisciStringa(nome);
    let cons = estraiConsonanti(nome);
    let voc = estraiVocali(nome);

    if (cons.length >= 4) {
        return cons[0] + cons[2] + cons[3];
    }
    return (cons + voc + "XXX").substring(0, 3);
}

function parteMese(meseIndex) {
    const codMese = "ABCDEHLMPRST";
    return codMese[meseIndex];
}

function letteraControllo(cf15) {
    const valoriDispari = {
        '0': 1, '1': 0, '2': 5, '3': 7, '4': 9, '5': 13, '6': 15, '7': 17, '8': 19, '9': 21,
        'A': 1, 'B': 0, 'C': 5, 'D': 7, 'E': 9, 'F': 13, 'G': 15, 'H': 17, 'I': 19, 'J': 21,
        'K': 2, 'L': 4, 'M': 18, 'N': 20, 'O': 11, 'P': 3, 'Q': 6, 'R': 8, 'S': 12, 'T': 14,
        'U': 16, 'V': 10, 'W': 22, 'X': 25, 'Y': 24, 'Z': 23
    };

    const valoriPari = {
        '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
        'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9,
        'K': 10, 'L': 11, 'M': 12, 'N': 13, 'O': 14, 'P': 15, 'Q': 16, 'R': 17, 'S': 18, 'T': 19,
        'U': 20, 'V': 21, 'W': 22, 'X': 23, 'Y': 24, 'Z': 25
    };

    let somma = 0;
    for (let i = 0; i < 15; i++) {
        let c = cf15[i];
        somma += ((i + 1) % 2 !== 0) ? valoriDispari[c] : valoriPari[c];
    }

    return String.fromCharCode(65 + (somma % 26));
}

function calcolaCodiceFiscale() {
    const cognome = document.getElementById("cognome").value;
    const nome = document.getElementById("nome").value;
    const sesso = document.getElementById("sesso").value.toUpperCase();
    const dataVal = document.getElementById("data").value;
    const comuneCodice = document.getElementById("comune").value.toUpperCase();

    if (!dataVal || comuneCodice.length !== 4) {
        alert("Inserisci una data e il codice del comune.");
        return;
    }

    const dataObj = new Date(dataVal);
    const anno = dataVal.substring(2, 4);
    const mese = parteMese(dataObj.getMonth());
    let giorno = dataObj.getDate();
    if (sesso === "F") giorno += 40;
    const giornoStr = giorno.toString().padStart(2, '0');

    const cf15 = parteCognome(cognome) +
                 parteNome(nome) +
                 anno +
                 mese +
                 giornoStr +
                 comuneCodice;

    const controllo = letteraControllo(cf15);
    document.getElementById("risultatoCF").innerText = "Codice Fiscale: " + cf15 + controllo;
}

// ========== IBAN ==========

function generaIBAN() {
    let abi = document.getElementById("abi").value.trim().padStart(5, "0");
    let cab = document.getElementById("cab").value.trim().padStart(5, "0");
    let conto = document.getElementById("conto").value.trim().toUpperCase().padStart(12, "0");

    let cin = calcolaCIN(abi, cab, conto);
    let codiceControllo = calcolaCodiceIBAN(cin, abi, cab, conto);
    let iban = "IT" + codiceControllo + cin + abi + cab + conto;

    document.getElementById("risultatoIBAN").innerText = "IBAN generato: " + iban;
}

function calcolaCIN(abi, cab, conto) {
    let stringa = abi + cab + conto;
    const valoriPari = {
        '0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,
        'A':0,'B':1,'C':2,'D':3,'E':4,'F':5,'G':6,'H':7,'I':8,'J':9,
        'K':10,'L':11,'M':12,'N':13,'O':14,'P':15,'Q':16,'R':17,
        'S':18,'T':19,'U':20,'V':21,'W':22,'X':23,'Y':24,'Z':25
    };
    const valoriDispari = {
        '0':1,'1':0,'2':5,'3':7,'4':9,'5':13,'6':15,'7':17,'8':19,'9':21,
        'A':1,'B':0,'C':5,'D':7,'E':9,'F':13,'G':15,'H':17,'I':19,'J':21,
        'K':2,'L':4,'M':18,'N':20,'O':11,'P':3,'Q':6,'R':8,
        'S':12,'T':14,'U':16,'V':10,'W':22,'X':25,'Y':24,'Z':23
    };
    let somma = 0;
    for (let i = 0; i < stringa.length; i++) {
        let char = stringa[i];
        if ((i + 1) % 2 === 0) {
            somma += valoriPari[char];
        } else {
            somma += valoriDispari[char];
        }
    }
    return String.fromCharCode(65 + (somma % 26));
}

function calcolaCodiceIBAN(cin, abi, cab, conto) {
    let bban = cin + abi + cab + conto;
    let basePerModulo = bban + "IT00";
    let numerico = "";
    for (let i = 0; i < basePerModulo.length; i++) {
        let c = basePerModulo[i];
        if (/[A-Z]/.test(c)) {
            numerico += (c.charCodeAt(0) - 55);
        } else {
            numerico += c;
        }
    }
    let resto = 0;
    for (let i = 0; i < numerico.length; i++) {
        resto = (resto * 10 + parseInt(numerico[i])) % 97;
    }
    let controllo = 98 - resto;
    return controllo.toString().padStart(2, "0");
}