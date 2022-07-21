interface pageChangeInfo {
    current: number;
    previous: number;
    pageSize: number;
}

type Status = string | number;

interface Article {
    articleId: number | null;
    title: string;
    html: string;
    content: string;
    type: number | null;
    tags: number[];
    sortId: number | null;
    password: string;
    status?: number;
}
