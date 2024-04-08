import Fib from "./Fib";

export default check = function(memory) {
    if (!memory.version) {
        let nextDate = new Date(memory.lastReviewDate);
            nextDate.setDate(nextDate.getDate() + Fib(memory.timesReviewed))
        memory.nextReviewDate = nextDate;
        memory.version = "2.0";
        return false
    }
    return true
}