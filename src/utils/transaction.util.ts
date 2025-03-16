import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class TransactionUtil {
  constructor(private readonly dataSource: DataSource) {} // DataSource를 생성자로 주입받음

  async runInTransaction<T>(
    work: (queryRunner: QueryRunner) => Promise<T>,
    onRollback?: (error: any) => Promise<void>, // 롤백 시 실행할 콜백 함수
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction(); // 불필요한 connect() 제거

    try {
      const result = await work(queryRunner);

      if (result === undefined || result === null) {
        throw new Error(`트랜잭션 실패: 작업 결과가 유효하지 않습니다.`);
      }

      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      // 트랜잭션이 활성 상태일 경우만 롤백
      if (queryRunner.isTransactionActive) {
        try {
          await queryRunner.rollbackTransaction();
        } catch (rollbackError) {
          console.error(`❌ 트랜잭션 롤백 실패:`, rollbackError);
          // 롤백이 실패했어도 원래 에러를 유지해야 함
        }
      }

      // 롤백 콜백 실행 (실패해도 트랜잭션 흐름에 영향을 주지 않도록)
      if (onRollback) {
        try {
          await onRollback(error);
        } catch (rollbackError) {
          console.error(`❌ onRollback 실행 중 오류 발생:`, rollbackError);
        }
      }

      throw error; // 원본 에러 그대로 던지기 (스택 보존)
    } finally {
      try {
        if (!queryRunner.isReleased) {
          await queryRunner.release();
        }
      } catch (releaseError) {
        console.error(`QueryRunner 해제 실패:`, releaseError);
      }
    }
  }
}
