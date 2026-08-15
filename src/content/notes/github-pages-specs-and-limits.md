---
title: GitHub Pages の仕様・制限まとめ
description: GitHub Pages で個人サイトを公開する前に確認したい容量、帯域、デプロイ、独自ドメインの要点を整理します。
pubDate: 2026-08-15
updatedDate: 2026-08-15
category: tech
---

> **この記事について**
>
> 2026年8月時点の GitHub 公式ドキュメントをもとに、GitHub Pages を使う前に知っておきたい仕様と制限を整理します。数値や仕様は変更される可能性があるため、運用前には公式ドキュメントも確認してください。

## 先に結論

GitHub Pages は個人サイトやドキュメントサイトの公開に向いています。
一方で、画像・動画など大容量ファイルを多く扱う用途には制限があります。

| 項目             | 内容                                                                          |
| ---------------- | ----------------------------------------------------------------------------- |
| 公開サイト容量   | 1GB まで                                                                      |
| ソースリポジトリ | 1GB 以下が推奨                                                                |
| 月間帯域幅       | 100GB のソフト上限                                                            |
| デプロイ時間     | 10分を超えるとタイムアウト                                                    |
| ビルド回数       | GitHub Actions の独自 workflow では、Pages の毎時10回というソフト上限の対象外 |

## GitHub Pages でできること

- 静的サイトを公開できる
- GitHub Actions でビルド・デプロイできる
- 独自ドメインと HTTPS を設定できる

## 主な制限

### 利用目的

GitHub Pages は、個人サイトやドキュメントサイトなどの静的コンテンツ公開に向いています。
一方で、EC サイトや SaaS の提供を主目的とする用途、パスワードやカード情報を扱う用途には利用できません。

### 容量と帯域幅

公開済みサイトは 1GB 以下に収める必要があります。
また、月間帯域幅には 100GB のソフト上限があります。

> **注意**
>
> 画像の原画や動画を Git に保存し続ける運用には向きません。
> サイトで配信する最適化済みの画像だけを置くのが安全です。

### ビルドとデプロイ

デプロイは 10分を超えるとタイムアウトします。
Astro のような静的サイトジェネレーターは、GitHub Actions でビルドし、生成物を GitHub Pages へ配置する構成にできます。

## 画像・ファイルを置くときの考え方

- WebP などに最適化したサイト用画像はリポジトリで管理する
- 原画・高解像度版・動画は Git に含めない
- 容量が増えたら、オブジェクトストレージや CDN を検討する
- Git LFS は GitHub Pages の配信には利用できない

## 独自ドメインと HTTPS

GitHub Pages では独自ドメインと HTTPS を利用できます。
apex ドメインを使う場合も、`www` サブドメインを併せて設定することが推奨されています。

## Working Corgi での構成

- Astro で静的サイトを生成
- GitHub Actions で `main` へのマージ後に自動デプロイ
- Route 53 で DNS を管理
- `workingcorgi.com` を独自ドメインとして利用

## 公式ドキュメント

- [GitHub Pages の制限](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [Git LFS について](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage)
- [GitHub Actions を使った公開](https://docs.github.com/en/get-started/start-your-journey/deploying-your-website-automatically)
- [独自ドメインの設定](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
