angular.module('BarterApp').factory('HistoryService', function() {
    


    /**
     * This service is a generic history of any kind of object the user wants to keep.
     */
    const historyService = {
        
        forwardStack : [],
        
        backwardStack: [],
        
        /**
         * Save an object in a stack history.
         */ 
        saveInHistory : (obj, stack) => {
            if(stack.length > 0) {
                const lastElementInStack = stack[stack.length-1]
                if(lastElementInStack != obj) {
                    stack.push(obj)
                }
            } 
            stack.push(obj)
        },
        
        /**
         * Get the last item in the backwardStack.
         * 
         * param-name="obj" if the object the object passed in argument is not null, it will save in the forward stack.
         */ 
        goBack : (obj) => {
            if(obj){
                historyService.saveInHistory(obj, historyService.forwardStack)
            }
            return historyService.backwardStack.pop()
        },
        
        /**
         * Go forward in the history.
         */
        goFoward : (obj) => {
            if(obj){
                historyService.saveInHistory(obj, historyService.backwardStack)
            }
            return historyService.forwardStack.pop()
        }
        
    }
    
    return historyService
    
});