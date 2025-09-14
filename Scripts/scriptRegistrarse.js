document.addEventListener("DOMContentLoaded", function () {
    const dropArea = document.getElementById("dropArea");
    const fileInput = document.getElementById("fileInput");

    // Abrir el selector de archivos al hacer clic en el área
    dropArea.addEventListener("click", () => fileInput.click());

    // Manejar la selección manual de archivos
    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            previewImage(file);
        }
    });

    // Eventos de arrastrar y soltar
    dropArea.addEventListener("dragover", (event) => {
        event.preventDefault();
        dropArea.classList.add("highlight");
    });

    dropArea.addEventListener("dragleave", () => {
        dropArea.classList.remove("highlight");
    });

    dropArea.addEventListener("drop", (event) => {
        event.preventDefault();
        dropArea.classList.remove("highlight");

        const file = event.dataTransfer.files[0];
        if (file) {
            previewImage(file);
        }
    });

    // Función para previsualizar la imagen
    function previewImage(file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            dropArea.style.backgroundImage = `url(${reader.result})`;
            dropArea.textContent = "";
        };
    }
});