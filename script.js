/*******************************
 ******** QUIZ CONTROLLER *******
 *******************************/

let quizController = (function () {

    // *** Question Constructor ***
    function Question(id, questionText, options, correnctAnswer) {
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correnctAnswer = correnctAnswer;
    };

    let questionLocalStorage = {
        setQuestionCollection: function (newCollection) {
            localStorage.setItem('questionCollection', JSON.stringify(newCollection));
        },
        getQuestionCollection: function () {
            return JSON.parse(localStorage.getItem('questionCollection'));
        },
        removeQuestionCollection: function () {
            localStorage.removeItem('questionCollection')
        }
    };
    if (questionLocalStorage.getQuestionCollection() === null) {
        questionLocalStorage.setQuestionCollection([]);
    }

    let quizProgress = {
        questionIndex: 0
    }

    // *** Person Constructor ***

    function Person(id, firstname, lastname, score) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.score = score;
    }

    let currPersonData = {
        fullname: [],
        score: 0
    };

    let adminFullName = ['John', 'Smith'];

    let personLocalStorage = {
        setPersonData: function (newPersonData) {
            localStorage.setItem('personData', JSON.stringify(newPersonData));
        },
        getPersonData: function () {
            return JSON.parse(localStorage.getItem('personData'));
        },
        removePersonData: function () {
            localStorage.removeItem('personData');
        }
    };

    if (personLocalStorage.getPersonData() === null) {
        personLocalStorage.setPersonData([]);
    }

    return {

        getPersonLocalStorage: personLocalStorage,

        getQuizProgress: quizProgress,

        getQuestionLocalStorage: questionLocalStorage,

        addQuestionOnLocalStorage: function (newQuestionText, opts, addInputsDyn) {
            let optionsArr, corrAns, questionId, newQuestion, getStoredQuestions, isChecked;

            optionsArr = [];
            isChecked = false;


            for (let i = 0; i < opts.length; i++) {
                if (opts[i].value !== "") {
                    optionsArr.push(opts[i].value);
                }
                if (opts[i].previousElementSibling.checked && opts[i].value !== "") {
                    corrAns = opts[i].value;
                    isChecked = true;
                }
            }

            // [ {id:} ]
            if (questionLocalStorage.getQuestionCollection().length > 0) {
                questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;
            } else {
                questionId = 0;
            }

            if (newQuestionText.value !== "") {

                if (optionsArr.length > 1) {

                    if (isChecked) {

                        newQuestion = new Question(questionId, newQuestionText.value, optionsArr, corrAns);

                        getStoredQuestions = questionLocalStorage.getQuestionCollection();

                        getStoredQuestions.push(newQuestion);

                        questionLocalStorage.setQuestionCollection(getStoredQuestions);

                        newQuestionText.value = "";
                        for (let i = 0; i < opts.length; i++) {

                            opts[i].value = "";
                            opts[i].previousElementSibling.checked = false;
                            if (i > 1) {
                                opts[i].parentElement.remove();
                            }
                        }
                        addInputsDyn();
                        return true;
                    } else {
                        alert('Check the correct answer');
                        return false;
                    }

                } else {
                    alert('Please insert at least 2 options');
                    return false;
                }
            } else {
                alert('Please insert question');
                return false;
            }
        },

        checkAnswer: function (answer) {

            if (questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correnctAnswer === answer.textContent) {

                currPersonData.score++;

                return true;

            } else {

                return false;

            }
        },

        isFinished: function () {

            return quizProgress.questionIndex + 1 === questionLocalStorage.getQuestionCollection().length;

        },

        addPerson: function () {

            let newPerson, personId, personData;

            if (personLocalStorage.getPersonData().length > 0) {

                personId = personLocalStorage.getPersonData()[personLocalStorage.getPersonData().length - 1].id + 1;

            } else {

                personId = 0;

            }

            newPerson = new Person(personId, currPersonData.fullname[0], currPersonData.fullname[1], currPersonData.score);

            personData = personLocalStorage.getPersonData();

            personData.push(newPerson);

            personLocalStorage.setPersonData(personData);



        },

        getCurrPersonData: currPersonData,

        getAdminFullName: adminFullName
    };

})();

