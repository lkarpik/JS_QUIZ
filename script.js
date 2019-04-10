/**
 * Quiz Controller
 */
let quizController = (function(){
    
    /**
     * Question constructor
     */
    
    function Question(id, questionText, options, correctAnswer) {
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }
    
})();

/**
 * UI Controller
 */
let UIController = (function(){
    
    let domItems = {
        // Admin Panel Elements
        questInsertBtn: document.getElementById("question-insert-btn")
    };
    return {
        getDomItems: domItems
    };

})();

/**
 * Controller
 */
let controller = (function(quizCtrl, UICtrl){
    UICtrl.getDomItems.questInsertBtn.addEventListener("click", function () {
        console.log(this);
    });
    

})(quizController, UIController);