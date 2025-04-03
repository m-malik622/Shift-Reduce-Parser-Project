document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const inputField = document.getElementById("input");
    const stepsDisplay = document.querySelector(".steps_display");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form from refreshing the page
        const input = inputField.value.trim();
        if (input === "") {
            alert("Please enter an input string.");
            return;
        }
        parseInput(input);
    });
