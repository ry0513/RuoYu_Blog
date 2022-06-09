export const ARTICLE_STATUS_OPTIONS = [
    { value: 0, label: "草稿" },
    { value: 1, label: "待审核" },
    { value: 2, label: "发布" },
    { value: 3, label: "回收站" },
];

export const TAG_STATUS_OPTIONS = [
    { value: 0, label: "待审核" },
    { value: 1, label: "驳回" },
    { value: 2, label: "正常" },
];

export const getOptionsLabel = (
    OPTIONS: { value: number; label: string }[],
    value: number
) => {
    return OPTIONS.filter((item) => {
        return item.value === value;
    })[0].label;
};
