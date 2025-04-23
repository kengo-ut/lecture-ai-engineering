# front

## 環境構築

### パッケージマネージャーのインストール

- [Volta](https://volta.sh/) を使用して Node.js と Yarn のバージョンを管理する

```bash
volta install node
volta install yarn
```

### パッケージインストール

```bash
yarn
```

### 環境変数

- `.env.local`を作成し、以下の環境変数を設定

```
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

### 開発サーバーの立ち上げ

```bash
yarn dev
```

## TODO

- testの実装 (vitest)
- authの実装
- deployの実装 (Vercel)
- CI/CDの実装 (GitHub Actions)
