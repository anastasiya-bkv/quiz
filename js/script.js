const quiz = document.getElementById("quiz");
const btnQuiz = document.getElementById("btn-quiz");
const results = document.getElementById("results");
const resultsText = document.getElementById("results-text");

const quizList = [
  {
    question: "Как переводится слово 'sound'?",
    answers: ["тишина", "звук", "слово", "красота"],
    rightAnswer: "1",
    type: "single",
  },
  {
    question: "Как переводится слово 'like'?",
    answers: ["свобода", "нравится", "как", "гром"],
    rightAnswer: ["1", "2"],
    type: "multi",
  },
];

const answers = [];

const addActiveClass = (elem) => {
  elem.classList.add("active");
};

const removeActiveClass = (elem) => {
  elem.classList.remove("active");
};

const refreshCanSubmit = () => {
  if (answers.filter(Boolean).length === quizList.length) {
    btnQuiz.disabled = false;
  } else {
    btnQuiz.disabled = true;
  }
};

const answerClick = (e) => {
  const quizItem = e.target.closest(".quiz__item");
  const type = quizItem.dataset.type;
  const answer = e.target.dataset.index;
  const quizItemIndex = quizItem.dataset.index;
  if (type === "single") {
    if (answers[quizItemIndex]) {
      const activeItem = quizItem.querySelector(".quiz__answers__item.active");
      removeActiveClass(activeItem);
    }
    answers[quizItemIndex] = answer;
    addActiveClass(e.currentTarget);
  } else if (type === "multi") {
    const currentQuestionAnswers = answers[quizItemIndex] || [];
    const answerWasActive = currentQuestionAnswers.includes(answer);
    const newAnswers = answerWasActive
      ? currentQuestionAnswers.filter((x) => x !== answer)
      : [...currentQuestionAnswers, answer];
    if (newAnswers.length) {
      answers[quizItemIndex] = newAnswers;
    } else {
      delete answers[quizItemIndex];
    }
    if (answerWasActive) {
      removeActiveClass(e.currentTarget);
    } else {
      addActiveClass(e.currentTarget);
    }
  }
  refreshCanSubmit();
};

const createQuizAnswers = (answers) => {
  let quizAnswers = [];
  answers.forEach((answer, index) => {
    const answerItem = document.createElement("div");
    answerItem.className = "quiz__answers__item";
    answerItem.dataset.index = index;
    answerItem.innerHTML = answer;
    answerItem.addEventListener("click", answerClick);
    quizAnswers.push(answerItem);
  });
  return quizAnswers;
};

const createQuizItem = (item, index) => {
  const quizItem = document.createElement("div");
  quizItem.className = "quiz__item";
  quizItem.dataset.type = item.type;
  quizItem.dataset.index = index;
  quizItem.innerHTML = `
  <h3 class="quiz__quiestion">${item.question}</h3>
  `;
  const quizAnswers = document.createElement("div");
  quizAnswers.className = "quiz__answers";
  const quizAnswerList = createQuizAnswers(item.answers);
  quizAnswerList.forEach((answer) => {
    quizItem.append(answer);
  });

  quiz.insertBefore(quizItem, btnQuiz);
};

const renderQuiz = (quiz) => {
  quiz.forEach((item, index) => {
    createQuizItem(item, index);
  });
};

const calcRightAnswers = () => {
  let rightAnswers = 0;
  answers.forEach((answer, index) => {
    const rightAnswer = quizList[index].rightAnswer;
    if (quizList[index].type === "single") {
      if (rightAnswer === answer) {
        rightAnswers++;
      }
    } else if (quizList[index].type === "multi") {
      const checkAnswer = rightAnswer.every((element, index, array) => {
        return answer.includes(element);
      });
      if (checkAnswer && rightAnswer.length === answer.length) {
        rightAnswers++;
      }
    }
  });
  return rightAnswers;
};

btnQuiz.addEventListener("click", () => {
  const rightAnswers = calcRightAnswers();
  resultsText.textContent = `${rightAnswers} правильных ответов из ${quizList.length}`;
  quiz.classList.add("hidden");
  results.classList.remove("hidden");
});

const init = () => {
  renderQuiz(quizList);
  results.classList.add("hidden");
  btnQuiz.disabled = true;
};

init();
