export class User {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly email: string,
    readonly password: string,
    readonly address: string,
    readonly telephoneNumber: string,
    readonly gender: string,
    readonly isAdmin: boolean,
    readonly createdAt: Date,
    readonly updatedAt: Date
  ) {
    this.validate();
  }

  private validate(): void {
    // 重要なバリデーション
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('ユーザー名は必須です');
    }

    if (!this.email || this.email.trim().length === 0) {
      throw new Error('メールアドレスは必須です');
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      throw new Error('メールアドレスの形式が正しくありません');
    }

    if (!this.password || this.password.length < 8) {
      throw new Error('パスワードは8文字以上である必要があります');
    }

    if (!this.address || this.address.trim().length === 0) {
      throw new Error('住所は必須です');
    }

    if (!this.telephoneNumber || this.telephoneNumber.trim().length === 0) {
      throw new Error('電話番号は必須です');
    }

    // 電話番号の形式チェック（日本の電話番号）
    const phoneRegex = /^0\d{1,4}-\d{1,4}-\d{4}$/;
    if (!phoneRegex.test(this.telephoneNumber)) {
      throw new Error('電話番号の形式が正しくありません（例: 03-1234-5678）');
    }

    if (!this.gender || !['男性', '女性', 'その他'].includes(this.gender)) {
      throw new Error('性別は「男性」「女性」「その他」のいずれかである必要があります');
    }

    if (this.id < 0) {
      throw new Error('ユーザーIDは0以上の値である必要があります');
    }
  }

  // パスワードの検証メソッド
  async verifyPassword(password: string): Promise<boolean> {
    const bcrypt = require('bcryptjs');
    return await bcrypt.compare(password, this.password);
  }

  // パスワードのハッシュ化メソッド
  static async hashPassword(password: string): Promise<string> {
    const bcrypt = require('bcryptjs');
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
} 