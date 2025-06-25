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