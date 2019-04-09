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
        
    }
})();

/**
 * Controller
 */
let controller = (function(quizCtrl, UICtrl){
    

})(quizController, UIController);