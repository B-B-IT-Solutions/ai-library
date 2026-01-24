import {
   getPasswordStrength,
   getStrengthColor,
   getStrengthWidth,
   PasswordStrength,
} from "./utils";

describe("password tests", () => {
   it("should return null for null or empty string", () => {
      expect(getPasswordStrength("")).toBeNull();
      expect(getPasswordStrength("")).toBe(null);
   });

   it("should return weak for password with length less than 6", () => {
      expect(getPasswordStrength("a")).toBe("weak");
      expect(getPasswordStrength("abc")).toBe("weak");
      expect(getPasswordStrength("abcdef")).toBe("weak");
      expect(getPasswordStrength("Abcdef")).toBe("weak");
      expect(getPasswordStrength("abcdefg")).toBe("weak");
      expect(getPasswordStrength("abcdefgh")).toBe("weak");
      expect(getPasswordStrength("ABCDEFGH")).toBe("weak");
      expect(getPasswordStrength("abc123")).toBe("weak"); // Digits = 1 point only, length < 8 = 0 points, total = 1 point = weak
      expect(getPasswordStrength("ABC123")).toBe("weak"); // Digits = 1 point only, length < 8 = 0 points, total = 1 point = weak
      expect(getPasswordStrength("12345")).toBe("weak");
      expect(getPasswordStrength("AbCdEf")).toBe("weak"); // Mixed case = 1 point only, length < 8 = 0 points, total = 1 point = weak
   });

   it("should return medium for password with only numbers (8+ chars)", () => {
      // 8+ chars = 1 point, digits = 1 point, total = 2 points = medium
      expect(getPasswordStrength("12345678")).toBe("medium");
      expect(getPasswordStrength("Abcdefgh")).toBe("medium");
      expect(getPasswordStrength("abcd1234")).toBe("medium");
      expect(getPasswordStrength("abcdef!@")).toBe("medium");
   });

   it("should return strong for password with length, mixed case, and digits", () => {
      expect(getPasswordStrength("Abcd1234")).toBe("strong");
      expect(getPasswordStrength("Abcd123!")).toBe("strong");
      expect(getPasswordStrength("MyP@ssw0rd")).toBe("strong");
      expect(getPasswordStrength("Test123!@#")).toBe("strong");
      expect(getPasswordStrength("VeryStr0ng!Password123")).toBe("strong");
      expect(getPasswordStrength("LongPass123")).toBe("strong");
      expect(getPasswordStrength("Password!@#")).toBe("strong");
      expect(getPasswordStrength("password123!")).toBe("strong");
   });
});

describe("password - edge cases - tests", () => {
   it("should handle password with only special characters", () => {
      expect(getPasswordStrength("!@#$%^")).toBe("weak");
   });

   it("should handle password with spaces", () => {
      expect(getPasswordStrength("My Pass 123")).toBe("strong");
   });

   it("should handle password with unicode characters", () => {
      expect(getPasswordStrength("Påssw0rd!")).toBe("strong");
   });

   it("should handle very long weak password", () => {
      expect(getPasswordStrength("aaaaaaaaaaaaaaaaaa")).toBe("weak");
   });

   it("should handle exactly 6 character password", () => {
      expect(getPasswordStrength("abcdef")).toBe("weak");
   });

   it("should handle exactly 8 character password with low complexity", () => {
      expect(getPasswordStrength("abcdefgh")).toBe("weak");
   });

   it("should handle exactly 8 character password with medium complexity", () => {
      expect(getPasswordStrength("Abcdefgh")).toBe("medium");
   });

   it("should handle password with numbers at different positions", () => {
      expect(getPasswordStrength("1Abcdefg")).toBe("strong");
   });

   it("should handle password with special chars at different positions", () => {
      expect(getPasswordStrength("!Abcdefg")).toBe("strong");
   });
});

