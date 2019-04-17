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

    return {
        addQuestionOnLocalStorage: function(newQuestionText, opts) {
            let optionsArr, corrAns, questionId, newQuestion, getStoredQuestions, isChecked;

            if(questionLocalStorage.getQuestionCollection() === null) {
                questionLocalStorage.setQuestionCollection([]);
            }

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
            
                        opts.forEach(element => {
                            element.value = "";
                            element.previousElementSibling.checked = false;
                        });
                    } else {
                        alert('Check the correct answer');
                    }

                } else {
                    alert('Please insert at least 2 options');
                }
            } else {
                alert('Please insert question');
            }            
        }
    };

})();

/*******************************
******** UI CONTROLLER *********
*******************************/
let UIController = (function() {
    
    let domItems = {
        // *** Admin Panel Elements
        questInsertButton: document.getElementById("question-insert-btn"),
        newQuestionText: document.getElementById("new-question-text"),
        adminOptions: document.querySelectorAll(".admin-option"),
        adminOptionsContainer: document.querySelector(".admin-options-container")
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
        }
    };

})();

/*******************************
******** CONTROLLER ***********
*******************************/
let controller = (function(quizCtrl, UICtrl) {
    let selectedDomItems = UICtrl.getDomItems;
    UICtrl.addInputsDynamically();

    selectedDomItems.questInsertButton.addEventListener('click', function(){
        let adminOptions = document.querySelectorAll('.admin-option');
        quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, adminOptions);
        
    });
    
})(quizController, UIController);
