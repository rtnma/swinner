// ---------- ИНГРЕДИЕНТЫ ----------
const ingredients = [
    { id: "cocoa", name: "Какао-порошок", emoji: "🍫", value: 1 },
    { id: "sugar", name: "Сахар", emoji: "🍬", value: 1 },
    { id: "milk", name: "Молоко", emoji: "🥛", value: 1 },
    { id: "vanilla", name: "Ваниль", emoji: "🌿", value: 1 },
    { id: "cocoaButter", name: "Масло какао", emoji: "🧈", value: 1 }
];

const additivesList = [
    { id: "nuts", name: "Орехи", emoji: "🌰", selected: false, caloriesPer50g: 76, protein: 2.5, fat: 6.8, carbs: 1.5 },
    { id: "jam", name: "Ягодный джем", emoji: "🍓", selected: false, caloriesPer50g: 54, protein: 0.3, fat: 0.1, carbs: 13.2 },
    { id: "cookies", name: "Кусочки печенья", emoji: "🍪", selected: false, caloriesPer50g: 83, protein: 1.2, fat: 3.5, carbs: 11.0 }
];

const chocolateFacts = [
    "🍫 Шоколад когда-то использовали как лекарство — им лечили простуду и болезни желудка!",
    "🍬 Первую шоколадную плитку создали в 1847 году, а до этого шоколад пили только в жидком виде",
    "🌳 Какао-деревья живут до 200 лет, но плодоносят только 25-30 лет",
    "💰 В древности ацтеки использовали какао-бобы как деньги!",
    "🍫 Белый шоколад — это технически не шоколад, потому что не содержит какао-порошка",
    "😊 В тёмном шоколаде содержится вещество, которое мозг вырабатывает при влюблённости",
    "🇨🇭 Швейцария — мировая столица шоколада",
    "🚀 Шоколад брали даже в космические миссии!",
    "🧪 Температура плавления шоколада — 34°C",
    "🌍 70% всего какао в мире выращивают в Африке",
    "💚 Тёмный шоколад полезен для сердца",
    "🎁 Самый дорогой шоколад в мире стоит $2600 за плитку",
    "🐶 Собакам нельзя есть шоколад — теобромин для них смертельно опасен"
];

let currentSize = 8;
let isAiry = false;
let isCooled = false;
let finalResult = null;
let lastCreatedResult = null;

// DOM элементы
const slidersContainer = document.getElementById("slidersContainer");
const additivesContainer = document.getElementById("additivesContainer");
const sizeBtns = document.querySelectorAll(".size-btn");
const centrifugeBlock = document.getElementById("centrifugeBlock");
const centrifugeBtn = document.getElementById("centrifugeBtn");
const airStatusSpan = document.getElementById("airStatus");
const fridgeBtn = document.getElementById("fridgeBtn");
const finishBtn = document.getElementById("finishBtn");
const resultBox = document.getElementById("resultBox");
const nutritionBlock = document.getElementById("nutritionBlock");
const nutritionGrid = document.getElementById("nutritionGrid");

// ========== ФОРМУЛА МИФФЛИНА-САН-ЖЕОРА ==========
function calculateMifflin(weight, height, age, gender, activity) {
    let bmr;
    if (gender === "female") {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    }
    return Math.round(bmr * activity);
}

function updateMifflinDisplay() {
    const weight = parseFloat(document.getElementById("userWeight")?.value) || 70;
    const height = parseFloat(document.getElementById("userHeight")?.value) || 170;
    const age = parseFloat(document.getElementById("userAge")?.value) || 30;
    const gender = document.getElementById("userGender")?.value || "female";
    const activity = parseFloat(document.getElementById("userActivity")?.value) || 1.2;
    
    if (weight <= 0 || height <= 0 || age <= 0) {
        document.getElementById("mifflinResult").innerHTML = "❓ Введите корректные данные";
        return;
    }
    
    const dailyCalories = calculateMifflin(weight, height, age, gender, activity);
    document.getElementById("mifflinResult").innerHTML = `🔥 <strong>Ваша дневная норма калорий:</strong> ${dailyCalories} ккал`;
    
    if (lastCreatedResult) {
        const chocCal = lastCreatedResult.calories;
        const percentOfDaily = (chocCal / dailyCalories * 100).toFixed(1);
        let recommendation = "";
        if (chocCal <= dailyCalories * 0.1) {
            recommendation = "✅ Отлично! Это ~10% дневной нормы. Можно съесть спокойно.";
        } else if (chocCal <= dailyCalories * 0.2) {
            recommendation = "⚠️ Это ~20% дневной нормы. Лучше съесть половину сегодня.";
        } else {
            recommendation = "🔴 Внимание! Это >20% нормы. Рекомендуем разделить на 2-3 дня.";
        }
        document.getElementById("chocolateNorm").innerHTML = `🍫 <strong>Ваша плитка:</strong> ${chocCal} ккал (${percentOfDaily}% от нормы)<br>${recommendation}`;
    } else {
        document.getElementById("chocolateNorm").innerHTML = `🍫 Создайте шоколад, чтобы узнать его долю в вашей норме!`;
    }
}

