angular.module('BarterApp').factory('ProductHistoryService', function() {
    /**
     * This service is a generic history of any kind of object the user wants to keep.
     */
    const historyService = {

        forwardStack: [],

        backwardStack: [],

        /**
         * Save an object in a stack history.
         */
        saveInHistory: (obj, stack) => {
            // If there's no element in our stack.
            if (stack.length > 0) {
                const lastElementInStack = stack[stack.length - 1]
                
                if(lastElementInStack.length != obj.length){
                    stack.push(obj)
                }
                else {
                    for(var i = 0; i < lastElementInStack.length; i++) {
                        if(lastElementInStack[i] != obj[i]) {
                            stack.push(obj)
                            break;
                        }
                    }
                }
            } 
            else {
                stack.push(obj)
            }
        },
        
        /**
         * Clear the foward stack when the user change the history.
         */
        clearForwardHistory : () => historyService.forwardStack = [],
    
        /**
         * Get the last item in the backwardStack.
         * 
         * param-name="obj" if the object the object passed in argument is not null, it will save in the forward stack.
         */
        goBack: (obj) => {
            if (obj) {
                historyService.saveInHistory(obj, historyService.forwardStack)
            }
            if(historyService.backwardStack.length == 0){
                return []   // If there's no more element in our stack, just return an empty array.
            }
            return historyService.backwardStack.pop()

        },

        /**
         * Go forward in the history.
         */
        goFoward: (obj) => {
            if (obj) {
                historyService.saveInHistory(obj, historyService.backwardStack)
            }
            if(historyService.forwardStack.length == 0) {
                return [] // If there's no more element in our stack, just return an empty array.
            }
            return historyService.forwardStack.pop()
        }

    }

    return historyService

});