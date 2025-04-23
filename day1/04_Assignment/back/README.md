# back

## 環境構築

### パッケージインストール

```bash
uv sync
```

### 環境変数の設定
`back`ディレクトリで`.env`を作成し、以下の環境変数を設定します。

```bash
LLM_MODEL_NAME="SakanaAI/TinySwallow-1.5B-Instruct"
LLM_MAX_NEW_TOKENS=1024
SUPABASE_URL=<your_supabase_url>
SUPABASE_KEY=<your_supabase_key>
```
- `SUPABASE_URL`と`SUPABASE_KEY`は、[Supabase](https://supabase.com/)のプロジェクトから取得できます。
- `LLM_MODEL_NAME`は、使用するLLMモデルの名前です。
- `LLM_MAX_NEW_TOKENS`は、LLMモデルが生成する最大トークン数です。
- `LLM_MODEL_NAME`と`LLM_MAX_NEW_TOKENS`は、必要に応じて変更してください。

### 開発サーバーの立ち上げ

```bash
make dev
```

```bash
# Swagger UIの確認
# ブラウザで`http://127.0.0.1:8000/docs`にアクセス
```
