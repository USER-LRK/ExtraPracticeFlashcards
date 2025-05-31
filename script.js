let flashcards = [];
let currentIndex = 0;
let flipped = false;
let filteredFlashcards = [];

// Load flashcards from JSON
async function loadFlashcards() {
    const response = await fetch('Data/output1.json');
    flashcards = await response.json();
    populateLevelDropdown();
}

// Populate Level & Sub-Level Selectors
function populateLevelDropdown() {
    const levelSelect = document.getElementById("levelSelect");
    const subLevelSelect = document.getElementById("subLevelSelect");

    // Get unique levels from flashcards
    const levels = [...new Set(flashcards.map(card => card.Primary))];

    levels.forEach(level => {
        let option = document.createElement("option");
        option.value = level;
        option.textContent = level;
        levelSelect.appendChild(option);
    });
    populateSubLevelDropdown("3A");
    filterFlashcards();

    levelSelect.addEventListener("change", () => {
        populateSubLevelDropdown(levelSelect.value);
        filterFlashcards();
    });

    subLevelSelect.addEventListener("change", filterFlashcards);
}

// Populate Sub-Level Dropdown Based on Selected Level
function populateSubLevelDropdown(level) {
    const subLevelSelect = document.getElementById("subLevelSelect");
    subLevelSelect.innerHTML = "";

    // Get unique sub-levels for selected level
    const subLevels = [...new Set(flashcards.filter(card => card.Primary == level).map(card => card.Lesson))];

    subLevels.forEach(subLevel => {
        let option = document.createElement("option");
        option.value = subLevel;
        option.textContent = subLevel;
        subLevelSelect.appendChild(option);
    });

    subLevelSelect.value = subLevels[0]; // Auto-select first sub-level
}

// ✅ Filter flashcards by Level & Sub-Level
function filterFlashcards() {
    const level = document.getElementById("levelSelect").value;
    const subLevel = document.getElementById("subLevelSelect").value;

    filteredFlashcards = flashcards.filter(card => card.Primary == level && card.Lesson == subLevel);

    currentIndex = 0;
    updateProgress();
    showFlashcard(currentIndex);
    updateNavigationButtons();
}

// ✅ Update Progress Bar
function updateProgress() {
    if (filteredFlashcards.length === 0) {
        document.getElementById("progress-bar").style.width = "0%";
        return;
    }

    let progress = ((currentIndex + 1) / filteredFlashcards.length) * 100;
    document.getElementById("progress-bar").style.width = `${progress}%`;
}

// Display a flashcard
function showFlashcard(index) {
    const flipper = document.getElementById("card");
    flipper.style.transition = "opacity 0.4s ease-out";
    flipper.style.opacity = "0";

    setTimeout(() => {
        if (filteredFlashcards.length === 0) return;
        flipped = false;
        flipper.style.transition = "none";  
        flipper.style.transform = "rotateY(0deg)";

        const card = filteredFlashcards[index];
        document.getElementById("character").innerText = card.Words;
        document.getElementById("definition").innerText = "Definition: " + card.Definition;
        
        function generateRuby(chinese, pinyin) {
            // Split both the Chinese and Pinyin strings into arrays
            const chineseChars = chinese.split('');
            const pinyinList = pinyin.split(' '); // Assuming pinyin is space-separated
      
            // Check that the arrays have the same length
            if (chineseChars.length !== pinyinList.length) {
              console.error('Chinese and Pinyin must have the same number of characters.');
              return;
            }
      
            // Create the ruby HTML string
            let rubyHtml = '';
            for (let i = 0; i < chineseChars.length; i++) {
              rubyHtml += `<ruby>${chineseChars[i]}<rt>${pinyinList[i]}</rt></ruby>`;
            }
      
            // Output the generated HTML
            document.getElementById('char-grp').innerHTML = rubyHtml;
          }
      
          // Call the function to generate Ruby HTML
          generateRuby(card.Words, card.Pinyin);
        function scaleToFitText(container, text) {
            let fontSize = 100;
            text.style.fontSize = `${fontSize}px`;
          
            while (
              (text.scrollWidth > container.clientWidth || text.scrollHeight > container.clientHeight) &&
              fontSize > 5
            ) {
              fontSize -= 1;
              text.style.fontSize = `${fontSize}px`;
            }
          }
          
          const phrase = document.getElementById("character");
          const container = phrase.parentElement;
          scaleToFitText(container, phrase);
          
          window.addEventListener("resize", () => scaleToFitText(container, phrase));
          
        setTimeout(() => {
            flipper.style.transition = "opacity 0.3s ease-in, transform 0.6s ease-in-out";  
            flipper.style.opacity = "1";  
        }, 50);
    
        
    }, 300); 
}


// Flip the flashcard
document.getElementById("flipCard").addEventListener("click", () => {
    flipped = !flipped;  // Toggle flip state
    document.querySelector(".card").style.transform = flipped ? "rotateY(180deg)" : "rotateY(0deg)";
});



document.getElementById("nextCard").addEventListener("click", () => {
    if (filteredFlashcards.length === 0 || currentIndex >= filteredFlashcards.length - 1) return;
    currentIndex++;
    showFlashcard(currentIndex);
    updateProgress();
    updateNavigationButtons(); // ✅ Ensure buttons update
});

document.getElementById("prevCard").addEventListener("click", () => {
    if (filteredFlashcards.length === 0 || currentIndex <= 0) return;
    currentIndex--;
    showFlashcard(currentIndex);
    updateProgress();
    updateNavigationButtons(); // ✅ Ensure buttons update
});


function updateNavigationButtons() {
    const prevButton = document.getElementById("prevCard");
    const nextButton = document.getElementById("nextCard");

    // Disable "Previous" if at the first card
    if (currentIndex === 0) {
        prevButton.disabled = true;
        prevButton.classList.add("disabled");
    } else {
        prevButton.disabled = false;
        prevButton.classList.remove("disabled");
    }

    // Disable "Next" if at the last card
    if (currentIndex === filteredFlashcards.length - 1) {
        nextButton.disabled = true;
        nextButton.classList.add("disabled");
    } else {
        nextButton.disabled = false;
        nextButton.classList.remove("disabled");
    }
}

// Load flashcards on page load
window.onload = loadFlashcards;

