import { Injectable } from '@angular/core';

export interface Statement {
  id: string;
  accountName: string;
  period: string;
  pages: number;
  /** Closing balance in minor units. */
  closingBalance: number;
}

@Injectable({ providedIn: 'root' })
export class StatementsService {
  private readonly statements: Statement[] = [
    { id: 'stm_2024_04', accountName: 'Everyday Account', period: 'April 2024', pages: 4, closingBalance: 289_120 },
    { id: 'stm_2024_03', accountName: 'Everyday Account', period: 'March 2024', pages: 5, closingBalance: 201_004 },
    { id: 'stm_saver_2024_q1', accountName: 'Pearl Saver', period: 'Jan - Mar 2024', pages: 2, closingBalance: 1_850_000 },
  ];

  list(): readonly Statement[] {
    return this.statements;
  }

  byAccount(): Map<string, Statement[]> {
    const grouped = new Map<string, Statement[]>();
    for (const statement of this.statements) {
      grouped.set(statement.accountName, [...(grouped.get(statement.accountName) ?? []), statement]);
    }
    return grouped;
  }
}
