 // Selección del canvas2 y contexto
 const canvas2 = document.getElementById("gameCanvas2");
 const ctx2 = canvas2.getContext("2d");

 // Variables globales
 let cardBack = "red";         // Color del reverso de las cartas
 let columns = [];             // Array de columnas (tableau)
 let stock = [];               // Mazo de robo (cartas no repartidas)
 let waste = [];               // Descarte (área donde se colocan las cartas robadas)
 let foundations = [[], [], [], []]; // Fundaciones (para mover cartas por palo)
 let selectedCard = null;      // Carta que se está moviendo
 let selectedPile = null;      // Información sobre el origen de la carta (tableau o waste)
 let offsetX, offsetY;         // Diferencia entre la posición del mouse y la carta
 let backgroundImage = new Image(); // Objeto para la imagen de fondo

 // Cargar la imagen de fondo
 backgroundImage.src = "Imagenes/tapete.jpg"; // Ruta de la imagen
 backgroundImage.onload = function() {
     redraw(); // Redibujar cuando la imagen se cargue
 };

 // Cambio del reverso a través de un input
 document.getElementById("cardBack").addEventListener("change", function() {
     cardBack = this.value;
     redraw();
 });

 // Función para crear un mazo barajado de 52 cartas
 function createDeck() {
     let deck = [];
     for (let suit of ["♠", "♥", "♦", "♣"]) {
         for (let value = 1; value <= 13; value++) {
             deck.push({
                 suit,
                 value,
                 x: 0,
                 y: 0,
                 width: 80,
                 height: 120,
                 faceUp: false
             });
         }
     }
     // Baraja de forma aleatoria
     return deck.sort(() => Math.random() - 0.5);
 }

 // Función para iniciar el juego: reparte el tableau y asigna el stock
 function startGame() {
     ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
     let deck = createDeck();
     columns = [];
     
     // Reparto de 7 columnas para el tableau con ajuste de alineación
     for (let i = 0; i < 7; i++) {
         let column = [];
         for (let j = 0; j <= i; j++) {
             let card = deck.pop();
             card.x = 100 + i * 100; // Mantener espaciado de 100 píxeles
             card.y = 100 + j * 30;
             if (j === i) card.faceUp = true;
             column.push(card);
         }
         columns.push(column);
     }
     // Las cartas restantes forman el stock (mazo de robo)
     stock = deck;
     waste = [];
     foundations = [[], [], [], []];
     redraw();
 }

 // Función para dibujar una carta
 function drawCard(card) {
     ctx2.fillStyle = "white";
     ctx2.fillRect(card.x, card.y, card.width, card.height);
     ctx2.strokeStyle = "black";
     ctx2.strokeRect(card.x, card.y, card.width, card.height);
     if (card.faceUp) {
         ctx2.fillStyle = card.suit === "♥" || card.suit === "♦" ? "red" : "black";
         ctx2.font = "20px Arial";
         let displayValue = card.value;
         if (card.value === 1) displayValue = "A";
         if (card.value === 11) displayValue = "J";
         if (card.value === 12) displayValue = "Q";
         if (card.value === 13) displayValue = "K";
         ctx2.fillText(displayValue + card.suit, card.x + 20, card.y + 30);
     } else {
         ctx2.fillStyle = cardBack;
         ctx2.fillRect(card.x + 5, card.y + 5, card.width - 10, card.height - 10);
     }
 }

 // Función para dibujar el stock
 function drawStock() {
     const stockX = 20;
     const stockY = 20;
     if (stock.length > 0) {
         ctx2.fillStyle = cardBack;
         ctx2.fillRect(stockX, stockY, 80, 120);
         ctx2.strokeStyle = "black";
         ctx2.strokeRect(stockX, stockY, 80, 120);
     } else {
         ctx2.fillStyle = "lightgray";
         ctx2.fillRect(stockX, stockY, 80, 120);
         ctx2.strokeStyle = "black";
         ctx2.strokeRect(stockX, stockY, 80, 120);
     }
 }

 function drawFromStock() {
    if (stock.length > 0) {
        let card = stock.pop();
        card.faceUp = true;
        card.x = 120;
        card.y = 20;
        waste.push(card);
    } else if (waste.length > 0) {
        stock = waste.reverse();
        waste = [];
        stock.forEach(card => card.faceUp = false);
    }
    redraw();
}

 // Función para dibujar el waste
 function drawWaste() {
     const wasteX = 120;
     const wasteY = 20;
     if (waste.length > 0) {
         let topCard = waste[waste.length - 1];
         drawCard(topCard);
     } else {
         ctx2.fillStyle = "lightgray";
         ctx2.fillRect(wasteX, wasteY, 80, 120);
         ctx2.strokeStyle = "black";
         ctx2.strokeRect(wasteX, wasteY, 80, 120);
     }
 }

 function drawFoundations() {
     for (let i = 0; i < 4; i++) {
         const foundationX = 400 + i * 100; // Posición alineada con la imagen
         const foundationY = 20;
         
         if (foundations[i].length === 0) {
             ctx2.fillStyle = "lightgray";
             ctx2.fillRect(foundationX, foundationY, 80, 120);
             ctx2.strokeStyle = "black";
             ctx2.strokeRect(foundationX, foundationY, 80, 120);
             ctx2.fillStyle = "black";
             ctx2.font = "40px Arial";
             ctx2.textAlign = "center";
             ctx2.textBaseline = "middle";
             ctx2.fillText("A", foundationX + 40, foundationY + 60);
         } else {
             foundations[i].forEach((card, index) => {
                 card.x = foundationX;
                 card.y = foundationY + index * 10;
                 drawCard(card);
             });
         }
     }
 }

 function redraw() {
     // Dibujar la imagen de fondo
     if (backgroundImage.complete) {
         ctx2.drawImage(backgroundImage, 0, 0, canvas2.width, canvas2.height);
     } else {
         ctx2.fillStyle = "green";
         ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
     }

     drawStock();
     drawWaste();
     drawFoundations();
     for (let column of columns) {
         for (let card of column) {
             drawCard(card);
         }
     }
 }

 // Función para verificar si un movimiento al tableau es válido
 function canMoveToColumn(card, targetColumn) {
     if (targetColumn.length === 0) {
         return card.value === 13; // Solo un rey puede moverse a una columna vacía
     }
     let topCard = targetColumn[targetColumn.length - 1];
     let isOppositeColor = (card.suit === "♥" || card.suit === "♦") !== (topCard.suit === "♥" || topCard.suit === "♦");
     return isOppositeColor && card.value === topCard.value - 1;
 }

 // Función para verificar si un movimiento a una fundación es válido
 function canMoveToFoundation(card, foundation) {
     if (foundation.length === 0) {
         return card.value === 1; // Solo un as puede iniciar una fundación
     }
     let topCard = foundation[foundation.length - 1];
     return card.suit === topCard.suit && card.value === topCard.value + 1;
 }

 // EVENTOS DEL MOUSE

 // Manejador de "mousedown"
 canvas2.addEventListener("mousedown", function(event) {
     const rect = canvas2.getBoundingClientRect();

     const scaleX = canvas2.width  / rect.width;   // Relación de escalado horizontal
     const scaleY = canvas2.height / rect.height;

     const mouseX = (event.clientX - rect.left) * scaleX;
     const mouseY = (event.clientY - rect.top)  * scaleY;

     // 1) Si se hace clic en el área del stock
     if (mouseX >= 20 && mouseX <= 20 + 80 && mouseY >= 20 && mouseY <= 20 + 120) {
         drawFromStock();
         return;
     }

     // 2) Si se hace clic en el área del waste
     if (waste.length > 0) {
         let topCard = waste[waste.length - 1];
         if (mouseX >= topCard.x && mouseX <= topCard.x + topCard.width &&
             mouseY >= topCard.y && mouseY <= topCard.y + topCard.height) {
             selectedCard = topCard;
             selectedPile = { type: "waste" };
             offsetX = mouseX - topCard.x;
             offsetY = mouseY - topCard.y;
             return;
         }
     }

     // 3) Recorre las columnas (tableau) para detectar si se ha hecho clic en una carta boca arriba
     for (let colIndex = 0; colIndex < columns.length; colIndex++) {
         let column = columns[colIndex];
         for (let cardIndex = 0; cardIndex < column.length; cardIndex++) {
             let card = column[cardIndex];
             if (mouseX >= card.x && mouseX <= card.x + card.width &&
                 mouseY >= card.y && mouseY <= card.y + card.height && card.faceUp) {
                 selectedCard = card;
                 selectedPile = { type: "column", colIndex, cardIndex };
                 offsetX = mouseX - card.x;
                 offsetY = mouseY - card.y;
                 return;
             }
         }
     }

     // 4) Si se hace clic en una carta de las fundaciones
     for (let i = 0; i < 4; i++) {
         if (foundations[i].length > 0) {
             let topCard = foundations[i][foundations[i].length - 1];
             const foundationX = 400 + i * 90;
             const foundationY = 20 + (foundations[i].length - 1) * 10;
             if (mouseX >= foundationX && mouseX <= foundationX + 80 &&
                 mouseY >= foundationY && mouseY <= foundationY + 120) {
                 selectedCard = topCard;
                 selectedPile = { type: "foundation", foundationIndex: i };
                 offsetX = mouseX - topCard.x;
                 offsetY = mouseY - topCard.y;
                 return;
             }
         }
     }
 });

 // Manejador de "mousemove"
 canvas2.addEventListener("mousemove", function(event) {
    if (!selectedCard) return;

    const rect = canvas2.getBoundingClientRect();
    const scaleX = canvas2.width  / rect.width;
    const scaleY = canvas2.height / rect.height;
  
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top)  * scaleY;
  
    selectedCard.x = mouseX - offsetX;
    selectedCard.y = mouseY - offsetY;
  
    redraw();
    drawCard(selectedCard);
  });
  

 // Manejador de "mouseup"
