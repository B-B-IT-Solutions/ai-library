import { compare, hash } from "./encrypt";

describe("hash tests", () => {
   it("hash test", async () => {
      const result = await hash("password123");
      expect(result).toEqual(
         "e362a9550eaa413160b9d739e3e47979547c4f866c5f820a8848ba674129ce25"
      );
   });

   it("compare test", async () => {
      const pwd1 = "password123";
      const pwd2 = "password123_";
      const encryptedPwd1 =
         "e362a9550eaa413160b9d739e3e47979547c4f866c5f820a8848ba674129ce25";
      const encryptedPwd2 =
         "e362a9550eaa413160b9d739e3e47979547c4f866c5f820a8848ba674129ce27";

      const result1 = await compare(pwd1, encryptedPwd1);
      expect(result1).toEqual(true);

      const result2 = await compare(pwd2, encryptedPwd1);
      expect(result2).toEqual(false);

      const result3 = await compare(pwd1, encryptedPwd2);
      expect(result3).toEqual(false);
   });
});
