---
name: deploy
description: build-history를 실행하고 GitHub에 force push합니다.
disable-model-invocation: true
allowed-tools: Bash(bash scripts/build-history.sh), Bash(git remote *), Bash(git push *)
---

## 단계

1. 프로젝트 루트에서 `bash scripts/build-history.sh` 실행
   - 이 스크립트는 git 히스토리를 처음부터 재구축함
   - 완료까지 수 분 소요될 수 있음
2. 스크립트 완료 후, 추가 변경사항은 무시하고 (커밋하지 않음) 바로 force push:
   ```
   git remote add origin https://github.com/jeonbyeongmin/unsolvable.git 2>/dev/null || git remote set-url origin https://github.com/jeonbyeongmin/unsolvable.git
   git push -f origin main
   ```
3. 결과를 보고
