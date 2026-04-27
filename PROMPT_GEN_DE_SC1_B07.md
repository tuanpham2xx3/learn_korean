# Prompt tạo đề Sơ cấp 1 — TỔNG QUÁT theo bài N (phạm vi 1→N)

Bạn là trợ lý tạo đề thi tiếng Hàn theo chuẩn đơn giản giống các file `data/generated_test_sc1_*.json` trong dự án Vite/React này.

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
      "explanation": "..."
    }
  ]
}
```

Quy ước:

- `id`: 1 → 50, tăng dần, không trùng.
- `options`: đa phần **4 lựa chọn** (A/B/C/D). Nếu buộc phải 5 lựa chọn thì vẫn hợp lệ, nhưng **ưu tiên 4** để giống bộ đề hiện tại.
- `correct_answer`: **1-indexed** (1..4 hoặc 1..5), khớp với vị trí trong `options`.
- `instruction`: có thể dùng format nhóm như `[1~4] ...`, `[5~8] ...` để chia dạng câu.
- `question`: có thể chứa dấu xuống dòng `\n`. Nếu là đọc hiểu, thêm `passage`.
- `passage` (tùy câu): string đoạn văn ngắn.

## 4) Rule nội dung đề (định dạng + mức độ)

### 4.1 Ngôn ngữ / phong cách

- Câu hỏi và đáp án: ưu tiên tiếng Hàn (đơn giản, câu ngắn).
- `explanation`: ngắn, rõ, có thể kèm “(제X과)” để trace về bài (giống đề mẫu).
- Tránh Hán tự/kiến thức TOPIK nâng cao. Mục tiêu là luyện “TOPIK-like” nhưng level sơ cấp.

### 4.2 Dạng câu hỏi (template) — gợi ý phân bổ 50 câu

Giữ “tinh thần” giống file mẫu B07:

- **Nhóm A — Điền vào chỗ trống (ngữ pháp/trợ từ/đuôi câu)**: 12–16 câu
  - Dùng `(    )` trong `question`.
  - Options phải là các mẫu hay nhầm lẫn trong phạm vi 1→{UP_TO_LESSON}, ví dụ:
    - `입니다` vs `입니까`
    - `은/는`, `이/가`, `을/를`, `에`, `에서`
    - `-아/어요` vs `-ㅂ/습니다` (nếu dùng, đảm bảo ngữ cảnh phù hợp)
    - `안` vs `-지 않다` (nếu dùng `-지 않다` thì phải nằm trong phạm vi; nếu không chắc thì tránh)
    - `-았/었-` (quá khứ) vs hiện tại
    - `-고 싶다` (mong muốn)
- **Nhóm B — “글의 주제/무엇에 대한 글”**: 4–8 câu
  - Cho 2–3 câu ngắn liệt kê từ vựng cùng nhóm (음식/요일/직업/장소…).
- **Nhóm C — Đọc đoạn ngắn, chọn câu đúng**: 16–22 câu
  - `passage` 2–4 câu đơn giản.
  - Options là 4 câu, trong đó chỉ 1 câu đúng theo passage.
  - Kết hợp từ vựng trong 1→{UP_TO_LESSON} và 1–2 điểm ngữ pháp trong phạm vi.
- **Nhóm D — Sắp xếp câu theo thứ tự**: 3–5 câu
  - Dạng (가)(나)(다) và options là các thứ tự.
- **Nhóm E — Tính tiền/đếm số lượng đơn giản**: 1–3 câu
  - Chỉ dùng số và đơn vị đơn giản, gắn với từ vựng 1→7.

> Bạn có thể điều chỉnh phân bổ, nhưng tổng phải đúng 50 và độ khó phải đúng “초급 1”.

### 4.3 Rule tạo distractor (đáp án nhiễu)

Khi tạo `options`, phải đảm bảo:

- **1 đáp án đúng** rõ ràng.
- Các đáp án sai phải “có vẻ hợp lý”:
  - Sai về trợ từ (은/는 vs 이/가 vs 을/를 vs 에/에서)
  - Sai về thì (quá khứ vs hiện tại)
  - Sai về sắc thái (trần thuật vs nghi vấn: 입니다 vs 입니까)
  - Sai về nghĩa chủ đề (음식 vs 장소 vs 직업 vs 요일)
- Tránh đáp án sai kiểu “vô nghĩa hoàn toàn”.

### 4.4 Rule về giải thích (`explanation`)

- 1–2 câu ngắn.
- Nêu “vì sao đúng” + nếu được thì ghi bài tham chiếu:
  - Ví dụ: `"입니다: 명사 뒤에 붙어 서술을 나타냅니다. (제1과)"`
  - Ví dụ: `"어제(과거) + -았/었- 를 사용합니다. (제6과)"`

## 5) Checklist kiểm tra trước khi xuất JSON

- [ ] `total_questions` = 50 và `questions.length` = 50
- [ ] `id` từ 1..50, không trùng
- [ ] Mọi `correct_answer` nằm trong range options (1-indexed)
- [ ] Không dùng từ vựng/grammar ngoài bài 1→{UP_TO_LESSON}
- [ ] Không có lỗi JSON (dấu phẩy cuối, quote, ký tự lạ…)
- [ ] Văn phong “초급 1”, câu ngắn, dễ hiểu

## 6) Output

Chỉ trả về **JSON** (không thêm giải thích ngoài JSON) để mình lưu file trực tiếp.