// Кнопка объяснения формулы
const explainBtn = document.getElementById("explainMifflinBtn");
const explanationDiv = document.getElementById("mifflinExplanation");
if (explainBtn) {
    explainBtn.addEventListener("click", () => {
        if (explanationDiv.style.display === "none") {
            explanationDiv.style.display = "block";
            explainBtn.textContent = "📖 Скрыть объяснение";
        } else {
            explanationDiv.style.display = "none";
            explainBtn.textContent = "📖 Что это за формула?";
        }
    });
}

// ========== ФУНКЦИИ ШОКОЛАДА ==========
function getBaseNutrition(chocolateType) {
    if (chocolateType.includes("ТЁМНЫЙ")) return { calories: 540, protein: 6.5, fat: 34, carbs: 48 };
    if (chocolateType.includes("МОЛОЧНЫЙ")) return { calories: 520, protein: 7.2, fat: 31, carbs: 55 };
    if (chocolateType.includes("БЕЛЫЙ")) return { calories: 528, protein: 5.9, fat: 33, carbs: 57 };
    if (chocolateType.includes("МЕГА")) return { calories: 680, protein: 8.5, fat: 44, carbs: 62 };
    if (chocolateType.includes("ПУСТАЯ")) return { calories: 10, protein: 0.1, fat: 0.1, carbs: 0.5 };
    return { calories: 530, protein: 6.8, fat: 32, carbs: 52 };
}

function applyAiryFactor(nutrition, isAiryFlag, chocolateType) {
    if (isAiryFlag && (chocolateType.includes("БЕЛЫЙ") || chocolateType.includes("МОЛОЧНЫЙ"))) {
        return {
            calories: Math.round(nutrition.calories * 0.92),
            protein: +(nutrition.protein * 0.92).toFixed(1),
            fat: +(nutrition.fat * 0.9).toFixed(1),
            carbs: +(nutrition.carbs * 0.93).toFixed(1)
        };
    }
    return { ...nutrition };
}

function getWeightBySize(size) {
    return size === 4 ? 40 : size === 8 ? 80 : 150;
}

function calculateTotalNutrition(chocolateType, size, isAiryFlag) {
    const basePer100g = getBaseNutrition(chocolateType);
    const airyAdjusted = applyAiryFactor(basePer100g, isAiryFlag, chocolateType);
    const weightGrams = getWeightBySize(size);
    
    let total = {
        calories: (airyAdjusted.calories * weightGrams) / 100,
        protein: (airyAdjusted.protein * weightGrams) / 100,
        fat: (airyAdjusted.fat * weightGrams) / 100,
        carbs: (airyAdjusted.carbs * weightGrams) / 100
    };
    
    additivesList.filter(a => a.selected).forEach(add => {
        total.calories += add.caloriesPer50g;
        total.protein += add.protein;
        total.fat += add.fat;
        total.carbs += add.carbs;
    });
    
    return {
        calories: Math.round(total.calories),
        protein: total.protein.toFixed(1),
        fat: total.fat.toFixed(1),
        carbs: total.carbs.toFixed(1)
    };
}

function updateNutritionDisplay(nutrition) {
    if (!nutritionGrid) return;
    const items = nutritionGrid.querySelectorAll(".nutrition-item");
    if (items.length >= 4) {
        items[0].innerHTML = `🔥 ${nutrition.calories} <span>ккал</span>`;
        items[1].innerHTML = `🥩 ${nutrition.protein} <span>г белков</span>`;
        items[2].innerHTML = `🧈 ${nutrition.fat} <span>г жиров</span>`;
        items[3].innerHTML = `🍚 ${nutrition.carbs} <span>г углеводов</span>`;
    }
}

