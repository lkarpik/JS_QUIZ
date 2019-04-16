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
    return {
        addQuestionOnLocalStorage: function(newQuestionText, opts) {
            let optionsArr, corrAns, questionId, newQuestion;
            optionsArr = [];
            questionId = 0;

            for(let i = 0; i< opts.length; i++) {
                if(opts[i].value !== ""){
                    optionsArr.push(opts[i].value);
                }
               if(opts[i].previousElementSibling.checked && opts[i].value !=="") {
                corrAns = opts[i].value;
               }
            }
            newQuestion = new Question(questionId, newQuestionText.value, optionsArr, corrAns);

            console.log(newQuestion);
            
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
        adminOptions: document.querySelectorAll(".admin-option")
    };
    return {
        getDomItems: domItems
    };

})();

/*******************************
******** CONTROLLER ***********
*******************************/
let controller = (function(quizCtrl, UICtrl) {
    let selectedDomItems = UICtrl.getDomItems;
    selectedDomItems.questInsertButton.addEventListener('click', function(){
        quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, selectedDomItems.adminOptions);
        
    });
    
})(quizController, UIController);
