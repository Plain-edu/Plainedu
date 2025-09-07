# 📘 plainDB 매뉴얼 (복원 & 백업)

이 문서는 `plaindb.sql` 파일을 사용하여 VSCode에서 클릭만으로 DB를 **복원(Import)** 하는 방법과,  
나의 DB를 `.sql` 파일로 **백업(Export)** 하는 방법을 설명합니다.

## 🆕 DB 구조 변경 안내 (2025-09-07 업데이트)

**새로운 통합형 구조로 마이그레이션 완료!**

### 🔵 새 구조 (통합형)
```
questions (문제 마스터)
├── question_multiple_choice (객관식 상세)
├── question_true_false (OX 상세)  
├── question_matching (매칭 상세)
└── quiz_results (사용자별 풀이 결과)
```

### 🔴 이전 구조 (분산형) - 백업됨
```
matching_quiz_backup
quiz_multiple_choice_backup
quiz_true_false_backup
```

---

## ✅ 1. 사전 준비

### 📌 MySQL 서버 설치
- **Windows**: [MySQL Installer](https://dev.mysql.com/downloads/installer/)
- **Mac**: `brew install mysql`
- **Linux**: `sudo apt install mysql-server`

### 📌 VSCode 확장 설치
- [SQLTools](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools)  
  + [SQLTools MySQL/MariaDB Driver](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools-driver-mysql)  
- 또는 [MySQL (Weijan Chen 제작, 코끼리 아이콘)](https://marketplace.visualstudio.com/items?itemName=cweijan.vscode-mysql-client2)

---

## ✅ 2. 데이터베이스 연결 설정 (SQLTools 기준)

1. `Ctrl + Shift + P` → **SQLTools: New Connection**
2. 드라이버: **MySQL/MariaDB**
3. Host, User, Password 입력 (예: `root` / 비밀번호)
4. 연결 저장 및 접속 성공 여부 확인

---

## ✅ 3. SQL 파일 복원 (Import)

제공된 **`plaindb.sql`** 파일을 VSCode에서 엽니다.  
파일 상단에는 이미 DB 생성과 복원 편의를 위한 구문이 포함되어 있어, 그대로 실행하면 됩니다:

```sql
CREATE DATABASE IF NOT EXISTS plainDB
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE plainDB;
SET FOREIGN_KEY_CHECKS=0;
START TRANSACTION;
```

### 🔹 SQLTools로 실행
1. `plaindb.sql` 파일 열기
2. `Ctrl + A` 전체 선택
3. `Ctrl + Enter` → **Execute Query**

### 🔹 MySQL 확장(코끼리 아이콘)으로 실행
1. `plaindb.sql` 파일 열기
2. 상단 **Run 버튼 클릭**  
   또는 **우클릭 → Run Query**

---

## ✅ 4. 복원 확인

- VSCode DB 탐색기에서 **plainDB** 확인
- 주요 테이블 생성 여부 확인:
  - `questions` (문제 마스터)
  - `question_multiple_choice` (객관식 상세)
  - `question_true_false` (OX 상세)
  - `question_matching` (매칭 상세)
  - `quiz_results` (풀이 결과)
  - `users` (사용자)
  - `user_points` (포인트)
- 데이터까지 들어가 있으면 복원 성공 ✅

---

## ✅ 5. DB를 `.sql` 파일로 백업 (Export)

나의 DB를 다른 PC로 옮기려면 `mysqldump`를 사용합니다.

### 📌 Windows PowerShell 예시
```powershell
PS C:\Users\yoon\vs\Plainedu> & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe" -u root -p plainDB > plainDB.sql
```

- `plainDB` → 백업할 DB 이름
- 실행 후 `Enter password:` 프롬프트가 나오면 비밀번호 입력
- 현재 폴더(`C:\Users\yoon\vs\Plainedu`)에 `plainDB.sql` 파일 생성됨

### 📌 다른 예시
- **테이블 구조만**:  
  ```bash
  mysqldump -u root -p --no-data plainDB > schema.sql
  ```
- **데이터만**:  
  ```bash
  mysqldump -u root -p --no-create-info plainDB > data.sql
  ```

---

## 📌 요약

- **복원**: `plainDB_restorable.sql` → VSCode에서 전체 실행 (`Ctrl+A → Ctrl+Enter`)
- **백업**: `mysqldump` → `.sql` 파일로 추출 후 다른 PC에서 동일하게 실행