/*******************************
 ******** UI CONTROLLER *********
 *******************************/

let UIController = (function () {

    let domItems = {
        // *** Admin Panel Elements ***
        adminPanelSection: document.querySelector(".admin-panel-container"),
        questInsertButton: document.getElementById("question-insert-btn"),
        newQuestionText: document.getElementById("new-question-text"),
        adminOptions: document.querySelectorAll(".admin-option"),
        adminOptionsContainer: document.querySelector(".admin-options-container"),
        insertedQuestionsWrapper: document.querySelector(".inserted-questions-wrapper"),
        questionUpdateBtn: document.getElementById("question-update-btn"),
        questionDeleteBtn: document.getElementById("question-delete-btn"),
        questionsClearBtn: document.getElementById("questions-clear-btn"),
        resultListWrapper: document.querySelector(".results-list-wrapper"),
        clearResultsBtn: document.getElementById("results-clear-btn"),
        // *** Quiz Panel Elements ***
        quizSection: document.querySelector(".quiz-container"),
        askedQuestionText: document.getElementById("asked-question-text"),
        quizOptionsWrapper: document.querySelector(".quiz-options-wrapper"),
        progressBar: document.querySelector("#progress"),
        instantAnswerContainer: document.querySelector(".instant-answer-container"),
        instantAnswerText: document.getElementById("instant-answer-text"),
        instantAnswerDiv: document.getElementById("instant-answer-wrapper"),
        emotionIcon: document.getElementById("emotion"),
        nextQuestionBtn: document.getElementById("next-question-btn"),
        // *** Landing Page Elements ***
        landingPageSection: document.querySelector(".landing-page-container"),
        startQuizBtn: document.getElementById("start-quiz-btn"),
        firstNameInput: document.getElementById("firstname"),
        lastNameInput: document.getElementById("lastname"),
        // *** Final Result Section Elements***
        finalResultSection: document.querySelector(".final-result-container"),
        finalScoreText: document.getElementById("final-score-text")

    };
    return {
        getDomItems: domItems,
        addInputsDynamically: function () {
            let addInput = function () {
                let inputHTML, z;
                z = document.querySelectorAll(".admin-option").length;
                inputHTML =
                    `<div class="admin-option-wrapper">
                    <input type="radio" class="admin-option-${z}" name="answer" value="${z}">
                    <input type="text" class="admin-option admin-option-${z}" value="">
                    </div>`;
                domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);

                domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);
                domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput)
            }
            domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput)
        },
        createQuestionList: function (getQuestions) {
            let questionHTML;
            domItems.insertedQuestionsWrapper.innerHTML = "";

            for (let i = 0; i < getQuestions.length; i++) {

                questionHTML = `<p><span>${i+1}. ${getQuestions[i].questionText}</span><button id="question-${getQuestions[i].id}">Edit</button></p>`;
                let div = document.createElement('div');
                div.innerHTML = questionHTML;
                domItems.insertedQuestionsWrapper.insertAdjacentElement('afterbegin', div);
            }
        },

        editQuestionList: function (event, sotrageQuestionList, addInputsDynamically, updateQuestionListFn) {
            let getID, getStorageQuestionList, foundItem, placeInArray, optionHTML;

            if ('question-'.indexOf(event.target.id)) {
                getID = parseInt(event.target.id.split('-')[1]);

                getStorageQuestionList = sotrageQuestionList.getQuestionCollection();
                for (let i = 0; i < getStorageQuestionList.length; i++) {
                    if (getStorageQuestionList[i].id === getID) {
                        foundItem = getStorageQuestionList[i];
                        placeInArray = i;

                    }
                }
                domItems.newQuestionText.value = foundItem.questionText;
                domItems.adminOptionsContainer.innerHTML = "";
                optionHTML = ""

                for (let i = 0; i < foundItem.options.length; i++) {
                    optionHTML +=
                        `<div class="admin-option-wrapper">
                        <input type="radio" class="admin-option-${i}" name="answer" value="${i}">
                        <input type="text" class="admin-option admin-option-${i}" value="${foundItem.options[i]}">
                        </div>`;
                }
                domItems.adminOptionsContainer.innerHTML = optionHTML;
                domItems.questionUpdateBtn.style.visibility = 'visible';
                domItems.questionDeleteBtn.style.visibility = 'visible';
                domItems.questInsertButton.style.visibility = 'hidden';
                domItems.questionsClearBtn.style.pointerEvents = 'none';

                addInputsDynamically();

                let backDeafaultView = function (optionsEls) {
                    domItems.newQuestionText.value = "";
                    for (let i = 0; i < optionsEls.length; i++) {

                        optionsEls[i].value = "";
                        optionsEls[i].previousElementSibling.checked = false;
                        if (i > 1) {
                            optionsEls[i].parentElement.remove();
                        }
                    }

                    domItems.questionUpdateBtn.style.visibility = 'hidden';
                    domItems.questionDeleteBtn.style.visibility = 'hidden';
                    domItems.questInsertButton.style.visibility = 'visible';
                    domItems.questionsClearBtn.style.pointerEvents = '';

                    updateQuestionListFn(getStorageQuestionList);
                    addInputsDynamically();
                }

                let updateQuestion = function () {
                    let newOptions, optionsEls;

                    newOptions = [];
                    optionsEls = document.querySelectorAll(".admin-option");

                    foundItem.questionText = domItems.newQuestionText.value;
                    foundItem.correnctAnswer = '';
                    for (let i = 0; i < optionsEls.length; i++) {
                        if (optionsEls[i].value !== '') {
                            newOptions.push(optionsEls[i].value);
                            if (optionsEls[i].previousElementSibling.checked) {
                                foundItem.correnctAnswer = optionsEls[i].value;
                            }
                        }
                    }
                    foundItem.options = newOptions;

                    if (foundItem.questionText !== '') {
                        if (foundItem.options.length > 1) {
                            if (foundItem.correnctAnswer !== "") {
                                getStorageQuestionList.splice(placeInArray, 1, foundItem);
                                sotrageQuestionList.setQuestionCollection(getStorageQuestionList);

                                backDeafaultView(optionsEls);

                            } else {
                                alert("Check the correct answer");
                            }
                        } else {
                            alert("Insert 2 options");
                        }
                    } else {
                        alert("Please insert question");
                    }
                }

                domItems.questionUpdateBtn.onclick = updateQuestion;


                let deleteQuestion = function () {
                    let optionsEls;
                    optionsEls = document.querySelectorAll(".admin-option");

                    getStorageQuestionList.splice(placeInArray, 1);
                    sotrageQuestionList.setQuestionCollection(getStorageQuestionList);

                    backDeafaultView(optionsEls);
                }
                domItems.questionDeleteBtn.onclick = deleteQuestion;
            };
        },

        clearQuestionList: function (sotrageQuestionList) {
            if (sotrageQuestionList.getQuestionCollection() !== null) {
                if (sotrageQuestionList.getQuestionCollection().length > 0) {
                    let conf = confirm("Warning: You will loose entire list!");
                    if (conf) {
                        sotrageQuestionList.removeQuestionCollection();
                        domItems.insertedQuestionsWrapper.innerHTML = "";
                        sotrageQuestionList.setQuestionCollection([]);
                    }
                }
            }
        },

        displayQuestion: function (sotrageQuestionList, progress) {
            let newOptionHTML;
            if (sotrageQuestionList.getQuestionCollection().length > 0) {

                domItems.askedQuestionText.textContent = sotrageQuestionList.getQuestionCollection()[progress.questionIndex].questionText;

                domItems.quizOptionsWrapper.innerHTML = "";

                for (let i = 0; i < sotrageQuestionList.getQuestionCollection()[progress.questionIndex].options.length; i++) {

                    newOptionHTML = `<div class="choice-${i}"><span class="choice-${i}">${(i + 10).toString(36).toUpperCase()}</span><p class="choice-${i}">${sotrageQuestionList.getQuestionCollection()[progress.questionIndex].options[i]}</p></div>`;

                    domItems.quizOptionsWrapper.insertAdjacentHTML('beforeend', newOptionHTML);
                }

            }
        },

        displayProgress: function (sotrageQuestionList, progress) {

            domItems.progressBar.textContent = `${progress.questionIndex+1}/${sotrageQuestionList.getQuestionCollection().length}`;
            domItems.progressBar.nextElementSibling.value = progress.questionIndex + 1;
            domItems.progressBar.nextElementSibling.max = sotrageQuestionList.getQuestionCollection().length;
        },

        newDesign: function (ansResult, selectedAnswer) {
            let twoOptions, index;

            index = 0;

            if (ansResult) {
                index = 1;
            }

            twoOptions = {
                answerText: ['This is a wrong answer', 'This is a correct answer'],
                answerClass: ['red', 'green'],
                answerImg: ['images/sad.png', 'images/happy.png'],
                optionsSpanBg: ['rgba(200,0,0,0.7', 'rgba(0,250,0,0.2)']
            };

            domItems.quizOptionsWrapper.style.cssText = "opacity: 0.6; pointer-events: none;";

            domItems.instantAnswerContainer.style.opacity = "1";

            domItems.instantAnswerText.textContent = twoOptions.answerText[index];

            domItems.instantAnswerDiv.className = twoOptions.answerClass[index];

            domItems.emotionIcon.setAttribute('src', twoOptions.answerImg[index]);

            selectedAnswer.previousElementSibling.style.backgroundColor = twoOptions.optionsSpanBg[index];

        },

        resetDesign: function () {

            domItems.quizOptionsWrapper.style.cssText = "";

            domItems.instantAnswerContainer.style.opacity = "0";

        },

        getFullName: function (currPerson, sotrageQuestionList, admin) {

            if (domItems.firstNameInput.value !== "" && domItems.lastNameInput.value !== "") {

                if (!(domItems.firstNameInput.value === admin[0] && domItems.lastNameInput.value === admin[1])) {

                    if (sotrageQuestionList.getQuestionCollection().length > 0) {

                        currPerson.fullname.push(domItems.firstNameInput.value);

                        currPerson.fullname.push(domItems.lastNameInput.value);

                        domItems.landingPageSection.style.display = 'none';

                        domItems.quizSection.style.display = 'block';

                    } else {

                        alert("No question perpared, contact with admininstrator");

                    }

                } else {

                    domItems.landingPageSection.style.display = 'none';

                    domItems.adminPanelSection.style.display = 'block';
                };
            } else {

                alert("Please enter Your name and lastname");

            }
        },

        finalResult: function (currPerson) {

            domItems.finalScoreText.textContent = currPerson.fullname[0] + " " + currPerson.fullname[1] + ", Your final score is: " + currPerson.score;

            domItems.quizSection.style.display = "none";

            domItems.finalResultSection.style.display = "block";

        },

        addResultOnPanel: function (userdata) {
            let index, resultHTML;

            domItems.resultListWrapper.innerHTML = "";

            if (userdata.getPersonData().length > 0) {

                index = 1;

                userdata.getPersonData().forEach(element => {

                    resultHTML = `<p class="person person-${index}"><span class="person-${index}"> ${element.firstname} ${element.lastname} - ${element.score} Points</span><button id="delete-result-btn_${element.id}" class="delete-result-btn">Delete</button></p>`;

                    domItems.resultListWrapper.insertAdjacentHTML("beforeend", resultHTML);

                    index++;
                });
            }
        },

        deleteResult: function (event, userData) {
            let getID, personsArr;

            personsArr = userData.getPersonData();

            if ('delete-result-btn_'.indexOf(event.target.id)) {

                getID = parseInt(event.target.id.split("_")[1]);

                for (let i = 0; i < personsArr.length; i++) {

                    if (personsArr[i].id === getID) {

                        personsArr.splice(i, 1);

                        userData.setPersonData(personsArr);

                    }

                }

            }

        },

        clearRelultList: function (userData) {

            let conf = confirm("Warning, You will delete entire list!");

            if (userData.getPersonData() !== null) {
                if (conf) {

                    userData.removePersonData();

                    domItems.resultListWrapper.innerHTML = "";

                }
            }

        }

    };

})();

