export class Queue<T> {
    head: Node<null>;
    tail: Node<null>;
    constructor() {
        this.head = new Node(null);
        this.tail = new Node(null);
    }
    enqueue(x: T) {
        const node = new Node<T>(x);

        // empty add
        if (!this.head || !this.tail) {
            this.head = this.tail = node;
            return;
        }

        // length 1 add
        if (this.head === this.tail) {
            this.head.setNext();
        }

        // add to existing list
        this.tail.setNext(new Node<T>(x));
        this.tail = this.tail.getNext();
    }

    unenqueue() {
        this.tail;
    }
}

class Node<T> {
    private data: T;
    private prev: Node<T> | null = null;
    private next: Node<T> | null = null;
    constructor(
        data: T,
        next: Node<T> | null = null,
        prev: Node<T> | null = null
    ) {
        this.data = data;
        this.next = next;
        this.prev = prev;
    }

    get() {
        return this.data;
    }

    getNext() {
        return this.next;
    }

    getPrev() {
        return this.prev;
    }

    setNext(n: Node<T> | null) {
        this.next = n;
    }

    setPrev(n: Node<T> | null) {
        this.prev = n;
    }
}
