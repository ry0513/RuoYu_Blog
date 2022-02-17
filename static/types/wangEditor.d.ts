declare type Descendant = Element | Text;
interface IDomEditor {
    children: Descendant[];
    getHtml: () => string;
    blur: () => void;
    focus: () => void;
    isEmpty: () => boolean;
}

declare const wangEditor: {
    createEditor(option?: Partial<ICreateEditorOption>): IDomEditor;
    createToolbar(option: ICreateToolbarOption): Toolbar;
};