/*******************************
 ******** CONTROLLER ***********
 *******************************/

let controller = (function (quizCtrl, UICtrl) {
    let selectedDomItems = UICtrl.getDomItems;
    UICtrl.addInputsDynamically();
    UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage.getQuestionCollection());

    selectedDomItems.questInsertButton.addEventListener('click', function () {
        let adminOptions = document.querySelectorAll('.admin-option');
        if (quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, adminOptions, UICtrl.addInputsDynamically)) {

            UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage.getQuestionCollection());
        };
    });

    selectedDomItems.insertedQuestionsWrapper.addEventListener('click', function (e) {
        UIController.editQuestionList(e, quizCtrl.getQuestionLocalStorage, UICtrl.addInputsDynamically, UICtrl.createQuestionList);

    })
    selectedDomItems.questionsClearBtn.addEventListener('click', function () {
        UICtrl.clearQuestionList(quizController.getQuestionLocalStorage)
    });

    UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

    UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

    selectedDomItems.quizOptionsWrapper.addEventListener('click', function (e) {

        let updatedOptionsDiv = selectedDomItems.quizOptionsWrapper.querySelectorAll('div');
        for (let i = 0; i < updatedOptionsDiv.length; i++) {

            if (e.target.className === 'choice-' + i) {

                let answer = document.querySelector('.quiz-options-wrapper div p.' + e.target.className);

                let answerResult = quizCtrl.checkAnswer(answer);

                UICtrl.newDesign(answerResult, answer);

                if (quizCtrl.isFinished()) {
                    selectedDomItems.nextQuestionBtn.textContent = "Finish";
                }

                let nextQuestion = function (questData, progress) {

                    if (quizCtrl.isFinished()) {

                        quizController.addPerson();

                        UICtrl.finalResult(quizController.getCurrPersonData);

                    } else {

                        UICtrl.resetDesign();

                        quizCtrl.getQuizProgress.questionIndex++;

                        UICtrl.displayQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

                        UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

                    }

                }

                selectedDomItems.nextQuestionBtn.onclick = function () {
                    nextQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

                }
            }
        }
    });

    selectedDomItems.startQuizBtn.addEventListener('click', function () {

        UICtrl.getFullName(quizCtrl.getCurrPersonData, quizController.getQuestionLocalStorage, quizController.getAdminFullName);

    });

    selectedDomItems.lastNameInput.addEventListener('focus', function () {

        selectedDomItems.lastNameInput.addEventListener('keypress', function (e) {

            if (e.keyCode === 13) {

                UICtrl.getFullName(quizCtrl.getCurrPersonData, quizController.getQuestionLocalStorage, quizController.getAdminFullName);

            }
        })

    });

    UICtrl.addResultOnPanel(quizController.getPersonLocalStorage);

    selectedDomItems.resultListWrapper.addEventListener('click', function (e) {

        UICtrl.deleteResult(e, quizCtrl.getPersonLocalStorage);

        UICtrl.addResultOnPanel(quizController.getPersonLocalStorage);

    });

    selectedDomItems.clearResultsBtn.addEventListener('click', function () {

        UICtrl.clearRelultList(quizCtrl.getPersonLocalStorage);

    })

})(quizController, UIController);