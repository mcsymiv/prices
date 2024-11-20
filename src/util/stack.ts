export class Stack {
  stk: string[]
  constructor() {
      this.stk = [];
  }

  add(el: string): number {
    return this.stk.push(el);
  }

  remove(): string | undefined {
    if (this.stk.length > 0) {
      return this.stk.pop();
    }
  }

  peek(): string {
    return this.stk[this.stk.length - 1]
  }

  isEmpty(): boolean {
    return this.stk.length == 0;
  }

  size(): number {
    return this.stk.length;
  }

  clear(): void {
    this.stk = [];
  }

  show(): string[] | undefined {
    return this.stk;
  }
}