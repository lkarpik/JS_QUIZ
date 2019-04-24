/*******************************
******** QUIZ CONTROLLER *******
*******************************/

let quizController = (function() {

    // *** Question Constructor ***
    function Question(id, questionText, options, correnctAnswer) {
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correnctAnswer = correnctAnswer; 
    };

    let questionLocalStorage = {
        setQuestionCollection: function(newCollection){
            localStorage.setItem('questionCollection', JSON.stringify(newCollection));
        },
        getQuestionCollection: function(){
            return JSON.parse(localStorage.getItem('questionCollection'));
        },
        removeQuestionCollection: function() {
            localStorage.removeItem('questionCollection')
        }
    };
    if(questionLocalStorage.getQuestionCollection() === null) {
        questionLocalStorage.setQuestionCollection([]);
    }

    return {
        addQuestionOnLocalStorage: function(newQuestionText, opts, addInputsDyn) {
            let optionsArr, corrAns, questionId, newQuestion, getStoredQuestions, isChecked;
            
            optionsArr = [];
            isChecked = false;
            
            
            for(let i = 0; i< opts.length; i++) {
                if(opts[i].value !== ""){
                    optionsArr.push(opts[i].value);
                }
               if(opts[i].previousElementSibling.checked && opts[i].value !=="") {
                corrAns = opts[i].value;
                isChecked = true;
               }
            }
            
            // [ {id:} ]
            if(questionLocalStorage.getQuestionCollection().length > 0) {
                questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length-1].id +1;
            } else {
                questionId = 0;
            }

            if(newQuestionText.value !== "") {
                
                if(optionsArr.length > 1){
                    
                    if(isChecked){
                        
                        newQuestion = new Question(questionId, newQuestionText.value, optionsArr, corrAns);

                        getStoredQuestions = questionLocalStorage.getQuestionCollection();
            
                        getStoredQuestions.push(newQuestion);
            
                        questionLocalStorage.setQuestionCollection(getStoredQuestions);
            
                        newQuestionText.value = "";
                        for(let i = 0; i < opts.length; i++){
                            
                            opts[i].value = "";
                            opts[i].previousElementSibling.checked = false;
                            if(i>1){
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
        
        getQuestionLocalStorage: questionLocalStorage
    };

})();

/*******************************
******** UI CONTROLLER *********
*******************************/

let UIController = (function() {
    
    let domItems = {
        // *** Admin Panel Elements ***
        questInsertButton: document.getElementById("question-insert-btn"),
        newQuestionText: document.getElementById("new-question-text"),
        adminOptions: document.querySelectorAll(".admin-option"),
        adminOptionsContainer: document.querySelector(".admin-options-container"),
        insertedQuestionsWrapper: document.querySelector(".inserted-questions-wrapper"),
        questionUpdateBtn: document.getElementById("question-update-btn"),
        questionDeleteBtn: document.getElementById("question-delete-btn"),
        questionsClearBtn: document.getElementById("questions-clear-btn")
    };
    return {
        getDomItems: domItems,
        addInputsDynamically: function(){
            let addInput = function(){
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
        createQuestionList: function(getQuestions) {
            let questionHTML;
            domItems.insertedQuestionsWrapper.innerHTML = "";
            
            for(let i = 0; i <getQuestions.length; i++) {
                
                questionHTML = `<p><span>${i+1}. ${getQuestions[i].questionText}</span><button id="question-${getQuestions[i].id}">Edit</button></p>`;
                let div = document.createElement('div');
                div.innerHTML = questionHTML;
                domItems.insertedQuestionsWrapper.insertAdjacentElement('afterbegin', div);
            } 
        },

        editQuestionList: function(event, sotrageQuestionList, addInputsDynamically, updateQuestionListFn) {
            let getID, getStorageQuestionList, foundItem, placeInArray, optionHTML;
            if('question-'.indexOf(event.target.id)) {
                getID = parseInt(event.target.id.split('-')[1]);
                
                getStorageQuestionList = sotrageQuestionList.getQuestionCollection();
                for (let i = 0; i < getStorageQuestionList.length; i++) {
                    if(getStorageQuestionList[i].id === getID){
                        foundItem = getStorageQuestionList[i];
                        placeInArray = i;

                    }
                }
                domItems.newQuestionText.value = foundItem.questionText;
                domItems.adminOptionsContainer.innerHTML = "";
                optionHTML = ""

                for(let i = 0; i < foundItem.options.length; i++){
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

                let backDeafaultView = function(optionsEls) {
                    domItems.newQuestionText.value = "";
                    for(let i = 0; i < optionsEls.length; i++){
                
                        optionsEls[i].value = "";
                        optionsEls[i].previousElementSibling.checked = false;
                        if(i>1){
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
                
                let updateQuestion = function() {
                    let newOptions, optionsEls;

                    newOptions = [];
                    optionsEls = document.querySelectorAll(".admin-option");

                    foundItem.questionText = domItems.newQuestionText.value;
                    foundItem.correnctAnswer = '';
                    for(let i = 0; i < optionsEls.length; i++) {
                        if(optionsEls[i].value !== '') {
                            newOptions.push(optionsEls[i].value);
                            if(optionsEls[i].previousElementSibling.checked) {
                                foundItem.correnctAnswer = optionsEls[i].value;
                            }  
                        }
                    }
                    foundItem.options = newOptions;

                    if(foundItem.questionText !== '') {
                        if(foundItem.options.length > 1) {
                            if(foundItem.correnctAnswer !== ""){
                                getStorageQuestionList.splice(placeInArray, 1, foundItem);
                                sotrageQuestionList.setQuestionCollection(getStorageQuestionList);
                                /*
                                domItems.newQuestionText.value = "";
                                for(let i = 0; i < optionsEls.length; i++){
                            
                                    optionsEls[i].value = "";
                                    optionsEls[i].previousElementSibling.checked = false;
                                    if(i>1){
                                        optionsEls[i].parentElement.remove();
                                    }                                  
                                }
                                
                                domItems.questionUpdateBtn.style.visibility = 'hidden';
                                domItems.questionDeleteBtn.style.visibility = 'hidden';
                                domItems.questInsertButton.style.visibility = 'visible';
                                domItems.questionsClearBtn.style.pointerEvents = '';

                                updateQuestionListFn(getStorageQuestionList);
                                */
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
                    /*
                    domItems.newQuestionText.value = "";
                    for(let i = 0; i < optionsEls.length; i++) {   
                        optionsEls[i].value = "";
                        optionsEls[i].previousElementSibling.checked = false;
                        if(i>1) {
                            optionsEls[i].parentElement.remove();
                        }
                    }
                    // addInputsDynamically();
                    domItems.questionUpdateBtn.style.visibility = 'hidden';
                    domItems.questionDeleteBtn.style.visibility = 'hidden';
                    domItems.questInsertButton.style.visibility = 'visible';
                    domItems.questionsClearBtn.style.pointerEvents = '';

                    updateQuestionListFn(getStorageQuestionList);
                    */
                    backDeafaultView(optionsEls);
                }
                domItems.questionDeleteBtn.onclick = deleteQuestion;
            }; 
        },

        clearQuestionList: function(sotrageQuestionList) {
            if(sotrageQuestionList.getQuestionCollection() !== null){
                if(sotrageQuestionList.getQuestionCollection().length > 0) {
                    let conf = confirm("Warning: You will loose entire list!");
                    if(conf){
                        sotrageQuestionList.removeQuestionCollection();
                        domItems.insertedQuestionsWrapper.innerHTML = "";
                        sotrageQuestionList.setQuestionCollection([]);
                    }
                }
            }
        }
    };

})();

/*******************************
******** CONTROLLER ***********
*******************************/

let controller = (function(quizCtrl, UICtrl) {
    let selectedDomItems = UICtrl.getDomItems;
    UICtrl.addInputsDynamically();
    UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage.getQuestionCollection());

    selectedDomItems.questInsertButton.addEventListener('click', function(){
        let adminOptions = document.querySelectorAll('.admin-option');
        if(quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, adminOptions, UICtrl.addInputsDynamically)){
            
            UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage.getQuestionCollection());
        };
    });

    selectedDomItems.insertedQuestionsWrapper.addEventListener('click', function(e){
        UIController.editQuestionList(e, quizCtrl.getQuestionLocalStorage, UICtrl.addInputsDynamically, UICtrl.createQuestionList);
        // UICtrl.addInputsDynamically();
    })
    selectedDomItems.questionsClearBtn.addEventListener('click', function() {
        UICtrl.clearQuestionList(quizController.getQuestionLocalStorage)
    });
    
})(quizController, UIController);

// 17 Displaz questions
