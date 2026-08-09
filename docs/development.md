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

## 公開

- GitHub Pages の設定は GitHub Actions で管理する。
- 公開前に本番ビルドを確認し、リンク、画像、サイトのベースパスが GitHub Pages 上でも正しいことを確認する。
