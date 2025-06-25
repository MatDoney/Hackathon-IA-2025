const items = document.querySelectorAll(".item");
const saveZone = document.getElementById("save-zone");
const scoreDisplay = document.getElementById("score");
const nextBtn = document.getElementById("next-btn");
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
    } else {
        dragged.classList.add("incorrect");
        score -= 1;
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
        nextBtn.onclick = () => {
            window.location.href = "./lv"+nextBtn.dataset.lv+".html?score=" + score;
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