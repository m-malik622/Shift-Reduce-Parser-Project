import GrammarRule from "./GrammarRule";
import ParsingState from "./ParsingState";
import { splitTokens } from "./Tokenizer";



//locals
function underive_expression (grammar_rule: GrammarRule, stack: string[], grammar_rules: GrammarRule[]){
    let underived_stack = splitTokens(grammar_rule.get_after_arrow(), grammar_rules)
    while(underived_stack.length > 0){
        console.log("stack: ", stack, "\nderived stack: ", underived_stack, "\n\n")
        if (stack.pop() === underived_stack[underived_stack.length-1]){
            underived_stack.pop()
        }
    }
    return grammar_rule.get_before_arrow()
}

export function GenerateNextParsingState(currentState: ParsingState, parser_table_as_dictionary: {[key: string]:{[key: string]:string}}, grammar_rules: GrammarRule[]): ParsingState {
    console.log("time to generate next state:")
    let input: string[] = currentState.get_user_input_content();
    let stack: string[] = currentState.get_stack_content();
    console.log("input at start: ", input) 
    console.log("stack at start: ", stack) 
    //base case
    if (stack.length<=0){
       throw {flag: "error", content: "Stack empty"}
    }
    const parser_table = parser_table_as_dictionary
    let state = stack[stack.length-1]
    let symbol = input[input.length-1]
    let action;
    try {
        action = parser_table[state][symbol]
        console.log("\n\n\naction is: " + action)
    } catch (error) {
       throw {flag: "error", content: "No value found at symbol: ${symbol}, state: ${state}, unable to compile"}
    }
    if (action[0]==='s'){
        const new_state = action.substring(1);
        stack.push(symbol)
        stack.push(new_state)
        console.log("new state: " + new_state)
        console.log("symbol: " + symbol)
        console.log("stack at end of S: " + stack)
    }
    else if(action[0]==='r'){
        stack.pop()
        const grammar_rule_number = Number(action.substring(1)) - 1
        const grammar_rule = grammar_rules[grammar_rule_number]
        console.log("stack before underiving: " + stack)
        const new_symbol = underive_expression(grammar_rule, stack, grammar_rules)
        console.log("stack after underiving: " + stack)
        const temp_state = stack[stack.length-1]; //peek at stack
        console.log("temp state: " + temp_state)
        stack.push(new_symbol)
        console.log("new symbol: " + new_symbol)
        
        const new_state = parser_table[temp_state][new_symbol]
        if (new_state==''){
            stack.pop()
        }
        else{
            console.log("new state: " + new_state)
            stack.push(new_state)
            console.log("Stack at end of R" + stack )
        }
    }
    else if(action=="acc"){
        //compilation successful.
        input.pop()
        throw {flag: "complete", content: new ParsingState(stack, input)}
    }
    else{
        throw {flag: "error", content: "Error with table generation. Action element exists, but does not start with s or r"}
    }
    input.pop()
    if (input.length==0) //if $ was the only token left in user input, keep it
        input = ["$"]
    return new ParsingState(stack, input)
}