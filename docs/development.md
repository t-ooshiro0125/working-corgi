# 開発フロー

## Dev Container

- ソースコードの変更は bind mount により、コンテナへすぐ反映される。通常はコンテナの再構築は不要。
- `package.json`、`package-lock.json`、`.devcontainer/devcontainer.json` を変更した場合は、VS Code で `Dev Containers: Rebuild and Reopen in Container` を実行する。
- コンテナの作成時に `npm ci` が実行される。依存関係を変更したら、`package-lock.json` も更新してコミットする。
- コンテナを起動すると、Astro の開発サーバーがバックグラウンドで起動し、ポート `4321` が自動転送される。

## Codex のローカル状態

- Codex の設定とローカル状態は、各 Docker ホストの `codex-private-state` 名前付きボリュームに保存する。
- ボリューム名の定義だけをリポジトリで共有し、ボリュームの内容は Git 管理・共有しない。
- このボリュームには認証情報が含まれる可能性がある。削除すると復元できない状態が失われるため、不要な場合だけ削除する。

  ```sh
  docker volume rm codex-private-state
  ```

## 実装と確認

- 実装前に `docs/product.md` と `docs/conventions.md` を確認する。
- 変更後は、必要に応じて開発サーバーで動作を確認する。
- コミット前に次を実行する。

  ```sh
  npm run format:check
  npm run lint
  npm run build
  git diff --cached
  ```

## ブランチと Pull Request

- `main` への直接 push はしない。Issue に対応する変更はブランチで行い、Pull Request を通して `main` へマージする。
- 新しい作業を始める前に、現在の作業ツリーがクリーンであることを確認する。未コミットの変更がある場合は、対応中の作業としてコミットするか、安全に退避してから切り替える。

### 命名規則

| 作業                     | ブランチ名                      | 例                     |
| ------------------------ | ------------------------------- | ---------------------- |
| Issue に対応する変更     | `<種類>/<Issue番号>-<短い説明>` | `feat/10-about-page`   |
| Issue を作らない文書変更 | `docs/<短い説明>`               | `docs/branch-workflow` |

- `<種類>` には、[コミットメッセージ](conventions.md#コミットメッセージ)で定めた種類を使う。

### 新しい Issue に着手する手順

```sh
# 現在の変更がないことを確認する
git status --short

# main を最新化する
git switch main
git pull --ff-only origin main

# Issue 用の作業ブランチを作成する
git switch -c <種類>/<Issue番号>-<短い説明>
```

### Push と Pull Request

実装とローカル検証が完了したら、変更をコミットしてから次を実行する。

```sh
# 初回だけ。現在のブランチを push し、リモート追跡ブランチを設定する
git push -u origin HEAD

# 2回目以降
git push
```

- `HEAD` は現在チェックアウトしているブランチを指す。ブランチ名を手入力する必要がなく、入力ミスを防げる。
- push 後、`main` 宛ての Pull Request を作成する。
- CI の成功とレビュー完了後、GitHub 上で squash merge する。

## 公開

### 初回設定

- GitHub Pages のデプロイは GitHub Actions で管理する。
- 初回の Pages デプロイ前に、GitHub の **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に一度だけ設定する。

### デプロイと確認

- 公開前に本番ビルドを確認し、リンク、画像、サイトのベースパスが GitHub Pages 上でも正しいことを確認する。
- 公開後は、GitHub Pages の公開 URL でサイトと静的アセットが表示されることを確認する。

### トラブルシューティング

- `actions/configure-pages` が Pages サイトを取得できず失敗した場合は、この公開元設定を確認してから、失敗した workflow を再実行するか次回の `main` push を待つ。
