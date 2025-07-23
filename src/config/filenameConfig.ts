interface FileNameConfig {
    lllket: lllket[];
    division: Division[];
    type: Type[];
    extension: Extension[];
}

type lllket =
    | "aaa" | "bbb" | "ccc" | "ddd" | "eee" | "fff" | "ggg" | "hhh" | "iii"
    | "jjj" | "lll" | "kkk" | "mmm" | "nnn" | "ooo" | "ppp" | "qqq" | "rrr"
    | "sss" | "ttt" | "uuu" | "vvv" | "www" | "xxx" | "yyy" | "zzz" | "aoa"
    | "bob" | "coc" | "dod" | "eoe";

type Division = "fof" | "gog" | "hoh" | "ioi" | "joj";

type Type = "txt" | "exe" | "ts" | "js" | "doc" | "docx";

type Extension =
    | "text/plain"
    | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    | "text/csv"
    | "application/vnd.ms-excel"
    | "application/vnd.ms-excel.sheet.binary.macroEnabled.12"
    | "application/vnd.ms-excel.sheet.macroEnabled.12"
    | "application/json";

const filenameConfig: FileNameConfig = {
    lllket: ["aaa", "bbb", "ccc", "ddd", "eee", "fff", "ggg", "hhh", "iii", "jjj", "lll", "kkk", "mmm", "nnn", "ooo", "ppp", "qqq", "rrr", "sss", "ttt", "uuu", "vvv", "www", "xxx", "yyy", "zzz", "aoa", "bob", "coc", "dod", "eoe"],
    division: ["fof", "gog", "hoh", "ioi", "joj"],
    type: ["txt", "exe", "ts", "js", "doc", "docx"],
    extension: ["text/plain", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv", "application/vnd.ms-excel", "application/vnd.ms-excel.sheet.binary.macroEnabled.12", "application/vnd.ms-excel.sheet.macroEnabled.12", "application/json"]
};

export default filenameConfig;