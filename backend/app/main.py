from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# app = FastAPI(title="Voice Memo Translator API")

# # CORSの設定
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # 本番環境では適切に設定
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/")
# def read_root():
#     return {"message": "Welcome to Voice Memo Translator API"}

# @app.post("/api/voice/transcribe")
# async def transcribe_audio(file: UploadFile = File(...)):
#     # 音声ファイルを文字起こし
#     # Voskなどを使用
#     return {"text": "音声文字起こし結果がここに入ります"}

# @app.post("/api/translate")
# async def translate_text(text: str, target_lang: str):
#     # テキスト翻訳処理
#     # 選択した翻訳APIを使用
#     return {"translated_text": "翻訳結果がここに入ります"}

# if __name__ == "__main__":
#     uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)