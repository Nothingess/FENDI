interface Map<K, V> {
    clear(): void;
    delete(key: K): boolean;
    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;
    get(key: K): V | undefined;
    has(key: K): boolean;
    set(key: K, value: V): this;
    readonly size: number;
}

interface MapConstructor {
    new(): Map<any, any>;
    new<K, V>(entries?: ReadonlyArray<readonly [K, V]> | null): Map<K, V>;
    readonly prototype: Map<any, any>;
}
declare var Map: MapConstructor;

interface ReadonlyMap<K, V> {
    forEach(callbackfn: (value: V, key: K, map: ReadonlyMap<K, V>) => void, thisArg?: any): void;
    get(key: K): V | undefined;
    has(key: K): boolean;
    readonly size: number;
}

interface WeakMap<K extends object, V> {
    delete(key: K): boolean;
    get(key: K): V | undefined;
    has(key: K): boolean;
    set(key: K, value: V): this;
}

interface WeakMapConstructor {
    new <K extends object = object, V = any>(entries?: ReadonlyArray<[K, V]> | null): WeakMap<K, V>;
    readonly prototype: WeakMap<object, any>;
}
declare var WeakMap: WeakMapConstructor;

interface Set<T> {
    add(value: T): this;
    clear(): void;
    delete(value: T): boolean;
    forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void;
    has(value: T): boolean;
    readonly size: number;
}

interface SetConstructor {
    new <T = any>(values?: ReadonlyArray<T> | null): Set<T>;
    readonly prototype: Set<any>;
}
declare var Set: SetConstructor;

interface ReadonlySet<T> {
    forEach(callbackfn: (value: T, value2: T, set: ReadonlySet<T>) => void, thisArg?: any): void;
    has(value: T): boolean;
    readonly size: number;
}

interface WeakSet<T extends object> {
    add(value: T): this;
    delete(value: T): boolean;
    has(value: T): boolean;
}

interface WeakSetConstructor {
    new <T extends object = object>(values?: ReadonlyArray<T> | null): WeakSet<T>;
    readonly prototype: WeakSet<object>;
}
declare var WeakSet: WeakSetConstructor;


declare namespace GlobalVar{
    /**将节点在父节点下的局部坐标转化为另一个节点的局部坐标（就是换老爸），返回转化后的坐标 */
    export function switchPosToNode(node:cc.Node, toNode:cc.Node):cc.Vec2;
    /**将节点下的一个坐标转化为另一个节点的局部坐标 */
    export function switchPosToNodeLocalPos(node:cc.Node, pos:cc.Vec2, toNode:cc.Node):cc.Vec2;
    /**数组乱序 */
    export function shuffle(arr:Array<number>):Array<number>;
    /**
     * 从数组里面随机抽取几个元素
     * @param arr 源数组
     * @param num 取出个数
     */
    export function getRanElementByArray(arr:Array<number>, count:number):Array<number>;
}