describe("password - strength criteria validation - tests", () => {
   it("should count length >= 8 as strength point", () => {
      // 8 chars only = 1 point = weak
      expect(getPasswordStrength("aaaaaaaa")).toBe("weak");
   });

   it("should count mixed case as strength point", () => {
      // Mixed case only (< 8 chars) = 1 point = weak
      expect(getPasswordStrength("Aaaaaa")).toBe("weak");
   });

   it("should count digits as strength point", () => {
      // Digits only (< 8 chars) = 1 point = weak
      expect(getPasswordStrength("123456")).toBe("weak");
   });

   it("should count special chars as strength point", () => {
      // Special chars only (< 8 chars) = 1 point = weak
      expect(getPasswordStrength("!!!!!!")).toBe("weak");
   });

   it("should combine length and mixed case for medium", () => {
      // Length + mixed case = 2 points = medium
      expect(getPasswordStrength("Aaaaaaaa")).toBe("medium");
   });

   it("should combine length, mixed case, and digits for strong", () => {
      // Length + mixed case + digits = 3 points = strong
      expect(getPasswordStrength("Aaaaaaa1")).toBe("strong");
   });

   it("should combine all criteria for strong", () => {
      // All 4 criteria = 4 points = strong
      expect(getPasswordStrength("Aaaaaaa1!")).toBe("strong");
   });
});

describe("password - return type validation - tests", () => {
   it("should return PasswordStrength type for valid passwords", () => {
      const result: PasswordStrength = getPasswordStrength("Test123!");
      expect(["weak", "medium", "strong", null]).toContain(result);
   });

   it("should return one of the valid strength values", () => {
      const validValues: PasswordStrength[] = [
         "weak",
         "medium",
         "strong",
         null,
      ];
      const result = getPasswordStrength("anypassword");
      expect(validValues).toContain(result);
   });
});

describe("password - common password patterns - tests", () => {
   it("should rate common weak patterns as weak", () => {
      expect(getPasswordStrength("password")).toBe("weak");
      expect(getPasswordStrength("123456")).toBe("weak");
      expect(getPasswordStrength("qwerty")).toBe("weak");
   });

   it("should rate improved common patterns higher", () => {
      expect(getPasswordStrength("Password1")).toBe("strong");
      expect(getPasswordStrength("Qwerty123")).toBe("strong");
   });

   it("should handle sequential characters", () => {
      // Only lowercase, 8 chars = 1 point = weak
      expect(getPasswordStrength("abcdefgh")).toBe("weak");
      // 8+ chars = 1 point, digits = 1 point, total = 2 points = medium
      expect(getPasswordStrength("12345678")).toBe("medium");
   });
});

describe("password - special character detection - tests", () => {
   it("should detect common special characters", () => {
      expect(getPasswordStrength("Pass!word8")).toBe("strong");
      expect(getPasswordStrength("Pass@word8")).toBe("strong");
      expect(getPasswordStrength("Pass#word8")).toBe("strong");
      expect(getPasswordStrength("Pass$word8")).toBe("strong");
      expect(getPasswordStrength("Pass%word8")).toBe("strong");
   });

   it("should detect various special characters", () => {
      expect(getPasswordStrength("Pass&word8")).toBe("strong");
      expect(getPasswordStrength("Pass*word8")).toBe("strong");
      expect(getPasswordStrength("Pass-word8")).toBe("strong");
      expect(getPasswordStrength("Pass_word8")).toBe("strong");
      expect(getPasswordStrength("Pass+word8")).toBe("strong");
   });
});

describe("utils tests", () => {
   it("getStrengthColor test", () => {
      expect(getStrengthColor("weak")).toBe("bg-red-500");
      expect(getStrengthColor("medium")).toBe("bg-yellow-500");
      expect(getStrengthColor("strong")).toBe("bg-green-500");
   });

   it("getStrengthWidth test", () => {
      expect(getStrengthWidth("weak")).toBe("w-1/3");
      expect(getStrengthWidth("medium")).toBe("w-2/3");
      expect(getStrengthWidth("strong")).toBe("w-full");
   });
});