canvas2.addEventListener("mouseup", function(event) {
    if (!selectedCard) return;

    // 1) Calcula rect y escala
    const rect = canvas2.getBoundingClientRect();
    const scaleX = canvas2.width  / rect.width;   // Relación de escalado horizontal
    const scaleY = canvas2.height / rect.height;  // Relación de escalado vertical

    // 2) Convierte coordenadas del mouse a las internas del canvas
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top)  * scaleY;

    let moved = false;

    // 3) Intentar mover a una fundación
    for (let i = 0; i < 4; i++) {
        const foundationX = 400 + i * 90;
        const foundationY = 20;
        if (mouseX >= foundationX && mouseX <= foundationX + 80 &&
            mouseY >= foundationY && mouseY <= foundationY + 120) {
            if (canMoveToFoundation(selectedCard, foundations[i])) {
                if (selectedPile.type === "column") {
                    columns[selectedPile.colIndex].splice(selectedPile.cardIndex, 1);
                    if (selectedPile.cardIndex > 0 && columns[selectedPile.colIndex][selectedPile.cardIndex - 1]) {
                        columns[selectedPile.colIndex][selectedPile.cardIndex - 1].faceUp = true;
                    }
                } else if (selectedPile.type === "waste") {
                    waste.pop();
                } else if (selectedPile.type === "foundation") {
                    foundations[selectedPile.foundationIndex].pop();
                }
                selectedCard.x = foundationX;
                selectedCard.y = foundationY + foundations[i].length * 10;
                foundations[i].push(selectedCard);
                moved = true;
                break;
            }
        }
    }

    // 4) Intentar mover a una columna del tableau
    if (!moved) {
        for (let colIndex = 0; colIndex < columns.length; colIndex++) {
            let targetColumn = columns[colIndex];
            let targetX = 100 + colIndex * 100;
            let targetY = targetColumn.length > 0 ? targetColumn[targetColumn.length - 1].y + 30 : 100;
            if (mouseX >= targetX && mouseX <= targetX + 80 &&
                mouseY >= targetY - 30 && mouseY <= targetY + 120) {
                if (canMoveToColumn(selectedCard, targetColumn)) {
                    if (selectedPile.type === "column") {
                        columns[selectedPile.colIndex].splice(selectedPile.cardIndex, 1);
                        if (selectedPile.cardIndex > 0 && columns[selectedPile.colIndex][selectedPile.cardIndex - 1]) {
                            columns[selectedPile.colIndex][selectedPile.cardIndex - 1].faceUp = true;
                        }
                    } else if (selectedPile.type === "waste") {
                        waste.pop();
                    } else if (selectedPile.type === "foundation") {
                        foundations[selectedPile.foundationIndex].pop();
                    }
                    selectedCard.x = targetX;
                    selectedCard.y = targetY;
                    targetColumn.push(selectedCard);
                    moved = true;
                    break;
                }
            }
        }
    }

    // 5) Si no se pudo mover, devolver la carta a su posición original
    if (!moved) {
        if (selectedPile.type === "column") {
            let originalColumn = columns[selectedPile.colIndex];
            selectedCard.x = 100 + selectedPile.colIndex * 100;
            selectedCard.y = 100 + selectedPile.cardIndex * 30;
        } else if (selectedPile.type === "waste") {
            selectedCard.x = 120;
            selectedCard.y = 20;
            waste.push(selectedCard);
        } else if (selectedPile.type === "foundation") {
            let foundationIndex = selectedPile.foundationIndex;
            selectedCard.x = 400 + foundationIndex * 90;
            selectedCard.y = 20 + (foundations[foundationIndex].length * 10);
            foundations[foundationIndex].push(selectedCard);
        }
    }

    // 6) Liberar la carta seleccionada y redibujar
    selectedCard = null;
    selectedPile = null;
    redraw();
});

 // Inicia el juego al cargar la página
 startGame();