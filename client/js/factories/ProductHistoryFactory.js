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
         * Get the last item in the backwardStack.
         * 
         * param-name="obj" if the object the object passed in argument is not null, it will save in the forward stack.
         */
        goBack: (obj) => {
            if (obj) {
                historyService.saveInHistory(obj, historyService.forwardStack)
            }
            if(historyService.backwardStack.length == 1){
                return historyService.backwardStack[0]  // Get the only element left in the array.
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
            if(historyService.forwardStack.length == 1) {
                return historyService.forwardStack[0]   // Get the only element left in the array.
            }
            return historyService.forwardStack.pop()
        }

    }

    return historyService

});