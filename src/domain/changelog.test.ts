import { describe, expect, it } from "vitest";

import { prepareChangelogEntries, type ChangelogEntry } from "./changelog";

const createEntry = (
  overrides: Partial<ChangelogEntry> = {},
): ChangelogEntry => ({
  date: "2026-08-20",
  title: "更新タイトル",
  description: "更新内容の説明",
  ...overrides,
});

const expectEntryToBeRejected = (
  overrides: Partial<ChangelogEntry>,
  expected: string | RegExp,
) => {
  expect(() => prepareChangelogEntries([createEntry(overrides)])).toThrow(
    expected,
  );
};

describe("prepareChangelogEntries", () => {
  describe("項目の検証", () => {
    it.each([
      ["リンクなし", undefined],
      ["内部リンク", { kind: "internal", path: "notes/" }],
      ["外部リンク", { kind: "external", url: "https://example.com/product" }],
    ] satisfies [string, ChangelogEntry["link"]][])(
      "%sの正しい項目を受け入れる",
      (_label, link) => {
        const entry = createEntry({ link });

        expect(prepareChangelogEntries([entry])).toEqual([entry]);
      },
    );

    it.each(["", " ", "\t\n"])("空の title %j を拒否する", (title) => {
      expectEntryToBeRejected({ title }, "title は空にできません");
    });

    it.each(["", " ", "\t\n"])(
      "空の description %j を拒否する",
      (description) => {
        expectEntryToBeRejected(
          { description },
          "description は空にできません",
        );
      },
    );
  });

  describe("日付の検証", () => {
    it("閏年の2月29日を受け入れる", () => {
      const entry = createEntry({ date: "2024-02-29" });

      expect(prepareChangelogEntries([entry])).toEqual([entry]);
    });

    it.each(["2026-02-29", "2026-04-31", "2026-13-01", "2026-00-01"])(
      "存在しない日付 %s を拒否する",
      (date) => {
        expectEntryToBeRejected({ date }, "date が不正です");
      },
    );

    it.each(["2026-8-20", "2026/08/20", "20-08-2026", "2026-08-20T00:00:00Z"])(
      "YYYY-MM-DD 以外の日付 %s を拒否する",
      (date) => {
        expectEntryToBeRejected({ date }, "YYYY-MM-DD 形式");
      },
    );
  });

  describe("リンクの検証", () => {
    it.each([
      "not-a-url",
      " https://example.com",
      "https://example.com ",
      "http://example.com",
      "ftp://example.com",
      "https://",
    ])("不正な外部 URL %j を拒否する", (url) => {
      const link = { kind: "external", url } as const;

      expectEntryToBeRejected({ link }, /link.url/);
    });

    it.each([
      "",
      " ",
      " notes/",
      "notes/ ",
      "/notes/",
      "https://example.com/notes/",
      "notes/%",
      ".",
      "..",
      "./notes/",
      "notes/../works/",
      "%2e/notes/",
      "notes/%2E%2E/works/",
      "notes\\..\\works/",
      "notes%2F..%2Fworks/",
      "notes%5C..%5Cworks/",
    ])("不正な内部パス %j を拒否する", (path) => {
      const link = { kind: "internal", path } as const;

      expectEntryToBeRejected({ link }, /link.path/);
    });
  });

  describe("並び替えと不変性", () => {
    it("更新日の降順に並べる", () => {
      const oldest = createEntry({ date: "2026-08-01", title: "古い更新" });
      const newest = createEntry({ date: "2026-08-20", title: "新しい更新" });
      const middle = createEntry({ date: "2026-08-10", title: "中間の更新" });

      expect(prepareChangelogEntries([oldest, newest, middle])).toEqual([
        newest,
        middle,
        oldest,
      ]);
    });

    it("更新日が同じ項目は入力順を維持する", () => {
      const first = createEntry({ title: "同日の最初の更新" });
      const second = createEntry({ title: "同日の次の更新" });

      expect(prepareChangelogEntries([first, second])).toEqual([first, second]);
    });

    it("元の入力配列を変更しない", () => {
      const older = createEntry({ date: "2026-08-01", title: "古い更新" });
      const newer = createEntry({ date: "2026-08-20", title: "新しい更新" });
      const entries = [older, newer];
      const originalOrder = [...entries];

      const result = prepareChangelogEntries(entries);

      expect(entries).toEqual(originalOrder);
      expect(result).not.toBe(entries);
    });

    it("読み取り専用の結果配列を実行時にも凍結する", () => {
      const result = prepareChangelogEntries([createEntry()]);

      expect(Object.isFrozen(result)).toBe(true);
    });
  });
});