function determineChocolateType() {
    const cocoa = getIngredientValue("cocoa");
    const sugar = getIngredientValue("sugar");
    const milk = getIngredientValue("milk");
    const butter = getIngredientValue("cocoaButter");
    
    const isWhite = (cocoa === 0) && (sugar >= 1) && (milk >= 1) && (butter >= 1);
    const isMilk = (cocoa >= 1) && (milk >= 1) && (butter >= 1);
    const isDark = (cocoa === 2) && (sugar <= 1) && (milk <= 1);
    
    if (isAiry && (isWhite || isMilk)) {
        if (isWhite) return "БЕЛЫЙ ВОЗДУШНЫЙ ШОКОЛАД";
        if (isMilk) return "МОЛОЧНЫЙ ВОЗДУШНЫЙ ШОКОЛАД";
    }
    
    if (isWhite) return "БЕЛЫЙ ШОКОЛАД";
    if (isMilk) return "МОЛОЧНЫЙ ШОКОЛАД";
    if (isDark) return "ТЁМНЫЙ ШОКОЛАД";
    if (cocoa === 0 && sugar === 0 && milk === 0 && butter === 0) return "ПУСТАЯ ФОРМА 🧪";
    if (cocoa === 2 && sugar === 2 && milk === 2 && butter === 2) return "МЕГА-ШОКОЛАД 🌟";
    return "КЛАССИЧЕСКИЙ ШОКОЛАД 🍫";
}

function getIngredientValue(id) {
    const ing = ingredients.find(i => i.id === id);
    return ing ? ing.value : 0;
}

function isCentrifugeAvailable() {
    const type = determineChocolateType();
    return (type.includes("БЕЛЫЙ") || type.includes("МОЛОЧНЫЙ")) && !type.includes("ТЁМНЫЙ");
}

function updateCentrifugeUI() {
    const available = isCentrifugeAvailable();
    if (available) {
        centrifugeBlock.classList.remove("inactive");
        centrifugeBtn.disabled = false;
    } else {
        centrifugeBlock.classList.add("inactive");
        centrifugeBtn.disabled = true;
        if (isAiry) {
            isAiry = false;
            airStatusSpan.innerText = "❄️ Без насыщения (недоступно)";
        } else {
            airStatusSpan.innerText = "❄️ Без насыщения";
        }
    }
}

function resetCoolingAndFinish() {
    isCooled = false;
    finalResult = null;
    if (nutritionBlock) nutritionBlock.style.display = "none";
    updatePreview();
}

function updatePreview() {
    if (!isCooled) {
        resultBox.innerHTML = `
            <div style="opacity:0.7; font-size:2rem;">🧊❄️</div>
            <div style="font-size:1.2rem;">Шоколад не охлаждён</div>
            <div>Поместите смесь в холодильник!</div>
        `;
        return;
    }
    if (!finalResult) {
        resultBox.innerHTML = `
            <div style="font-size:3rem;">🍫🤷</div>
            <div>Нажми "ГОТОВО" чтобы узнать результат</div>
        `;
        return;
    }
    
    let additivesText = "";
    const selectedAdds = additivesList.filter(a => a.selected);
    if (selectedAdds.length > 0) {
        additivesText = `<div style="font-size:0.85rem; margin-top:8px;">➕ Начинка: ${selectedAdds.map(a => a.name).join(", ")}</div>`;
    }
    if (isAiry && (finalResult.name.includes("БЕЛЫЙ") || finalResult.name.includes("МОЛОЧНЫЙ"))) {
        additivesText += `<div style="font-size:0.85rem;">💨 Воздушная текстура (-8% калорий)</div>`;
    }
    
    resultBox.innerHTML = `
        <div class="chocolate-name">${finalResult.name}</div>
        <div style="font-size:0.9rem;">📦 Размер: ${finalResult.size} кусочков (${getWeightBySize(finalResult.size)}г)</div>
        <div style="margin-top:10px;">🍫✨ Готово! ✨🍫</div>
        ${additivesText}
    `;
}

function renderSliders() {
    slidersContainer.innerHTML = "";
    ingredients.forEach(ing => {
        const div = document.createElement("div");
        div.className = "slider-item";
        div.innerHTML = `
            <span style="font-size:1.3rem;">${ing.emoji}</span>
            <span style="min-width:100px; font-weight:bold;">${ing.name}</span>
            <input type="range" min="0" max="2" step="1" value="${ing.value}" class="slider-input" data-id="${ing.id}">
            <div class="slider-value">
                ${ing.value === 0 ? "нет" : ing.value === 1 ? "средне" : "много"}
            </div>
        `;
        slidersContainer.appendChild(div);
    });
    
    document.querySelectorAll(".slider-input").forEach(slider => {
        slider.addEventListener("input", (e) => {
            const id = slider.getAttribute("data-id");
            const ing = ingredients.find(i => i.id === id);
            if (ing) {
                ing.value = parseInt(slider.value);
                const valueDiv = slider.parentElement.querySelector(".slider-value");
                if (valueDiv) {
                    valueDiv.textContent = ing.value === 0 ? "нет" : ing.value === 1 ? "средне" : "много";
                }
                resetCoolingAndFinish();
                updateCentrifugeUI();
            }
        });
    });
}

