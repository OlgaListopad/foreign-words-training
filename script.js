// Получаем все элементы карточек
const flipCards = document.querySelectorAll('.flip-card');

let currentCardIndex = 0;

// Массив объектов карточек
const cards = [{
        word: 'apple',
        translation: 'яблоко',
        example: 'apples are rich with vitamin C',
    },
    {
        word: 'street',
        translation: 'улица',
        example: 'I live on a quiet street',
    },
    {
        word: 'home',
        translation: 'дом',
        example: 'Make yourself at home',
    },
    {
        word: 'cat',
        translation: 'кот',
        example: 'The cat is sleeping on the mat',
    },
    {
        word: 'popcorn',
        translation: 'попкорн',
        example: "Let's watch a movie and eat popcorn",
    },
];

// Навигационные кнопки "Назад" и "Вперед"
const backButton = document.querySelector('#back');
const nextButton = document.querySelector('#next');

// Элементы карточки (лицо и обратная сторона)
const cardFrontElement = document.querySelector('#card-front h1');
const cardBackWordElement = document.querySelector('#card-back h1');
const cardBackExampleElement = document.querySelector('#card-back span');

// Функция для обновления текущей активной карточки
function updateActiveCard() {
    const activeCard = cards[currentCardIndex];
    cardFrontElement.textContent = activeCard.word;
    cardBackWordElement.textContent = activeCard.translation;
    cardBackExampleElement.textContent = activeCard.example;

    // Отключаем кнопку "Назад", если текущая карточка первая, и кнопку "Вперед", если текущая карточка последняя
    backButton.disabled = currentCardIndex === 0;
    nextButton.disabled = currentCardIndex === cards.length - 1;

    const currentWordElement = document.querySelector('#current-word');
    currentWordElement.textContent = `Слово ${currentCardIndex + 1}`;
}

// Добавляем обработчик клика для каждой карточки для переворота
flipCards.forEach((card) => {
    card.addEventListener('click', () => {
        card.classList.toggle('active');
    });
});

// Обработчик кнопки "Назад"
backButton.addEventListener('click', () => {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        updateActiveCard();
    }
});

// Обработчик кнопки "Вперед"
nextButton.addEventListener('click', () => {
    if (currentCardIndex < cards.length - 1) {
        currentCardIndex++;
        updateActiveCard();
    }
});

// Инициализация активной карточки
updateActiveCard();

// Начало теста по карточкам
const examButton = document.querySelector('#exam');
const sliderCard = document.querySelector('.slider');

// Добавляем обработчик на кнопку начала теста
examButton.addEventListener('click', startExam);

let correctAnswersCount = 0;

// Функция запуска теста
function startExam() {
    // Скрываем элементы учебного режима и показываем элементы тестового режима
    const studyModeElement = document.querySelector('#study-mode');
    const examModeElement = document.querySelector('#exam-mode');
    const contentElement = document.querySelector('#exam-cards');

    studyModeElement.classList.add('hidden');
    examModeElement.classList.remove('hidden');
    backButton.classList.add('hidden');
    nextButton.classList.add('hidden');
    examButton.classList.add('hidden');
    sliderCard.classList.add('hidden');

    // Создаем копию массива карточек и перемешиваем их случайным образом
    const randomizedCards = cards.slice();
    randomizedCards.sort(() => Math.random() - 0.5);

    // Создаем DocumentFragment для множественной вставки элементов карточек
    const fragment = document.createDocumentFragment();

    // Создаем элементы карточек для теста и добавляем их в контейнер
    randomizedCards.forEach((card) => {
        const cardWordElement = createCardElement(card.translation, card.word);
        const cardTranslationElement = createCardElement(card.word, card.translation);
        fragment.append(cardWordElement);
        fragment.append(cardTranslationElement);
    });

    // Вставляем DocumentFragment в контейнер
    contentElement.append(fragment);

}

// Первая кликнутая карточка
let firstClickedCard = null;

// Функция для создания элемента карточки
function createCardElement(word, translation) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');

    const wordElement = document.createElement('div');
    wordElement.classList.add('card-word');
    wordElement.textContent = word;

    const translationElement = document.createElement('div');
    translationElement.classList.add('card-translation');
    translationElement.textContent = translation;

    cardElement.append(wordElement);
    cardElement.append(translationElement);
    translationElement.classList.add('hidden');

    // Добавляем обработчик клика для карточки
    cardElement.addEventListener('click', () => {
        // Если первая кликнутая карточка не задана, то устанавливаем текущую как первую кликнутую
        if (firstClickedCard === null) {
            firstClickedCard = cardElement;
            // Первая карточка всегда "правильная", а вот вторая не всегда
            firstClickedCard.classList.add('correct');
        } else {
            // Получаем текст слов и переводов для сравнения
            const firstCardWord = firstClickedCard.querySelector('.card-word').textContent;
            const secondCardWord = cardElement.querySelector('.card-word').textContent;
            const firstCardTranslation = firstClickedCard.querySelector('.card-translation').textContent;
            const secondCardTranslation = cardElement.querySelector('.card-translation').textContent;

            // Проверяем, совпадают ли слова и переводы
            if (
                (firstCardWord === secondCardTranslation && firstCardTranslation === secondCardWord) ||
                (firstCardTranslation === secondCardWord && firstCardWord === secondCardTranslation)
            ) {
                cardElement.classList.add('correct');
                // Если слова и переводы совпадают, добавляем классы анимации и очищаем первую кликнутую карточку
                firstClickedCard.classList.add('fade-out');
                cardElement.classList.add('fade-out');
                firstClickedCard = null;
                correctAnswersCount++;
                if (correctAnswersCount === cards.length) {
                    setTimeout(() => { alert("Экзамен пройден!"); }, 500);
                }

            } else {
                // Если слова и переводы не совпадают, добавляем класс анимации ошибки и через некоторое время удаляем его, а также очищаем первую кликнутую карточку
                cardElement.classList.add('wrong');

                setTimeout(() => {
                    cardElement.classList.remove('wrong');
                    firstClickedCard.classList.remove('correct');
                    firstClickedCard = null;
                }, 500);
            }
        }
    });

    return cardElement;
}
