const items = document.querySelectorAll(".item");
const saveZone = document.getElementById("save-zone");
const scoreDisplay = document.getElementById("score");
let score = 0; items.forEach((item) => {
    item.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", item.innerText); e.dataTransfer.setData("isGood", item.dataset.good);
        e.dataTransfer.setData("id", item.innerText);
    });
});
saveZone.addEventListener("dragover", (e) => { e.preventDefault(); });
saveZone.addEventListener("drop", (e) => {
    e.preventDefault();
    const itemName = e.dataTransfer.getData("text/plain");
    const isGood = e.dataTransfer.getData("isGood") === "true";
    const id = e.dataTransfer.getData("id");
    const dragged = [...document.querySelectorAll(".item")].find(el => el.innerText === id);
    if (!dragged) return; if (isGood) {
        dragged.classList.add("correct");
        score += 1;
    } else { dragged.classList.add("incorrect"); score -= 1; } dragged.setAttribute("draggable", "false");
    saveZone.appendChild(dragged); scoreDisplay.textContent = score;
}); 