function renderAdditives() {
    additivesContainer.innerHTML = "";
    additivesList.forEach(add => {
        const card = document.createElement("div");
        card.className = `additive-card ${add.selected ? "selected" : ""}`;
        card.innerHTML = `
            <span class="additive-emoji">${add.emoji}</span>
            <span>${add.name}</span>
            <span style="font-size:0.7rem;">(+50г)</span>
        `;
        card.addEventListener("click", () => {
            add.selected = !add.selected;
            renderAdditives();
            resetCoolingAndFinish();
        });
        additivesContainer.appendChild(card);
    });
}

// ========== ОБРАБОТЧИКИ ==========
centrifugeBtn.addEventListener("click", () => {
    if (!isCentrifugeAvailable()) {
        alert("🌀 Центрифуга доступна только для белого или молочного шоколада!");
        return;
    }
    isAiry = !isAiry;
    airStatusSpan.innerText = isAiry ? "💨 СМЕСЬ НАСЫЩЕНА ВОЗДУХОМ! 💨" : "❄️ Без насыщения";
    resetCoolingAndFinish();
});

fridgeBtn.addEventListener("click", () => {
    if (!isCooled) {
        animateSnow();
        isCooled = true;
        updatePreview();
    }
});

finishBtn.addEventListener("click", () => {
    if (!isCooled) {
        alert("❄️ Сначала помести шоколад в холодильник!");
        return;
    }
    const type = determineChocolateType();
    const nutrition = calculateTotalNutrition(type, currentSize, isAiry);
    finalResult = {
        name: type,
        size: currentSize,
        calories: nutrition.calories,
        protein: nutrition.protein,
        fat: nutrition.fat,
        carbs: nutrition.carbs
    };
    lastCreatedResult = finalResult;
    
    if (nutritionBlock) {
        nutritionBlock.style.display = "block";
        updateNutritionDisplay(nutrition);
        updateMifflinDisplay();
    }
    
    updatePreview();
});

sizeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        currentSize = parseInt(btn.getAttribute("data-size"));
        sizeBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        resetCoolingAndFinish();
    });
});

// Инициализация слушателей для формы Миффлина
function initMifflinListeners() {
    const inputs = ["userWeight", "userHeight", "userAge", "userGender", "userActivity"];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("input", updateMifflinDisplay);
    });
}

// ========== АНИМАЦИЯ СНЕЖИНОК ==========
function animateSnow() {
    const btn = fridgeBtn;
    if (!btn) return;
    
    const snowContainer = document.createElement("div");
    snowContainer.className = "snow-animation";
    
    for (let i = 0; i < 12; i++) {
        const snowflake = document.createElement("div");
        snowflake.className = "snowflake-anim";
        snowflake.textContent = ["❄️", "❄️", "💧", "✨"][Math.floor(Math.random() * 4)];
        
        const tx = (Math.random() - 0.5) * 80;
        const ty = -40 - Math.random() * 30;
        snowflake.style.setProperty("--tx", tx + "px");
        snowflake.style.setProperty("--ty", ty + "px");
        snowflake.style.left = (Math.random() * 90) + "%";
        snowflake.style.top = "50%";
        snowflake.style.animationDelay = (Math.random() * 0.3) + "s";
        
        snowContainer.appendChild(snowflake);
    }
    
    btn.style.position = "relative";
    btn.appendChild(snowContainer);
    
    setTimeout(() => {
        snowContainer.remove();
    }, 1000);
}

// ========== СЕКРЕТНЫЕ ФАКТЫ ==========
const secretChocolate = document.getElementById("secretChocolate");
const factModal = document.getElementById("factModal");
const factClose = document.querySelector(".fact-close");
const factText = document.getElementById("factText");

function showRandomFact() {
    const randomIndex = Math.floor(Math.random() * chocolateFacts.length);
    factText.innerHTML = chocolateFacts[randomIndex];
    factModal.style.display = "flex";
}

factClose.addEventListener("click", () => {
    factModal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === factModal) {
        factModal.style.display = "none";
    }
});

secretChocolate.addEventListener("click", showRandomFact);

// ========== ИНИЦИАЛИЗАЦИЯ ==========
function init() {
    renderSliders();
    renderAdditives();
    updateCentrifugeUI();
    isAiry = false;
    isCooled = false;
    finalResult = null;
    lastCreatedResult = null;
    if (nutritionBlock) nutritionBlock.style.display = "none";
    updatePreview();
    document.querySelector(".size-btn[data-size='8']").classList.add("active");
    initMifflinListeners();
    updateMifflinDisplay();
}

init();