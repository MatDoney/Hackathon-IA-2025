const items = document.querySelectorAll(".item");
const saveZone = document.getElementById("save-zone");
const scoreDisplay = document.getElementById("score");
const nextBtn = document.getElementById("next-btn");
const validate = new Audio('../assets/validate.mp3');
const wrong = new Audio('../assets/wrong.mp3');
let params = new URLSearchParams(document.location.search);
let score = parseInt(params.get("score")) || 0;
scoreDisplay.textContent = score;

items.forEach((item) => {
    item.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", item.innerText);
        e.dataTransfer.setData("isGood", item.dataset.good);
        e.dataTransfer.setData("id", item.innerText);
    });
});

saveZone.addEventListener("dragover", (e) => { 
    e.preventDefault(); 
});

saveZone.addEventListener("drop", (e) => {
    e.preventDefault();
    const itemName = e.dataTransfer.getData("text/plain");
    const isGood = e.dataTransfer.getData("isGood") === "true";
    const id = e.dataTransfer.getData("id");
    const dragged = [...document.querySelectorAll(".item")].find(el => el.innerText === id);
    if (!dragged) return;
    if (isGood) {
        dragged.classList.add("correct");
        score += 1;
        validate.play();
    } else {
        dragged.classList.add("incorrect");
        score -= 1;
        wrong.play();
    }
    dragged.setAttribute("draggable", "false");
    saveZone.appendChild(dragged);
    scoreDisplay.textContent = score;
    
    checkAllGoodsSaved();
});

function checkAllGoodsSaved() {
    // Récupère tous les éléments data-good="true"
    const goodItems = document.querySelectorAll(".item[data-good='true']");
    // Vérifie que chaque élément se trouve dans la zone de sauvegarde
    const allSaved = Array.from(goodItems).every(item => saveZone.contains(item));

    if (allSaved) {
        nextBtn.style.display = "block";

        // Détermination du niveau à partir du nom du fichier (ex. "lv1.html" pour le niveau 1)
        let levelMatch = window.location.pathname.match(/lv(\d)\.html/);
        let currentLevel = levelMatch ? levelMatch[1] : "default";

        // Messages personnalisés pour chaque niveau
        const messages = {
            "1": "Les aliments affichés (ex. Carotte et Riz cuit) sont récupérables car ils conservent leur qualité. Conseil : Vérifiez toujours les dates de péremption.",
            "2": "Le pain dur et la purée restante sont utilisables, contrairement à l’œuf fissuré et au lait tourné. Conseil : Faites attention aux signes de détérioration.",
            "3": "Certains fruits comme la banane tachetée et les pommes fripées peuvent être transformés, mais les fruits moisies doivent être écartés. Conseil : Soyez attentif à leur aspect.",
            "4": "Les restes de viandes cuisinées sont sûrs, tandis que la viande crue odorante ne l'est pas. Conseil : Manipulez soigneusement les viandes.",
            "5": "Même si la DDM est dépassée, certains produits secs restent consommables, contrairement aux produits humides. Conseil : Stockez vos produits secs dans un endroit frais et sec."
        };
        const adviceMsg = messages[currentLevel] || "Les aliments récupérables sont ceux qui conservent leur qualité. Conseil : Inspectez toujours visuellement et vérifiez la date de péremption.";

        // Création ou mise à jour du message explicatif
        let adviceDiv = document.getElementById("advice-message");
        if (!adviceDiv) {
            adviceDiv = document.createElement("div");
            adviceDiv.id = "advice-message";
            adviceDiv.style.marginTop = "1em";
            adviceDiv.style.padding = "0.5em";
            adviceDiv.style.backgroundColor = "#f0f0f0";
            adviceDiv.style.border = "1px solid #ccc";
            nextBtn.parentNode.insertBefore(adviceDiv, nextBtn.nextSibling);
        }
        adviceDiv.textContent = adviceMsg;

        nextBtn.onclick = () => {
            window.location.href = "./lv" + nextBtn.dataset.lv + ".html?score=" + score;
        };
    }
}

// Ajout du support tactile pour mobile
items.forEach((item) => {
    item.addEventListener("touchstart", handleTouchStart, { passive: false });
});

function handleTouchStart(e) {
    e.preventDefault();
    const item = e.currentTarget;
    // Calculer le décalage initial entre le point de contact et la position de l'élément
    item.initialX = e.touches[0].clientX - item.getBoundingClientRect().left;
    item.initialY = e.touches[0].clientY - item.getBoundingClientRect().top;

    // Passer l'élément en mode absolu pour le déplacer librement
    item.style.position = "absolute";
    item.style.zIndex = "1000";

    item.addEventListener("touchmove", handleTouchMove, { passive: false });
    item.addEventListener("touchend", handleTouchEnd, { passive: false });
}

function handleTouchMove(e) {
    e.preventDefault();
    const item = e.currentTarget;
    const touch = e.touches[0];
    // Déplacer l'élément en fonction du mouvement tactile
    item.style.left = (touch.clientX - item.initialX) + "px";
    item.style.top = (touch.clientY - item.initialY) + "px";
}

function handleTouchEnd(e) {
    const item = e.currentTarget;
    const touch = e.changedTouches[0];
    const dropZoneRect = saveZone.getBoundingClientRect();

    // Vérifier si le point de fin de contact se trouve dans la zone de sauvegarde
    if (
        touch.clientX >= dropZoneRect.left &&
        touch.clientX <= dropZoneRect.right &&
        touch.clientY >= dropZoneRect.top &&
        touch.clientY <= dropZoneRect.bottom
    ) {
        const isGood = item.dataset.good === "true";
        if (isGood) {
            item.classList.add("correct");
            score += 1;
        } else {
            item.classList.add("incorrect");
            score -= 1;
        }
        item.setAttribute("draggable", "false");
        saveZone.appendChild(item);
        scoreDisplay.textContent = score;
        checkAllGoodsSaved();
    }
    // Réinitialiser les styles
    item.style.position = "";
    item.style.left = "";
    item.style.top = "";
    item.style.zIndex = "";

    item.removeEventListener("touchmove", handleTouchMove);
    item.removeEventListener("touchend", handleTouchEnd);
}