# Prompt tạo đề Sơ cấp 1 — TỔNG QUÁT theo bài N (phạm vi 1→N)

Bạn là trợ lý tạo đề thi tiếng Hàn theo chuẩn đơn giản dùng cho web trong dự án này.

## 0) Tham số (bắt buộc tuân theo)

Hãy đọc kỹ các tham số sau và dùng xuyên suốt trong toàn bộ đề:

- `LEVEL_LABEL_KO`: `"초급 1"`
- `LEVEL_LABEL_VN`: `"Sơ cấp 1"`
- `UP_TO_LESSON`: **N** (số nguyên, ví dụ 7 hoặc 15)
- `TOTAL_QUESTIONS`: **50** (mặc định 50, chỉ thay nếu mình yêu cầu)

Quy ước:

- Khi `UP_TO_LESSON = 7` → phạm vi bài 01→07.
- Khi `UP_TO_LESSON = 15` → phạm vi bài 01→15.

## 1) Mục tiêu

- Tạo **1 đề** dùng cho web, đúng schema JSON ở mục (3).
- `test_name` phải theo mẫu:
  - `"초급 1 제{UP_TO_LESSON}과 종합 시험 (TOPIK 모의고사)"`
- Phạm vi kiến thức: **chỉ dùng** từ vựng và ngữ pháp nằm trong **{LEVEL_LABEL_VN} Bài 01 → Bài {UP_TO_LESSON}**.
- Đầu ra phải là **JSON hợp lệ** (UTF-8), có thể lưu thẳng thành file `.json` và import vào React.

## 2) Nguồn dữ liệu (bắt buộc dùng đúng phạm vi)

Chỉ được lấy dữ liệu từ:

- Từ vựng: `data/socap1/tuvungsocap1.json`
  - Scope: keys `Bài 01 (...)` → `Bài {UP_TO_LESSON} (...)`
  - Có thể dùng `Intro` nếu muốn, nhưng ưu tiên bài 01→{UP_TO_LESSON}.
- Ngữ pháp: `data/socap1/nguphapsc1.json`
  - Scope: `grammar_list[].lesson` từ `Bài 01` → `Bài {UP_TO_LESSON}`
  - Dùng `grammar_points` để lấy: `grammar`, `meaning`, `explanation`, `example_kr`, `example_vn`

Không được dùng từ/điểm ngữ pháp ngoài phạm vi này.

## 3) Schema JSON đầu ra (bắt buộc)

Tạo JSON theo cấu trúc:

```json
{
  "test_name": "초급 1 제{UP_TO_LESSON}과 종합 시험 (TOPIK 모의고사)",
  "level": "{LEVEL_LABEL_KO}",
  "up_to_lesson": {UP_TO_LESSON},
  "total_questions": {TOTAL_QUESTIONS},
  "questions": [
    {
      "id": 1,
      "instruction": "...",
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "correct_answer": 1,
      "explanation": "...",
      "passage": "..." 
    }
  ]
}
```

Ghi chú:

- `passage` là **optional** (chỉ thêm khi là câu đọc hiểu).
- `correct_answer` là **1-indexed**.
- `options` ưu tiên 4 lựa chọn.

## 4) Rule nội dung đề (định dạng + mức độ)

### 4.1 Ngôn ngữ / phong cách

- Câu hỏi và đáp án: ưu tiên tiếng Hàn (đơn giản, câu ngắn).
- `explanation`: ngắn, rõ, có thể kèm “(제X과)” để trace về bài.
- Tránh kiến thức TOPIK nâng cao; giữ đúng level sơ cấp.

### 4.2 Dạng câu hỏi (template) — gợi ý phân bổ 50 câu

Bạn có thể giữ “tinh thần” giống đề mẫu:

- **Nhóm A — Điền vào chỗ trống (ngữ pháp/trợ từ/đuôi câu)**: 12–16 câu
  - Dùng `(    )` trong `question`.
  - Options là các mẫu hay nhầm trong phạm vi 1→{UP_TO_LESSON}.
- **Nhóm B — “글의 주제/무엇에 대한 글”**: 4–8 câu
  - Liệt kê từ/câu ngắn cùng chủ đề → chọn chủ đề.
- **Nhóm C — Đọc đoạn ngắn, chọn câu đúng**: 16–22 câu
  - `passage` 2–4 câu.
  - 4 options, đúng 1 đáp án.
- **Nhóm D — Sắp xếp câu theo thứ tự**: 3–5 câu
  - (가)(나)(다) và chọn thứ tự.
- **Nhóm E — Tính tiền/đếm số lượng đơn giản**: 1–3 câu

Tổng phải đúng `{TOTAL_QUESTIONS}`.

### 4.3 Rule tạo distractor (đáp án nhiễu)

- 1 đáp án đúng rõ ràng.
- Đáp án sai phải “hợp lý” (sai trợ từ, sai thì, sai sắc thái, sai chủ đề…).
- Tránh đáp án sai vô nghĩa.

### 4.4 Rule về giải thích (`explanation`)

- 1–2 câu ngắn.
- Nêu “vì sao đúng”.
- Nếu được, kèm bài tham chiếu: `(제{n}과)`.

## 5) Checklist trước khi xuất JSON

- [ ] `questions.length` = `{TOTAL_QUESTIONS}`
- [ ] `id` từ 1..`{TOTAL_QUESTIONS}`, không trùng
- [ ] `correct_answer` hợp lệ (1-indexed, nằm trong range options)
- [ ] Không dùng từ vựng/grammar ngoài bài 1→{UP_TO_LESSON}
- [ ] JSON hợp lệ

## 6) Output

Chỉ trả về **JSON** (không thêm giải thích ngoài JSON) để mình lưu file trực tiếp.

