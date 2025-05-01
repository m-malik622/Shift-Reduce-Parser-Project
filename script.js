class GrammarRule {
    constructor(str_representation) {
        let parts = str_representation.split("→").map(part => part.trim());
        this.before_arrow = parts[0];  
        this.after_arrow = parts[1];

    }
    
    get_before_arrow() {
        return this.before_arrow
    }
    
    get_after_arrow() {
        return this.after_arrow
    }
    
    get_after_arrow_len() {
        let after_arrow = this.after_arrow
        let spaceCount = after_arrow.split('').filter(char => char === ' ').length;
        return spaceCount+1
    }
}

function create_table() {
    let table_body = document.getElementById("parser_table")
    let rows = table_body.getElementsByTagName("tr");
    let parser_table = {};

    for (let i = 0; i < rows.length; i++) { // Skip header row
        let cells = rows[i].getElementsByTagName("td");
        let state = parseInt(cells[0].innerText.trim());
        
        parser_table[state] = {
            "id": cells[1].innerText.trim(),
            "+": cells[2].innerText.trim(),
            "*": cells[3].innerText.trim(),
            "(": cells[4].innerText.trim(),
            ")": cells[5].innerText.trim(),
            "$": cells[6].innerText.trim(),
            "E": cells[7] ? parseInt(cells[7].innerText.trim()) || "" : "",
            "T": cells[8] ? parseInt(cells[8].innerText.trim()) || "" : "",
            "F": cells[9] ? parseInt(cells[9].innerText.trim()) || "" : ""
        };
    }
    return parser_table;
}


function create_grammar_rules(){
    let grammar_rules = [];
    let table_body = document.getElementById("grammar_production_rules");
    let rows = table_body.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) { // Skip header row
        let production_rule_str = rows[i].getElementsByClassName("grammar_rule")[0].innerText.trim();
        const production_rule_instance = new GrammarRule(production_rule_str);
        grammar_rules.push(production_rule_instance)
    }
    return grammar_rules
}

function seperate_to_tokens(expression){
    tokens = []
    let regex = /id|\+|\*|\(|\)|\$|E|T|F/g;
    let matches = expression.match(regex); // Find all matches
    if (matches) {
        tokens = matches; // Store tokens
    }

    return tokens;
}
function underive_expression(grammar_rule, stack){
    after_arrow_len = grammar_rule.get_after_arrow_len()
    underived_stack = seperate_to_tokens(grammar_rule.get_after_arrow())
    while(underived_stack.length > 0){
        console.log("stack: ", stack, "\nderived stack: ", underived_stack, "\n\n")
        if (stack.pop() === underived_stack[underived_stack.length-1]){
            underived_stack.pop()
        }
    }
    return grammar_rule.get_before_arrow()
}

function display_step(parser_table_history, parser_table_code, i, input){
    let parser_table_code_str = ''
    for (let j=0; j<parser_table_code.length; j++){
        parser_table_code_str += parser_table_code[j]
    }
    let input_str = ''
    for (let j=i; j<input.length; j++){
        input_str +=(" " +  input[j])
    }
    let table_body = document.getElementById("steps_display");
    let newRow = document.createElement("tr");
    let parser_code_td = document.createElement("td");
    parser_code_td.className = "parser_table_code";
    parser_code_td.setAttribute("width", "125");
    parser_code_td.textContent = parser_table_code_str;

    let remaining_input_td = document.createElement("td");
    remaining_input_td.className = "remaining_input";
    remaining_input_td.textContent = input_str;

    newRow.appendChild(parser_code_td);
    newRow.appendChild(remaining_input_td);
    table_body.appendChild(newRow);
    parser_table_history.push({parser_table_code_str, input_str})
};

function clear_display_table(){
    const table_body = document.getElementById('steps_display'); 
    for (let i = table_body.rows.length - 1; i > 0; i--) {
        table_body.deleteRow(i);
    }
}

function process_input(value) {
    if (value === "") {
        alert("Please enter an input string. There has to be a '$' present at the end" );
        return false;
    }

    clear_display_table()
    const parser_table = create_table()
    const grammar_rules = create_grammar_rules()
    let parser_table_history = []
    input = seperate_to_tokens(value)
    console.log("input steam is " + input)
    let parser_table_code = [] //stack

    parser_table_code.push('0')
    let i=0;
    let action
    while (i<input.length && parser_table_code.length>0 && input[input.length-1]=="$"){
        display_step(parser_table_history, parser_table_code, i, input)
        let state = parser_table_code[parser_table_code.length-1]
        symbol = input[i]
        try {
            action = parser_table[state][symbol]
            //console.log("\n\n\naction is: " + action)
        } catch (error) {
            alert("Error: failed to get value of table element")
            return false         
        }
        if (action[0]==='S'){
            new_state = action.substring(1);
            parser_table_code.push(symbol)
            parser_table_code.push(new_state)
            i+=1
            //console.log("new state: " + new_state)
            //console.log("symbol: " + symbol)
            //console.log("stack at end of S: " + parser_table_code)
        }
        else if(action[0]==='R'){
            parser_table_code.pop()
            grammar_rule = grammar_rules[action.substring(1)-1]
            //console.log("stack before underiving: " + parser_table_code)
            new_symbol = underive_expression(grammar_rule, parser_table_code)
            //console.log("stack after underiving: " + parser_table_code)
            temp_state = parser_table_code[parser_table_code.length-1]; //peek at stack
            //console.log("temp state: " + temp_state)
            parser_table_code.push(new_symbol)
            //console.log("new symbol: " + new_symbol)
            
            new_state = parser_table[temp_state][new_symbol]
            if (new_state==''){
                parser_table_code.pop()
            }
            else{
                //console.log("new state: " + new_state)
                parser_table_code.push(new_state)
                //console.log("Stack at end of R" + parser_table_code )
            }
        }
        else{
            break
        }
    }
    const table_body = document.querySelector("#steps_display");
    const last_row = table_body.querySelector("tr:last-child");
    if (action == "accept"){
        alert("Success");
        if (last_row){
            last_row.style.background = "green";
        }
        return true
    }
    else{
        alert("Failed to compile")
        if (last_row){
            last_row.style.background = "red";
        }
        return false
    }
}