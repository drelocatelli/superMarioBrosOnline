function extender<T extends { new (...args: any[]): {} }>(BaseClass: T) {
    return class extends BaseClass {};
}

export default extender;
