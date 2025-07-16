export default class GrammarRule {
    before_arrow: string;
    after_arrow: string;

    constructor(str_representation: string | null) {
        if (str_representation !== null) {
            let parts = str_representation.split("->").map(part => part.trim());
            if (parts.length != 2) {
                throw new Error();
            } else {
                this.before_arrow = parts[0];
                this.after_arrow = parts[1];
            }
        } else {
            this.before_arrow = "";
            this.after_arrow = "";
        }
    }
    
    get_before_arrow(): string {
        return this.before_arrow
    }
    
    get_after_arrow(): string {
        return this.after_arrow
    }
    
    get_after_arrow_len(): number {
        let after_arrow = this.after_arrow
        let spaceCount = after_arrow.split('').filter(char => char === ' ').length;
        return spaceCount+1
    }
}