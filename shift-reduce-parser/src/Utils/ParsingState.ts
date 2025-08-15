export default class ParsingState {
    stackContent: string[];
    userInputContent: string[];

    constructor(stackContent: string[] = [], userInputContent: string[] = []) {
        this.stackContent = stackContent;
        this.userInputContent = userInputContent;
    }
    
    get_stack_content(): string[] {
        return this.stackContent
    }
    get_user_input_content(): string[] {
        return this.userInputContent
    }
}
