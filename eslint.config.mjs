import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';
import node from 'eslint-plugin-n';

export default [
  js.configs.recommended, // JavaScript 기본 권장 설정
  tseslint.configs.recommended, // TypeScript 기본 권장 설정
  node.configs.recommended, // Node.js 환경에 맞는 설정 추가
  prettier, // Prettier와 충돌하는 규칙 해제
  {
    files: ['*.ts', '*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'], // TypeScript 프로젝트 설정 파일
        tsconfigRootDir: import.meta.dirname, // tsconfig.json 기준 경로 설정
        sourceType: 'module',
      },
    },
    plugins: {
      prettier: pluginPrettier, // Prettier 플러그인 추가
    },
    rules: {
      /** 🔹 기본 규칙 */
      'no-console': 'warn', // console.log 사용 시 경고
      'no-debugger': 'warn', // debugger 사용 시 경고
      'no-unused-vars': 'off', // TypeScript에서 관리하므로 비활성화
      '@typescript-eslint/no-unused-vars': ['error'], // 사용되지 않는 변수 에러 처리

      /** 🔹 TypeScript 관련 규칙 */
      '@typescript-eslint/no-explicit-any': 'warn', // any 타입 사용 경고
      '@typescript-eslint/explicit-function-return-type': 'off', // 함수 반환 타입 강제 비활성화
      '@typescript-eslint/no-non-null-assertion': 'warn', // Non-null assertion (!) 사용 시 경고
      '@typescript-eslint/no-inferrable-types': 'off', // 추론 가능한 타입 선언 비활성화

      /** 🔹 NestJS 관련 규칙 */
      '@typescript-eslint/no-var-requires': 'error', // require() 사용 금지
      '@typescript-eslint/no-empty-function': 'warn', // 빈 함수 경고
      '@typescript-eslint/no-unused-expressions': 'warn', // 불필요한 표현식 경고

      /** 🔹 코드 스타일 관련 규칙 */
      'prettier/prettier': [
        'error',
        {
          singleQuote: true, // 작은 따옴표 사용
          semi: true, // 세미콜론 강제 사용
          tabWidth: 2, // 들여쓰기 2칸
          trailingComma: 'all', // 객체 및 배열의 마지막 요소에도 쉼표 추가
          printWidth: 120, // 코드 한 줄 최대 길이 120자
          endOfLine: 'auto', // OS에 맞게 자동 줄바꿈 처리
        },
      ],
    },
  },
];
