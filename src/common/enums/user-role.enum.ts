export enum UserRole {
  ADMIN = 'admin', // 관리자 (사용자 관리, 프로젝트 삭제 등 모든 권한)
  CREATOR = 'creator', // 크리에이터 (프로젝트 생성, 수정, 삭제, 후원자와의 소통)
  USER = 'user', // 사용자 (프로젝트 탐색, 후원, 댓글 작성)
  BACKER = 'backer', // 후원자 (프로젝트 탐색, 후원, 댓글 작성) 프로젝트에 후원을 한 이력 이 있는 사용자
  MENTOR = 'mentor', // 멘토 (멘토링 제공, 프로젝트 리뷰, 창작자와 메세지 교환)
}
